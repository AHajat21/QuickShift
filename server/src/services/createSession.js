import { prisma } from "../lib/prisma.js"
import { SESSION_DURATION } from "../utils/constants.js"
import { generateSessionToken, hashSessionToken } from "../utils/session.js"

export const createSession = async (userId, res) => {
	const sessionToken = generateSessionToken()
	const tokenHash = hashSessionToken(sessionToken)

	await prisma.sessions.create({
		data: {
			userId,
			tokenHash,
			expiresAt: new Date(Date.now() + SESSION_DURATION)
		}
	})
	res.cookie("session", sessionToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		path: "/",
		maxAge: SESSION_DURATION
	})
}