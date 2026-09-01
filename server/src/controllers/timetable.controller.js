import { prisma } from "../lib/prisma.js"

export const getAllTimetables = async (req, res, next) => {
	try {
		const timtableArray = await prisma.timetables.findMany({
			where: {
				companyId: req.user.companyId
			}
		})

		return res.status(200).json({
			message: "All timetables fetched",
			timtableArray
		})
	} catch(error) {
		next(error)
	}
}
export const viewTimetable = async (req, res, next) => {
	try {
		const timetable = await prisma.timetables.findFirstOrThrow({
			where: {
				id: req.params.timetableId,
				companyId: req.userCompanyId
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
	if (weekCommencing === "") {
		return res.status(400).json({
			message: "Please specify a week for this timetable"
		})
	}
	if (!name) {
		name = weekCommencing
	}

	try {
		const timetable = await prisma.timetables.create({
			data: {
				companyId: req.user.companyId,
				name,
				weekCommencing: new Date(weekCommencing)
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




// AVAILABILITIES
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
	let roleDependantValidation = req.user.role === "MANAGER" ? {} : {id: req.user.id}
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