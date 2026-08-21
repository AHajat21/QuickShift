import express from "express"
import { registerManager, registerEmployee } from "../controllers/auth.controller.js"
import { registrationValidator } from "../validators/auth.validator.js"

const router = express.Router()

router.post(
	"/manager/register",
	registrationValidator,
	registerManager,
)

router.post(
	"/employee/register",
	registrationValidator,
	registerEmployee,
)

export default router