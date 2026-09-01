import express from "express"
import { requireCompanyMembership, requireManager } from "../middleware/auth.middleware.js"
import { createTimetable, deleteAvailability, deleteTimetable, getAllAvailabilities, getAllTimetables, viewTimetable } from "../controllers/timetable.controller.js"
import { createShift, deleteShift, getAllShifts, updateShift } from "../controllers/shift.controller.js"

const router = express.Router()

router.get(
	"/",
	getAllTimetables
)
router.post(
	"/",
	requireManager,
	requireCompanyMembership,
	createTimetable
)

router.get(
	"/:timetableId",
	viewTimetable
)
router.delete(
	"/:timetableId",
	requireManager,
	requireCompanyMembership,
	deleteTimetable
)




// SHIFTS
router.get(
	"/:timetableId/shifts",
	requireCompanyMembership,
	getAllShifts
)
router.post(
	"/:timetableId/shifts",
	requireManager,
	requireCompanyMembership,
	createShift
)

router.patch(
	"/:timetableId/shifts/:shiftId",
	requireManager,
	requireCompanyMembership,
	updateShift
)
router.delete(
	"/:timetableId/shifts/:shiftId",
	requireManager,
	requireCompanyMembership,
	deleteShift
)




// AVAILABILITIES
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

export default router