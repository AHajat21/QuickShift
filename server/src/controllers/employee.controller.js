import { prisma } from "../lib/prisma.js"

export const getAllEmployees = async (req, res, next) => {
	try {
		const employees = await prisma.users.findMany({
			where: {
				companyId: req.user.companyId,
				role: "EMPLOYEE"
			}
		})
		return res.status(200).json({
			message: "All employees fetched successfully",
			employees
		})
	} catch (error) {
		next(error)
	}
}


export const getEmployee = async (req, res, next) => {
	try {
		const employee = await prisma.users.findFirstOrThrow({
			where: {
				id: req.params.id,
				companyId: req.user.companyId,
				role: "EMPLOYEE"
			}
		})

		return res.status(200).json({
			message: "Employee fetched successfully",
			employee
		})
	} catch (error) {
		next(error)
	}
}


export const removeEmployee = async (req, res, next) => {
	try {
		await prisma.users.findFirstOrThrow({
			where: {
				id: req.params.id,
				companyId: req.user.companyId,
				role: "EMPLOYEE"
			}
		})

		await prisma.users.update({
			where: {
				id: req.params.id
			},
			data: {
				companyId: null
			}
		})

		return res.status(200).json({
			message: "Employee has been removed from company",
		})
	} catch (error) {
		next(error)
	}
}




// SHIFT
export const getEmployeeShifts = async (req, res, next) => {
	try {
		const employeeShifts = await prisma.shifts.findMany({
			where: {
				employeeId: req.user.id
			}
		})

		return res.status(200).json({
			message: "Employee shifts received",
			employeeShifts
		})
	} catch(error) {
		next(error)
	}
}




// AVAILABILITIES
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
	try {
		const availability = await prisma.availabilities.findMany({
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