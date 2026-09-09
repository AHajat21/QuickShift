import { prisma } from "../lib/prisma.js";
import { hashSessionToken } from "../utils/session.js";

export const authenticate = async (req, res, next) => {
	const cookies = req.headers.cookie;
	const sessionCookie = cookies
		?.split("; ")
		.find(cookie => cookie.startsWith("session="))

	if (!sessionCookie) {
		return res.status(401).json({
			message: "Authentication required"
		})
	}

	const sessionToken = sessionCookie.split("=")[1]
	const tokenHash = hashSessionToken(sessionToken)
	
	try {
		const userSession = await prisma.sessions.findUnique({
			where: {
				tokenHash
			},
			include: {
				user: true
			}
		})

		if (!userSession) {
			return res.status(401).json({
				message: "Authentication required"
			});
		}

		if (new Date() >= userSession.expiresAt) {
			await prisma.sessions.delete({
				where: {
					id: userSession.id
				}
			});

			return res.status(401).json({
				message: "Authentication required"
			});
		}

		req.user = userSession.user
		next()
	} catch (error) {
		next(error)
	}

};
export const requireGuest = (req, res, next) => {
	if (req?.user) {
		return res.status(403).json({
			message: "You are logged in, please log out first"
		})
	}
	next()
}

export const requireCompanyMembership = (req, res, next) => {
	if (!req?.user.companyId) {
		return res.status(403).json({
			message: "You are not part of a company yet"
		})
	}
	next()
}
export const requireNoCompanyMembership = (req, res, next) => {
	if (req?.user.companyId) {
		return res.status(403).json({
			message: "You are already part of a company"
		})
	}
	next()
}

export const requireCompanyMatch = async (req, res, next) => {
	try {
		await prisma.employees.findUniqueOrThrow({
			where: {
				id: req.params.employeeId,
				companyId: req.user.companyId,
			}
		})
	} catch(error) {
		next(error)
	}
}