import React, { type SubmitEvent, useEffect, useState } from 'react'
import { api } from '../../services/api'

import styles from "./Company.module.css"

type Company = {
	id: string
	name: string
}

const Company = () => {
	const [company, setCompany] = useState<Company>()
	const [companyName, setCompanyName] = useState("")
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const getCompany = async () => {
			try {
				const response = await api.get("/companies")
				setCompany(response.data.company)
			} catch (error) {
				console.error("Failed to fetch company:", error)
			} finally {
				setLoading(false)
			}
		}

		getCompany()
	}, [])


	const createCompany = async (e: SubmitEvent) => {
		e.preventDefault()
		try {
			const response = await api.post("/companies", {
				name: companyName
			})
			setCompany(response.data.company)
		} catch (error) {
			console.error("Failed to create a company:", error)
		}
	}


	if (loading) return <p>Loading...</p>
	
	if (!company) 
		return (
			<div>
				Create your company:
				<form onSubmit={createCompany}>
					<label htmlFor="name">Company name: </label>
					<input
						id='name'
						name='name'
						type='text'
						value={companyName}
						onChange={(e) => setCompanyName(e.target.value)}
						required
					/>
					<button type='submit'>Submit</button>
				</form>
			</div>
		)

	return (
		<div>Company:
			{company.name}
		</div>
	)
}

export default Company