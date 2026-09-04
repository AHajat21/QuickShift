import { prisma } from "../lib/prisma.js"
import { generateJoinCode } from "../utils/generator.js"


export const createCompany = async (req, res, next) => {
	const {name, description} = req.body
	const joinCode = generateJoinCode()

	try {
		// ADD PRISMA TRANSACTION
		const company = await prisma.companies.create({
			data: {
				name,
				description,
				joinCode
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


export const joinCompany = async (req, res, next) => {
	const { joinCode } = req.body

	try {
		const company = await prisma.companies.findUniqueOrThrow({
			select: {
				id: true
			},
			where: {
				joinCode
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

		return res.status(200).json({
			message: "You've joined a company!"
		})

	} catch (error) {
		next(error)
	}


}


export const leaveCompany = async (req, res, next) => {
	try {
		await prisma.users.update({
			where: {
				id: req.user.id
			},
			data: {
				companyId: null
			}
		})

		return res.status(200).json({
			message: "You have left a company"
		})
	} catch (error) {
		next(error)
	}
}


export const viewCompany = async (req, res, next) => {
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