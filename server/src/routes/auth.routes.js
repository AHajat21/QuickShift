import express from "express"
import { register, login, logout, getMe, guestRegister, guestConvert, updateMe, updatePassword, deleteMe } from "../controllers/auth.controller.js"
import { loginValidator, registrationValidator, updateMeValidator, updatePasswordValidator } from "../validators/auth.validator.js"
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

router.get(
	"/me",
	authenticate,
	getMe
)
router.patch(
	"/me",
	authenticate,
	updateMeValidator,
	updateMe
)
router.patch(
	"/me/password",
	authenticate,
	updatePasswordValidator,
	updatePassword
)
router.delete(
	"/me",
	authenticate,
	deleteMe
)

export default router