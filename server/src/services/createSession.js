import { prisma } from "../lib/prisma.js"
import { generateSessionToken, hashSessionToken } from "../utils/session.js"

export const createSession = async (userId, res) => {
	const sessionToken = generateSessionToken()
	const tokenHash = hashSessionToken(sessionToken)

	await prisma.sessions.create({
		data: {
			userId,
			tokenHash,
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
		}
	})
	res.cookie("session", sessionToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 7 * 24 * 60 * 60 * 1000
	})
}