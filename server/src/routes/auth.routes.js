import express from "express"
import { register, login, logout, getMe } from "../controllers/auth.controller.js"
import { loginValidator, registrationValidator } from "../validators/auth.validator.js"
import { authenticate, requireGuest } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post(
	"/register",
	requireGuest,
	registrationValidator,
	register
)
router.post(
	"/login",
	requireGuest,
	loginValidator,
	login
)
router.get(
	"/me",
	authenticate,
	getMe
)

router.post(
	"/logout",
	authenticate,
	logout
)

export default router