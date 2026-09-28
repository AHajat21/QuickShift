import { type SubmitEvent, useEffect, useState } from 'react'
import { api } from '../../services/api'

import styles from "./Company.module.css"

type Company = {
	id: string
	name: string
}
type Employee = {
	id: string
	firstName: string
	lastName: string
}

const Company = () => {
	const [company, setCompany] = useState<Company>()
	const [employees, setEmployees] = useState<Employee[]>([])
	const [employeeName, setEmployeeName] = useState("")
	const [companyName, setCompanyName] = useState("")
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const getCompanyData = async () => {
			try {
				const [companyResponse, employeeResponse] =
					await Promise.all([
						api.get("/companies"),
						api.get("/employees")
					]) 

				setCompany(companyResponse.data.company)
				setEmployees(employeeResponse.data.employees)
			} catch (error) {
				console.error("Failed to fetch data:", error)
			} finally {
				setLoading(false)
			}
		}

		getCompanyData()
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
	const createEmployee = async (e: SubmitEvent) => {
		e.preventDefault()
		try {
			const response = await api.post("/employees", {
				firstName: employeeName
			})
			setEmployees(prev => [...prev, response.data.employee])
		} catch (error) {
			console.error("Failed to create a company:", error)
		}
	}
	const deleteEmployee = async (employeeId: string) => {
		try {
			await api.delete(`/employees/${employeeId}`)
			setEmployees(prev =>
				prev.filter(e =>
					e.id !== employeeId
				)
			)
		} catch (error) {
			console.error("Failed to remove employee:", error)
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
						onChange={e => setCompanyName(e.target.value)}
						required
					/>
					<button type='submit'>Submit</button>
				</form>
			</div>
		)

	return (
		<div className={styles.companyPage}>
			<h1>{company.name}</h1>

			<section className={styles.employeeSection}>
				<h2>Employees:</h2>
				<div className={styles.employeeList}>
					{employees.map(employee => (
						<div key={employee.id} className={styles.employeeRow}>
							{employee.firstName} {employee.lastName}

							<button className={styles.deleteEmployee} onClick={() => deleteEmployee(employee.id)}>X</button>
						</div>
					))}
				</div>

				<form onSubmit={createEmployee}>
					<label htmlFor="firstName">Employee first name: </label>
					<input
						id='firstName'
						name='firstName'
						type='text'
						value={employeeName}
						onChange={e => setEmployeeName(e.target.value)}
						required
					/>
					<button type='submit'>Create employee</button>
				</form>
			</section>
		</div>
	)
}

export default Company