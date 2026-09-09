import { prisma } from "../lib/prisma.js"
import { validateShiftService } from "../services/shift.service.js"
import { isValidTime } from "../utils/timeFormat.js"


export const getAllShifts = async (req, res, next) => {
	try {
		const shiftArray = await prisma.shifts.findMany({
			where: {
				timetableId: req.params.timetableId,
				timetable: {
					companyId: req.user.companyId
				}
			}
		})

		return res.status(200).json({
			message: "All shifts have been fetched",
			shiftArray
		})
	} catch(error) {
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
			message: "Employee shifts fetched successfully",
			employeeShifts
		})
	} catch(error) {
		next(error)
	}
}


export const createShift = async (req, res, next) => {
	const { employeeId, date, startTime, endTime } = req.body
	const shiftDate = new Date(date)

	// Input validation
	if (isNaN(shiftDate.getTime()) || shiftDate < new Date()) {
		return res.status(400).json({
			message: "Date is invalid"
		})
	}
	if (!isValidTime(startTime) || !isValidTime(endTime) || startTime >= endTime) {
		return res.status(400).json({
			message: "Start time or end time is invalid"
		})
	}

	try {
		await validateShiftService({
			employeeId,
			timetableId: req.params.timetableId,
			companyId: req.user.companyId,
			shiftDate,
			startTime,
			endTime
		})

		const shift = await prisma.shifts.create({
			data: {
				employeeId,
				timetableId: req.params.timetableId,
				date: shiftDate,
				startTime,
				endTime
			}
		})

		return res.status(201).json({
			message: "Shift has been created",
			shift
		})
	} catch(error) {
		next(error)
	}
}


export const updateShift = async (req, res, next) => {
	const { employeeId, date, startTime, endTime} = req.body
	const shiftDate = new Date(date)
	if (isNaN(shiftDate.getTime()) || shiftDate < new Date()) {
		return res.status(400).json({
			message: "Date is invalid"
		})
	}
	if (!isValidTime(startTime) || !isValidTime(endTime) || startTime >= endTime) {
		return res.status(400).json({
			message: "Start time or end time is invalid"
		})
	}

	try {
		await validateShiftService({
			employeeId,
			timetableId: req.params.timetableId,
			shiftId: req.params.shiftId,
			companyId: req.user.companyId,
			shiftDate,
			startTime,
			endTime,
		})

		const newShift = await prisma.shifts.update({
			where: {
				id: req.params.shiftId
			},
			data: {
				employeeId,
				date: shiftDate,
				startTime,
				endTime
			}
		})

		return res.status(200).json({
			message: "Shift has been updated",
			newShift
		})
	} catch(error) {
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
			message: "Shift has been deleted"
		})
	} catch(error) {
		next(error)
	}
}