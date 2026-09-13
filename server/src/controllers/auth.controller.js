import { validationResult } from "express-validator";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { prisma } from "../lib/prisma.js"
import { generateSessionToken, hashSessionToken } from "../utils/session.js";
import cookieParser from "cookie-parser"

export const register = async (req, res, next) => {
	// VALIDATE USER INPUT
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array()
		})
	}

	const { email, password, firstName, lastName } = req.body

	// ACCESS DATABASE
	try {
		const passwordHash = await hashPassword(password)

		const user = await prisma.users.create({
			data: {
				email,
				password: passwordHash,
				firstName,
				lastName,
			}
		})

		// CREATE SESSION
		const sessionToken = generateSessionToken()
		const tokenHash = hashSessionToken(sessionToken)

		await prisma.sessions.create({
			data: {
				userId: user.id,
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
		
		res.status(201).json({
			message: "Registered successfully",
			user
		})
	} catch (error) {
		next(error)
	}

};

// MANAGER LOGIN
export const login = async (req, res, next) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array()
		})
	}

	const {email, password} = req.body
	
	try {
		// VERIFY PASSWORD WITH DATABASE
		const user = await prisma.users.findUnique({
			where: {
				email
			}
		})

		if (!user) {
			return res.status(401).json({
				message: "Invalid email or password"
			});
		}

		const passwordIsValid = await verifyPassword(password, user.password);

		if (!passwordIsValid) {
			return res.status(401).json({
				message: "Invalid email or password"
			});
		}

		// CREATE SESSION
		const sessionToken = generateSessionToken()
		const tokenHash = hashSessionToken(sessionToken)

		// DATABASE
		await prisma.sessions.create({
			data: {
				userId: user.id,
				tokenHash,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			}
		})

		// COOKIE
		res.cookie("session", sessionToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 7 * 24 * 60 * 60 * 1000
		})

		res.status(200).json({
			message: "Successful login",
			user
		})

	} catch (error) {
		next(error)
	}


};



export const getMe = async (req, res, next) => {
	try {
		const user = await prisma.users.findFirst({
			where: {
				id: req.user.id
			}
		})

		return res.status(200).json({
			message: "User found",
			user
		})
	} catch(error) {
		next(error)
	}
}



export const logout = async (req, res, next) => {
	const sessionToken = req.cookies.session
	const tokenHash = hashSessionToken(sessionToken);

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
		});
	} catch (error) {
		next(error);
	}
};