import express from "express"
import { registerManager, registerEmployee, loginManager } from "../controllers/auth.controller.js"
import { loginValidator, registrationValidator } from "../validators/auth.validator.js"
import { authenticate } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post(
	"/manager/register",
	registrationValidator,
	registerManager,
)
router.get("/me", authenticate, (req, res) => {
	res.json({
		message: "You are authenticated",
		userId: req.userId
	});
});
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