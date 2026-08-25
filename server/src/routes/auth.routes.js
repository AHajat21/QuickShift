import express from "express"
import { registerManager, registerEmployee, loginManager } from "../controllers/auth.controller.js"
import { loginValidator, registrationValidator } from "../validators/auth.validator.js"

const router = express.Router()

router.post(
	"/manager/register",
	registrationValidator,
	registerManager,
)
router.post(
	"/manager/login",
	loginValidator,
	loginManager
)

router.post(
	"/employee/register",
	registrationValidator,
	registerEmployee,
)

export default router