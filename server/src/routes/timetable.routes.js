import express from "express"
import { requireCompanyMembership } from "../middleware/auth.middleware.js"
import { createTimetable, deleteTimetable, getAllTimetables, getTimetable } from "../controllers/timetable.controller.js"
import { createShift, deleteShift, getAllShifts, updateShift } from "../controllers/shift.controller.js"

const router = express.Router()

router.get(
	"/",
	requireCompanyMembership,
	getAllTimetables
)
router.post(
	"/",
	requireCompanyMembership,
	createTimetable
)

router.get(
	"/:timetableId",
	requireCompanyMembership,
	getTimetable
)
router.delete(
	"/:timetableId",
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
	requireCompanyMembership,
	createShift
)

router.patch(
	"/:timetableId/shifts/:shiftId",
	requireCompanyMembership,
	updateShift
)
router.delete(
	"/:timetableId/shifts/:shiftId",
	requireCompanyMembership,
	deleteShift
)

export default router