import { prisma } from "../lib/prisma.js";
import { hashSessionToken } from "../utils/session.js";

export const authenticate = async (req, res, next) => {
	const cookies = req.headers.cookie;
	const sessionCookie = cookies
		?.split("; ")
		.find(cookie => cookie.startsWith("session="))

	if (!cookies || !sessionCookie) {
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

		if (!userSession || new Date() >= userSession.expiresAt) {
			return res.status(401).json({
				message: "Authenitication required"
			})
		}

		req.user = userSession.user
		next()
	} catch (error) {
		next(error)
	}

};