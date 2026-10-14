import { prisma } from "../lib/prisma.js"
import { validateUnavailabilityService } from "../services/unavailability.service.js"
import { isValidTime, timeToMinutes } from "../utils/timeFormat.js"


export const getAllUnavailabilities = async (req, res, next) => {
	try {
		const unavailabilities = await prisma.unavailabilities.findMany({
			where: {
				employee: {
					companyId: req.user.companyId
				}
			}
		})

		return res.status(200).json({
			message: "All unavailabilities fetched successfully",
			availabilities
		})
	} catch(error) {
		next(error)
	}
}




export const getEmployeeUnavailabilities = async (req, res, next) => {
	try {
		const employeeUnavailabilities = await prisma.unavailabilities.findMany({
			where: {
				employeeId: req.params.employeeId,
			}
		})

		return res.status(200).json({
			message: "Employee unavailabilities fetched",
			employeeUnavailabilities
		})
	} catch(error) {
		next(error)
	}
}

export const createUnavailability = async (req, res, next) => {
	const { day, startTime, endTime } = req.body
	if (!isValidTime(startTime) || !isValidTime(endTime) || timeToMinutes(startTime) >= timeToMinutes(endTime)) {
		return res.status(400).json({
			message: "Start time or end time is invalid"
		})
	}
	
	try {
		await validateUnavailabilityService(
			{employeeId: req.params.employeeId, day, startTime, endTime}
		)

		const unavailability = await prisma.unavailabilities.create({
			data: {
				employeeId: req.params.employeeId,
				day,
				startTime,
				endTime
			}
		})

		return res.status(201).json({
			message: "Unavailability created",
			unavailability
		})
	} catch(error) {
		next(error)
	}
}

export const deleteUnavailability = async (req, res, next) => {
	try {
		await prisma.unavailabilities.delete({
			where: {
				id: req.params.unavailabilityId,
				employeeId: req.params.employeeId
			}
		})

		return res.status(200).json({
			message: "Unavailability deleted successfully"
		})
	} catch(error) {
		next(error)
	}
}