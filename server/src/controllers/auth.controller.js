import { validationResult } from "express-validator";
import { hashPassword } from "../utils/password";

export const registerManager = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array()
		})
	};

	const { email, password, firstName, lastName } = req.body;

	const passwordHash = await hashPassword(password)
	
	res.json({
		message: "Registration data is valid"
	})

};


export const registerEmployee = (req, res) => {

		if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array()
		})
	};

	const { email, password, firstName, lastName } = req.body;

	console.log({
		email,
		password,
		firstName,
		lastName
	});

	res.json({
		message: "Registration data is valid"
	})
};