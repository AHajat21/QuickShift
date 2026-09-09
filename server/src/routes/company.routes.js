import express from "express"
import {  requireCompanyMembership, requireNoCompanyMembership } from "../middleware/auth.middleware.js"
import { createCompany, getCompany, deleteCompany } from "../controllers/company.controller.js"
import { getAllAvailabilities } from "../controllers/availability.controller.js"
import { getAllTimeOffs } from "../controllers/timeOff.controller.js"

const router = express.Router()

router.post(
	"/create",
	requireNoCompanyMembership,
	createCompany
)
router.get(
	"/profile",
	requireCompanyMembership,
	getCompany
)
router.delete(
	"/delete",
	requireCompanyMembership,
	deleteCompany
)


// COMPANY management
router.get(
	"/availabilities",
	requireCompanyMembership,
	getAllAvailabilities
)

router.get(
	"/time-offs",
	requireCompanyMembership,
	getAllTimeOffs
)


export default router