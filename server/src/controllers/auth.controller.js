import { validationResult } from "express-validator";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { prisma } from "../lib/prisma.js"
import { generateSessionToken, hashSessionToken } from "../utils/session.js";

// MANAGER REGISTRATION
export const register = async (req, res, next) => {
	// VALIDATE USER INPUT
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array()
		})
	}

	const { email, password, firstName, lastName, role } = req.body

	// ACCESS DATABASE
	try {
		const passwordHash = await hashPassword(password)

		const account = await prisma.users.create({
			data: {
				email,
				password: passwordHash,
				firstName,
				lastName,
				role
			}
		})
		
		res.status(201).json({
			message: role + " registered successfully",
			user: {
				id: account.id,
				email: account.email,
				firstName: account.firstName,
				lastName: account.lastName,
				role: account.role
			}
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
		const account = await prisma.users.findUnique({
			where: {
				email
			}
		})

		if (!account) {
			return res.status(401).json({
				message: "Invalid email or password"
			});
		}

		const passwordIsValid = await verifyPassword(password, account.password);

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
				userId: account.id,
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
			message: "Successful login"
		})

	} catch (error) {
		next(error)
	}


};



// LOGOUT
export const logout = async (req, res, next) => {
	const cookies = req.headers.cookie

	const sessionCookie = cookies
		?.split("; ")
		.find(cookie => cookie.startsWith("session="))

	if (!sessionCookie) {
		return res.status(200).json({
			message: "Logged out successfully"
		})
	}

	const sessionToken = sessionCookie.split("=")[1];
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