import express from "express"
import { requireCompanyMembership} from "../middleware/auth.middleware.js"
import { createTimetable, deleteTimetable, duplicateTimetable, getAllTimetables, getTimetable, updateTimetable } from "../controllers/timetable.controller.js"
import { createShift, deleteShift, getAllShifts, getTimetableShifts, getTodayShifts, updateShift } from "../controllers/shift.controller.js"

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
router.post(
	"/:timetableId",
	requireCompanyMembership,
	duplicateTimetable
)
router.patch(
	"/:timetableId",
	requireCompanyMembership,
	updateTimetable
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
	getTimetableShifts
)
router.get(
	"/shifts/today",
	requireCompanyMembership,
	getTodayShifts
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