import { prisma } from "../lib/prisma.js";

export const createEmployee = async (req, res, next) => {
	const {firstName, lastName, email, phone} = req.body
	try {
		const employee = await prisma.employees.create({
			data: {
				companyId: req.user.companyId,
				firstName,
				lastName,
				email,
				phone
			}
		})

		return res.status(201).json({
			message: "Employee created successfully",
			employee
		})
	} catch (error) {
		next(error)
	}
}

export const getAllEmployees = async (req, res, next) => {
	try {
		const employees = await prisma.employees.findMany({
			orderBy: {
				firstName: "asc"
			},
			where: {
				companyId: req.user.companyId,
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
		const employee = await prisma.employees.findFirstOrThrow({
			where: {
				id: req.params.employeeId,
				companyId: req.user.companyId,
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


export const deleteEmployee = async (req, res, next) => {
	try {
		await prisma.employees.delete({
			where: {
				id: req.params.employeeId,
				companyId: req.user.companyId
			}
		})

		return res.status(200).json({
			message: "Employee has been deleted",
		})
	} catch (error) {
		next(error)
	}
}