import { prisma } from "../lib/prisma.js";

export const getAllTimesOff = async (req, res, next) => {
	try {
		const timesOff = await prisma.time_off_requests.findMany({
			where: {
				employee: {
					companyId: req.user.companyId
				}
			}
		})

		return res.status(200).json({
			message: "Employee time-off fetched successfully",
			timesOff
		})
	} catch(error) {
		next(error)
	}
}

export const createTimeOffRequest = async (req, res, next) => {
	const { startDate, endDate, reason } = req.body
	try {
		const timeOff = await prisma.time_off_requests.create({
			data: {
				employeeId: req.user.id,
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


export const cancelTimeOff = async (req, res, next) => {
	try {
		await prisma.time_off_requests.findFirstOrThrow({
			where: {
				id: req.params.timeOffId,
				employeeId: req.user.id
			}
		})
		const newTimeOff = await prisma.time_off_requests.update({
			where: {
				id: req.params.timeOffId
			},
			data: {
				status: "CANCELLED"
			}
		})

		return res.status(200).json({
			message: "Time-off cancelled successfully",
			newTimeOff
		})
	} catch(error) {
		next(error)
	}
}

export const getEmployeeTimesOff = async (req, res, next) => {
	try {
		const employeeTimesOff = await prisma.time_off_requests.findMany({
			where: {
				employeeId: req.user.id
			}
		})

		return res.status(200).json({
			message: "All times-off fetched successfully",
			employeeTimesOff
		})
	} catch(error) {
		next(error)
	}
}

export const updateTimeOffRequest = async (req, res, next) => {
	const { status } = req.body
	if (status !== "ACCEPTED" && status !== "REJECTED") {
		return res.status(400).json({
			message: "You can't update this time-off request"
		})
	}
	try {
		await prisma.time_off_requests.findFirstOrThrow({
			where: {
				id: req.params.timeOffId,
				status: "PENDING",
				employee: {
					companyId: req.user.companyId
				}
			}
		})

		const newTimeOff = await prisma.time_off_requests.update({
			where: {
				id: req.params.timeOffId
			},
			data: {
				status
			}
		})

		return res.status(200).json({
			message: "Employee time-off updated successfully",
			
		})
	} catch(error) {
		next(error)
	}
}