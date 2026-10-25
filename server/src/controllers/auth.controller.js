import { validationResult } from "express-validator";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { prisma } from "../lib/prisma.js"
import { generateSessionToken, hashSessionToken } from "../utils/session.js";
import { createSession } from "../services/createSession.js";

export const register = async (req, res, next) => {
	const { email, password, firstName, lastName } = req.body

	if (req?.cookies.session) return res.status(400).json({
		message: "User data already exists. Please use guestConvert link to avoid data loss."
	})
	
	const errors = validationResult(req)
	if (!errors.isEmpty()) return res.status(400).json({
		errors: errors.array()
	})
	const passwordHash = await hashPassword(password)

	try {
		const user = await prisma.users.create({
			data: {
				email,
				password: passwordHash,
				firstName,
				lastName,
			}
		})

		await createSession(user.id, res)
		
		return res.status(201).json({
			message: "Registered successfully",
			user
		})
	} catch (error) {
		next(error)
	}
}


export const login = async (req, res, next) => {
	const {email, password} = req.body

	if (req?.cookies.session) return res.status(403).json({
		message: "You have a session active, please log out first."
	})

	const errors = validationResult(req)
	if (!errors.isEmpty()) return res.status(400).json({
		errors: errors.array()
	})

	try {
		const user = await prisma.users.findUnique({
			where: {
				email
			}
		})
		if (!user) return res.status(401).json({
			message: "Invalid email or password."
		})

		const passwordIsValid = await verifyPassword(password, user.password);

		if (!passwordIsValid) return res.status(401).json({
			message: "Invalid email or password."
		})

		await createSession(user.id, res)

		return res.status(200).json({
			message: "Successful login",
			user
		})

	} catch (error) {
		next(error)
	}
}



export const getMe = async (req, res, next) => {
	try {
		return res.status(200).json({
			message: "User found",
			user: req.user
		})
	} catch(error) {
		next(error)
	}
}



export const logout = async (req, res, next) => {
	const sessionToken = req.cookies.session
	const tokenHash = hashSessionToken(sessionToken)

	try {
		await prisma.sessions.delete({
			where: {
				tokenHash
			}
		});

		res.clearCookie("session", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/"
		});


		res.status(200).json({
			message: "Logged out successfully"
		})
	} catch (error) {
		next(error)
	}
}



export const guestRegister = async (req, res, next) => {
	const existingToken = req.cookies?.session

	try {
		if (existingToken) {
			const existingSession = await prisma.sessions.findUnique({
				where: {tokenHash: hashSessionToken(existingToken)},
				include: {user: true}
			})

			if (existingSession && existingSession?.expiresAt > new Date()) {
				return res.status(200).json({
					message: "Existing session found",
					user: existingSession.user
				})
			}
			
			if (existingSession) await prisma.sessions.delete({
				where: { id: existingSession.id }
			}) 
				
			res.clearCookie("session", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/"
			})
		}

		const user = await prisma.users.create({
			data: {isGuest: true}
		})

		await createSession(user.id, res)

		return res.status(201).json({
			message: "Guest registered successfully!",
			user
		})
	} catch (error) {
		next(error)
	}
}

export const guestConvert = async (req, res, next) => {
	const { email, password, firstName, lastName } = req.body
	const userId = req.user.id

	
	const errors = validationResult(req)
	if (!errors.isEmpty()) return res.status(400).json({
		errors: errors.array()
	})

	try {
		const passwordHash = await hashPassword(password)
		const updatedUser = prisma.users.update({
			where: {id: userId},
			data: {
				email,
				password: passwordHash,
				firstName,
				lastName,
				isGuest: false
			}
		})

		const deleteSession = prisma.sessions.deleteMany({
			where: {userId}
		})
		const sessionToken = generateSessionToken()
		const tokenHash = hashSessionToken(sessionToken)
		const createSession = prisma.sessions.create({
			data: {
				userId,
				tokenHash,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			}
		})
		const [user] = await prisma.$transaction([
			updatedUser, deleteSession, createSession
		])

		res.cookie("session", sessionToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 7 * 24 * 60 * 60 * 1000
		})

		return res.status(201).json({
			message: "Successfully registered",
			user: user
		})
	} catch (error) {
		next(error)
	}
}