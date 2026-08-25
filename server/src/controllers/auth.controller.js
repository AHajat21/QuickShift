import { validationResult } from "express-validator";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { prisma } from "../lib/prisma.js"
import { generateSessionToken, hashSessionToken } from "../utils/session.js";

// MANAGER REGISTRATION
export const registerManager = async (req, res, next) => {
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

		const managerAccount = await prisma.users.create({
			data: {
				email,
				password: passwordHash,
				firstName,
				lastName,
				role:"MANAGER"
			}
		})
		
		res.status(201).json({
			message: "Manager registered successfully",
			user: {
				id: managerAccount.id,
				email: managerAccount.email,
				firstName: managerAccount.firstName,
				lastName: managerAccount.lastName,
				role: managerAccount.role
			}
		})
	} catch (error) {
		next(error)
	}

};


export const loginManager = async (req, res, next) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array()
		})
	}

	const {email, password} = req.body
	
	try {
		// VERIFY PASSWORD WITH DATABASE
		const managerAccount = await prisma.users.findUnique({
			where: {
				email
			}
		})

		if (!managerAccount) {
			return res.status(401).json({
				message: "Invalid email or password"
			});
		}

		const passwordIsValid = await verifyPassword(password, managerAccount.password);

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
				userId: managerAccount.id,
				tokenHash,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			}
		})

		// COOKIE
		res.cookie("session", sessionToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})

		res.status(201).json({
			mssage: "Successful login"
		})

	} catch (error) {
		next(error)
	}


}




export const registerEmployee = (req, res) => {

	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array()
		})
	};

	const { email, password, firstName, lastName } = req.body;


	res.json({
		message: "Registration data is valid"
	})
};