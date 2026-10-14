import express from "express"
import {  requireCompanyMembership, requireNoCompanyMembership } from "../middleware/auth.middleware.js"
import { createCompany, getCompany, deleteCompany } from "../controllers/company.controller.js"
import { getAllUnavailabilities } from "../controllers/unavailability.controller.js"
import { getAllTimeOffs } from "../controllers/timeOff.controller.js"

const router = express.Router()

router.post(
	"/",
	requireNoCompanyMembership,
	createCompany
)
router.get(
	"/",
	requireCompanyMembership,
	getCompany
)
router.delete(
	"/",
	requireCompanyMembership,
	deleteCompany
)


// COMPANY management
router.get(
	"/availabilities",
	requireCompanyMembership,
	getAllUnavailabilities
)

router.get(
	"/time-offs",
	requireCompanyMembership,
	getAllTimeOffs
)


export default router