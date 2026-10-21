import { prisma } from "../lib/prisma.js"
import { getMonday } from "../utils/Date&Time.js"


export const getAllTimetables = async (req, res, next) => {
	try {
		const timetables = await prisma.timetables.findMany({
			where: {
				companyId: req.user.companyId
			}
		})

		return res.status(200).json({
			message: "All timetables fetched",
			timetables
		})
	} catch(error) {
		next(error)
	}
}
export const getTimetable = async (req, res, next) => {
	try {
		const timetable = await prisma.timetables.findFirstOrThrow({
			where: {
				id: req.params.timetableId,
				companyId: req.user.companyId
			}
		})

		res.status(200).json({
			message: "Timetable retrieved successfully",
			timetable
		})
	} catch(error) {
		next(error)
	}
}

export const createTimetable = async (req, res, next) => {
	let { name, weekCommencing } = req.body
	if (!name) {
		name = getMonday(weekCommencing)
	}

	try {
		const timetable = await prisma.timetables.create({
			data: {
				companyId: req.user.companyId,
				name,
				weekCommencing: getMonday(new Date(weekCommencing))
			}
		})

		return res.status(201).json({
			message: "Timetable created",
			timetable
		})
	} catch(error) {
		next(error)
	}
}

export const duplicateTimetable = async (req, res, next) => {
	const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
	const thisMonday = getMonday(new Date())
	const dayToDate = new Date(thisMonday)
	try {
		// ORIGINAL TIMETABLE
		const originalTimetable = await prisma.timetables.findFirstOrThrow({
			where: {
				id: req.params.timetableId,
				companyId: req.user.companyId
			}
		})
		// ORIGINAL SHIFTS
		const originalShifts = await prisma.shifts.findMany({
			where: {
				timetableId: originalTimetable.id,
			}
		})
		originalShifts.forEach(s => {delete s.id; delete s.createdAt; delete s.timetableId})
		const newShiftData = originalShifts.map(s => ({
				...s,
				date: new Date(dayToDate.setDate(
					dayToDate.getDate() + daysOfWeek.indexOf(s.day)
				)),
				day: s.day,
		}))

		// CREATING NESTED
		const timetable = await prisma.timetables.create({
			data: {
				companyId: req.user.companyId,
				name: originalTimetable.name,
				weekCommencing: thisMonday,

				shifts: {
					create: newShiftData
				}
			}
		})

		return res.status(201).json({
			message: "Timetable duplicated successfully!",
			timetable
		})
	} catch (error) {
		next(error)
	}
}

export const deleteTimetable = async (req, res, next) => {
	try {
		await prisma.timetables.delete({
			where: {
				id: req.params.timetableId,
				companyId: req.user.companyId
			}
		})

		return res.status(200).json({
			message: "Timetable deleted successfully"
		})
	} catch(error) {
		next(error)
	}
}