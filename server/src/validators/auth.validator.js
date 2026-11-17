import { body } from "express-validator"

export const registrationValidator = [
	body("email")
		.trim()
		.isEmail().withMessage("A valid email is required"),

	body("password")
		.isLength({ min: 8 }).withMessage("Password must be 8 characters ")
		.trim(),

	body("firstName")
		.trim()
		.notEmpty().withMessage("First name is required"),

	body("lastName")
		.optional()
		.trim()
]

export const loginValidator = [
	body("email")
		.trim()
		.isEmail().withMessage("A valid email is required"),

	body("password")
		.notEmpty().withMessage("Password is required")
]


export const updateMeValidator = [
	body("email")
		.trim()
		.isEmail().withMessage("A valid email is required"),

	body("firstName")
		.trim()
		.notEmpty().withMessage("First name is required"),

	body("lastName")
		.optional()
		.trim()
]
export const updatePasswordValidator = [
	body("newPassword")
		.isLength({ min: 8 }).withMessage("Password must be 8 characters ")
		.trim(),
	body("currentPassword")
		.isLength({ min: 8 }).withMessage("Password must be 8 characters ")
		.trim()
]