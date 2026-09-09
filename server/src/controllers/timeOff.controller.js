import { prisma } from "../lib/prisma.js";

export const getAllTimeOffs = async (req, res, next) => {
	try {
		const timeOffs = await prisma.time_offs.findMany({
			where: {
				employee: {
					companyId: req.user.companyId
				}
			}
		})

		return res.status(200).json({
			message: "Employee time-offs fetched successfully",
			timeOffs
		})
	} catch(error) {
		next(error)
	}
}

export const createTimeOff = async (req, res, next) => {
	const { startDate, endDate, reason } = req.body
	try {
		const timeOff = await prisma.time_offs.create({
			data: {
				employeeId: req.params.employeeId,
				startDate,
				endDate,
				reason
			}
		})

		return res.status(201).json({
			message: "Time-off created successfully",
			timeOff
		})
	} catch(error) {
		next(error)
	}
}


export const deleteTimeOff = async (req, res, next) => {
	try {
		await prisma.time_offs.delete({
			where: {
				id: req.params.timeOffId,
				employeeId: req.params.employeeId
			}
		})

		return res.status(200).json({
			message: "Time-off deleted successfully"
		})
	} catch(error) {
		next(error)
	}
}

export const getEmployeeTimeOffs = async (req, res, next) => {
	try {
		const employeeTimeOffs = await prisma.time_offs.findMany({
			where: {
				employeeId: req.params.employeeId
			}
		})

		return res.status(200).json({
			message: "Employees time-offs fetched successfully",
			employeeTimeOffs
		})
	} catch(error) {
		next(error)
	}
}