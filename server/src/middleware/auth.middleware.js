import { prisma } from "../lib/prisma.js";
import { hashSessionToken } from "../utils/session.js";
import { ABSOLUTE_RENEWAL_THRESHOLD, RENEWAL_THRESHOLD, SESSION_DURATION } from "../utils/constants.js";

export const authenticate = async (req, res, next) => {
	const sessionToken = req.cookies?.session
	if (!sessionToken) return res.status(401).json({
		message: "Authentication required"
	})
	const tokenHash = hashSessionToken(sessionToken)
	
	try {
		const session = await prisma.sessions.findUnique({
			where: {tokenHash},
			include: {user: true}
		})

		if (!session) return res.status(401).json({
			message: "Authentication required"
		})

		if (new Date() >= session.expiresAt || Date.now() - session.createdAt.getTime() >= ABSOLUTE_RENEWAL_THRESHOLD) {
			await prisma.sessions.delete({
				where: {id: session.id}
			})

			return res.status(401).json({
				message: "Authentication required"
			})
		}

		const timeRemaining = session.expiresAt.getTime() - new Date().getTime()
		if (timeRemaining < RENEWAL_THRESHOLD) {
			const newExpiry = new Date(Math.min(
				Date.now() + SESSION_DURATION,
				absoluteExpiry
			))

			await prisma.sessions.update({
				where: { id: session.id },
				data: {expiresAt: newExpiry}
			})

			res.cookie("session", sessionToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
				maxAge: SESSION_DURATION,
				path: "/"
			})
		}

		req.user = session.user
		next()
	} catch (error) {
		next(error)
	}
}

export const requireGuest = (req, res, next) => {
	if (!req?.user.isGuest) return res.status(403).json({
		message: "This action requires a guest account"
	})
	next()
}
export const requireCompanyMembership = (req, res, next) => {
	if (!req?.user.companyId) return res.status(403).json({
		message: "You are not part of a company yet"
	})
	next()
}
export const requireNoCompanyMembership = (req, res, next) => {
	if (req?.user.companyId) return res.status(403).json({
		message: "You are already part of a company"
	})
	next()
}

export const requireCompanyMatch = async (req, res, next) => {
	try {
		const check = await prisma.employees.findFirst({
			where: {
				id: req.params.employeeId,
				companyId: req.user.companyId,
			}
		})
		if (!check) return res.status(404).json({
			message: "You are not authorised to view this employee"
		})
		next()
	} catch(error) {
		next(error)
	}
}