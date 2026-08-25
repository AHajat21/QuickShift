import { validationResult } from "express-validator";
import { hashPassword } from "../utils/password.js";
import { prisma } from "../lib/prisma.js"

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


export const loginManager = (req, res, next) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array()
		})
	}

	const {email, password} = req.body
	
	try {
		const manager = await prisma.users.findUnique({
			where: {
				email
			}
		})

		if (!manager) {
			return res.status(401).json({
				message: "Invalid email or password"
			});
		}

		const passwordIsValid = await verifyPassword(password,manager.password);

		if (!passwordIsValid) {
			return res.status(401).json({
				message: "Invalid email or password"
			});
		}

		

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