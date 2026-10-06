import { prisma } from "../lib/prisma.js"
import { validateShiftService } from "../services/shift.service.js"
import { isValidTime, timeToMinutes } from "../utils/timeFormat.js"


export const getAllShifts = async (req, res, next) => {
	try {
		const shifts = await prisma.shifts.findMany({
			orderBy: [
				{employee: {firstName: "asc"}},
				{day: "asc"	}
			],
			where: {
				timetableId: req.params.timetableId,
				timetable: {
					companyId: req.user.companyId
				}
			}
		})

		return res.status(200).json({
			message: "All shifts fetched successfully!",
			shifts
		})
	} catch (error) {
		next(error)
	}
}

export const getTodayShifts = async (req, res, next) => {
	const today = new Date()

	const startOfToday = new Date(today)
	startOfToday.setHours(0, 0, 0, 0)

	const startOfTomorrow = new Date(startOfToday)
	startOfTomorrow.setDate(startOfTomorrow.getDate() + 1)
	
	try {
		const todayShifts = await prisma.shifts.findMany({
			where: {
				date: {
					gte: startOfToday,
					lt: startOfTomorrow

				},
				timetable: {
					companyId: req.user.companyId
				}
			},
			include: {
				timetable: {
					select: {name: true}
				},
				employee: {
					select: {
						firstName: true,
						lastName: true
					}
				}
			},
			orderBy: [
				{timetableId: "asc"},
				{startTime: "asc"}
			]
		})

		return res.status(200).json({
			message: "Today's shifts fetched successfully!",
			todayShifts
		})
	} catch (error) {
		next(error)
	}
}


export const getEmployeeShifts = async (req, res, next) => {
	try {
		const employeeShifts = await prisma.shifts.findMany({
			where: {
				employeeId: req.params.employeeId,
			}
		})

		return res.status(200).json({
			message: "Employee shifts fetched successfully!",
			employeeShifts
		})
	} catch (error) {
		next(error)
	}
}


export const createShift = async (req, res, next) => {
	const { employeeId, date} = req.body
	const shiftDate = new Date(date)
	const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
	const day = daysOfWeek[shiftDate.getDay()]
	try {
		await validateShiftService({
			employeeId,
			timetableId: req.params.timetableId,
			companyId: req.user.companyId,
			shiftDate,
		})

		const shift = await prisma.shifts.create({
			data: {
				employeeId,
				timetableId: req.params.timetableId,
				date: shiftDate,
				day,
				startTime: "00:00",
				endTime: "00:00"
			}
		})

		return res.status(201).json({
			message: "Shift created successfully!",
			shift
		})
	} catch (error) {
		next(error)
	}
}


export const updateShift = async (req, res, next) => {
	const { employeeId, date, field, value} = req.body
	const shiftDate = new Date(date)
	if (isNaN(shiftDate.getTime())) {
		console.log(date)
		return res.status(400).json({
			message: "Date is invalid"
		})
	}
	if (!isValidTime(value)) {
		return res.status(400).json({
			message: "The entered time is invalid"
		})
	}

	try {
		await validateShiftService({
			employeeId,
			timetableId: req.params.timetableId,
			shiftId: req.params.shiftId,
			companyId: req.user.companyId,
			shiftDate
		})

		const newShift = await prisma.shifts.update({
			where: {
				id: req.params.shiftId
			},
			data: {
				[field]: value
			}
		})

		return res.status(200).json({
			message: "Shift updated successfully!",
			newShift
		})
	} catch (error) {
		next(error)
	}
}


export const deleteShift = async (req, res, next) => {
	try {
		await prisma.shifts.findFirstOrThrow({
			where: {
				id: req.params.shiftId,
				timetableId: req.params.timetableId,
				timetable: {
					companyId: req.user.companyId
				}
			}
		})

		await prisma.shifts.delete({
			where: {
				id: req.params.shiftId
			}
		})

		return res.status(200).json({
			message: "Shift deleted successfully!"
		})
	} catch (error) {
		next(error)
	}
}