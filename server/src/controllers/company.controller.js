import { prisma } from "../lib/prisma.js"


export const createCompany = async (req, res, next) => {
	const {name} = req.body

	try {
		// ADD PRISMA TRANSACTION
		const company = await prisma.companies.create({
			data: {
				name
			}
		})
		await prisma.users.update({
			where: {
				id: req.user.id
			},
			data: {
				companyId: company.id
			}
		})

		return res.status(201).json({
			message: "Company created successfully",
			company
		})
	} catch (error) {
		next(error)
	}
}


export const getCompany = async (req, res, next) => {
	try {
		const company = await prisma.companies.findUniqueOrThrow({
			where: {
				id: req.user.companyId
			}
		})

		return res.status(200).json({
			message: "Company data fetched successfully",
			company
		})
	} catch (error) {
		next(error)
	}
}


export const deleteCompany = async (req, res, next) => {
	try {
		await prisma.companies.delete({
			where: {
				id: req.user.companyId
			}
		})

		return res.status(200).json({
			message: "Company deleted successfully"
		})
	} catch (error) {
		next(error)
	}
}