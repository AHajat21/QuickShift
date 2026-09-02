import express from "express"

import { requireCompanyMembership, requireEmployee, requireManager } from "../middleware/auth.middleware.js"
import { getAllEmployees, getEmployee, getEmployeeShifts, removeEmployee } from "../controllers/employee.controller.js"
import { createAvailability, deleteAvailability, getAllAvailabilities, getEmployeeAvailabilities } from "../controllers/availability.controller.js"
import { cancelTimeOff, createTimeOffRequest, getAllTimesOff, getEmployeeTimesOff, updateTimeOffRequest } from "../controllers/timeOff.controller.js"

const router = express.Router()

// EMPLOYEE

// self
router.get(
	"/me/shifts",
	requireEmployee,
	requireCompanyMembership,
	getEmployeeShifts
)

// availability
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
	"/me/availability/:availabilityId",
	requireEmployee,
	requireCompanyMembership,
	deleteAvailability
)

// time-off
router.get(
	"/me/time-off",
	requireEmployee,
	requireCompanyMembership,
	getEmployeeTimesOff
)
router.post(
	"/me/time-off",
	requireEmployee,
	requireCompanyMembership,
	createTimeOffRequest
)
router.patch(
	"/me/time-off/:timeOffId",
	requireEmployee,
	requireCompanyMembership,
	cancelTimeOff
)




// MANAGER

// availability
router.get(
	"/availabilities",
	requireManager,
	requireCompanyMembership,
	getAllAvailabilities
)
router.delete(
	"/availabilities/:availabilityId",
	requireManager,
	requireCompanyMembership,
	deleteAvailability
)

// time-off
router.get(
	"/times-off",
	requireManager,
	requireCompanyMembership,
	getAllTimesOff
)
router.patch(
	"/times-off/:timeOffId",
	requireManager,
	requireCompanyMembership,
	updateTimeOffRequest
)

// employees
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


export default router