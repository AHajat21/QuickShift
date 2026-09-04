import { prisma } from "../lib/prisma.js"
import { isValidTime } from "../validators/time.validator.js"


export const getAllAvailabilities = async (req, res, next) => {
	try {
		const availabilities = await prisma.availabilities.findMany({
			where: {
				employee: {
					companyId: req.user.companyId
				}
			}
		})

		return res.status(200).json({
			message: "All availabilities fetched successfully",
			availabilities
		})
	} catch(error) {
		next(error)
	}
}

export const deleteAvailability = async (req, res, next) => {
	const roleDependantValidation = req.user.role === "MANAGER" ? {} : {id: req.user.id}
	try {
		await prisma.availabilities.findFirstOrThrow({
			where: {
				id: req.params.availabilityId,
				employee: {
					...roleDependantValidation,
					companyId: req.user.companyId
				}
			}
		})

		await prisma.availabilities.delete({
			where: {
				id: req.params.availabilityId
			}
		})

		return res.status(200).json({
			message: "Availability deleted successfully"
		})
	} catch(error) {
		next(error)
	}
}


export const getEmployeeAvailabilities = async (req, res, next) => {
	try {
		const employeeAvailabilities = await prisma.availabilities.findMany({
			where: {
				employeeId: req.user.id
			}
		})

		return res.status(200).json({
			message: "Employee availabilities fetched",
			employeeAvailabilities
		})
	} catch(error) {
		next(error)
	}
}

export const createAvailability = async (req, res, next) => {
	const { dayOfWeek, startTime, endTime } = req.body
	if (!isValidTime(startTime) || !isValidTime(endTime) || startTime >= endTime) {
		return res.status(400).json({
			message: "Start time or end time is invalid"
		})
	}
	
	try {
		const availability = await prisma.availabilities.create({
			data: {
				employeeId: req.user.id,
				dayOfWeek,
				startTime,
				endTime
			}
		})

		return res.status(201).json({
			message: "Availability created",
			availability
		})
	} catch(error) {
		next(error)
	}
}