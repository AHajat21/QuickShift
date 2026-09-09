import express from "express"

import { requireCompanyMatch, requireCompanyMembership } from "../middleware/auth.middleware.js"
import { getAllEmployees, getEmployee, deleteEmployee } from "../controllers/employee.controller.js"
import { createAvailability, deleteAvailability, getEmployeeAvailabilities } from "../controllers/availability.controller.js"
import { deleteTimeOff, createTimeOff, getEmployeeTimeOffs } from "../controllers/timeOff.controller.js"
import { getEmployeeShifts } from "../controllers/shift.controller.js"

const router = express.Router()
// EMPLOYEE management

// employees
router.get(
	"/",
	requireCompanyMembership,
	getAllEmployees
)
router.get(
	"/:employeeId",
	requireCompanyMembership,
	// requireCompanyMatch integrated
	getEmployee
)
router.delete(
	"/:employeeId",
	requireCompanyMembership,
	// requireCompanyMatch integrated
	deleteEmployee
)

// shifts
router.get(
	"/:employeeId/shifts",
	requireCompanyMembership,
	requireCompanyMatch,
	getEmployeeShifts
)

// availability
router.get(
	"/:employeeId/availability",
	requireCompanyMembership,
	requireCompanyMatch,
	getEmployeeAvailabilities
)
router.post(
	"/:employeeId/availability",
	requireCompanyMembership,
	createAvailability
)
router.delete(
	"/:employeeId/availability/:availabilityId",
	requireCompanyMembership,
	requireCompanyMatch,
	deleteAvailability
)

// time-off
router.get(
	"/:employeeId/time-offs",
	requireCompanyMembership,
	requireCompanyMatch,
	getEmployeeTimeOffs
)
router.post(
	"/:employeeId/time-offs",
	requireCompanyMembership,
	requireCompanyMatch,
	createTimeOff
)
router.delete(
	"/:employeeId/time-offs/:timeOffId",
	requireCompanyMembership,
	requireCompanyMatch,
	deleteTimeOff
)




export default router