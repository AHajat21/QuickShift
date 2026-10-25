import express from "express"
import { register, login, logout, getMe, guestRegister, guestConvert } from "../controllers/auth.controller.js"
import { loginValidator, registrationValidator } from "../validators/auth.validator.js"
import { authenticate, requireGuest } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post(
	"/register",
	registrationValidator,
	register
)
router.post(
	"/login",
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

router.post(
	"/guest",
	guestRegister
)
router.post(
	"/guest/convert",
	authenticate,
	requireGuest,
	registrationValidator,
	guestConvert
)

export default router