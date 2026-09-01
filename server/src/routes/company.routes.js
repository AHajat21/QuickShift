import express from "express"
import { requireEmployee, requireCompanyMembership, requireNoCompanyMembership, requireManager } from "../middleware/auth.middleware.js"
import { createCompany, joinCompany, leaveCompany, viewCompany, deleteCompany } from "../controllers/company.controller.js"

const router = express.Router()

router.post(
	"/create",
	requireManager,
	requireNoCompanyMembership,
	createCompany
)
router.post(
	"/join",
	requireEmployee,
	requireNoCompanyMembership,
	joinCompany
)
router.post(
	"/leave",
	requireEmployee,
	requireCompanyMembership,
	leaveCompany
)
router.get(
	"/profile",
	requireCompanyMembership,
	viewCompany
)

router.delete(
	"/delete",
	requireManager,
	requireCompanyMembership,
	deleteCompany
)

export default router