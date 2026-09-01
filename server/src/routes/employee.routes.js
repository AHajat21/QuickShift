import express from "express"

import { requireCompanyMembership, requireEmployee, requireManager } from "../middleware/auth.middleware.js"
import { createAvailability, getAllEmployees, getEmployee, getEmployeeAvailabilities, getEmployeeShifts, removeEmployee } from "../controllers/employee.controller.js"
import { deleteAvailability } from "../controllers/timetable.controller.js"

const router = express.Router()

// MANAGER managing employees
router.get(
	"/",
	requireManager,
	requireCompanyMembership,
	getAllEmployees
)
router.get(
	"/:userId",
	requireManager,
	requireCompanyMembership,
	getEmployee
)
router.delete(
	"/:userId",
	requireManager,
	requireCompanyMembership,
	removeEmployee
)




// SHIFTS
router.get(
	"/me/shifts",
	requireEmployee,
	requireCompanyMembership,
	getEmployeeShifts
)



// AVAILABILITY
router.get(
	"/me/availability",
	requireEmployee,
	requireCompanyMembership,
	getEmployeeAvailabilities
)
router.post(
	"/me/availability",
	requireEmployee,
	requireCompanyMembership,
	createAvailability
)
router.delete(
	"/me/availabliity/:availabilityId",
	requireEmployee,
	requireCompanyMembership,
	deleteAvailability
)

export default router