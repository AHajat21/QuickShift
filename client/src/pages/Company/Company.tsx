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
	const [employeeFirstName, setEmployeeFirstName] = useState("")
	const [employeeLastName, setEmployeeLastName] = useState("")
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
			setCompanyName("")
		} catch (error) {
			console.error("Failed to create a company:", error)
		}
	}
	const createEmployee = async (e: SubmitEvent) => {
		e.preventDefault()
		try {
			const response = await api.post("/employees", {
				firstName: employeeFirstName,
				lastName: employeeLastName
			})
			setEmployees(prev => [...prev, response.data.employee])

		} catch (error) {
			console.error("Failed to create employee:", error)
		} finally {
			setEmployeeFirstName("")
			setEmployeeLastName("")
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
	const updateEmployee = async (employeeId: string, field: "firstName" | "lastName", value: string) => {
		try {
			await api.patch(`/employees/${employeeId}`, {
				employeeId, field, value
			})
		} catch (error) {
			console.error("Failed to update employee")
		}
	}


	if (loading) return <p>Loading...</p>
	
	if (!company) return (
		<div className={styles.companyPage}>
			<h1>Create your company</h1>

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
				<button type='submit'>Create</button>
			</form>
		</div>
	)

	return (
		<div className={styles.companyPage}>
			<h1>{company.name}</h1>

			<section className={styles.employeeSection}>
				<h2>Employees</h2>
				<div className={styles.employeeList}>
					{employees.length === 0 ? 
						<div className={styles.emptyState}>
							No employees yet. Add your first employee below.
						</div>
					: 
						employees.map(employee => 
							<div key={employee.id} className={styles.employeeRow}>
								<input
									type='text'
									value={employee.firstName ?? ""}
									onChange={e => 
										setEmployees(prev =>
											prev.map(emp =>
												emp.id === employee.id ? { ...emp, firstName: e.target.value } : emp
											)
										)
									}
									onBlur={e => updateEmployee(employee.id, "firstName", e.target.value)}
								/>
								<input
									type='text'
									value={employee.lastName ?? ""}
									onChange={e => 
										setEmployees(prev =>
											prev.map(emp =>
												emp.id === employee.id ? { ...emp, lastName: e.target.value } : emp
											)
										)
									}
									onBlur={e => updateEmployee(employee.id, "lastName", e.target.value)}
								/>

								<button
									className={styles.deleteEmployee}
									onClick={() => deleteEmployee(employee.id)}
									aria-label={`Delete ${employee.firstName} ${employee.lastName}`}
								>X</button>
							</div>
						)}
				</div>

				<form onSubmit={createEmployee}>
					<div className={styles.formGroup}>
						<label htmlFor="firstName">First name*</label>
						<input
							id='firstName'
							name='firstName'
							type='text'
							value={employeeFirstName}
							onChange={e => setEmployeeFirstName(e.target.value)}
							required
						/>
					</div>


					<div className={styles.formGroup}>
						<label htmlFor="lastName">Last name</label>
						<input
							id='lastName'
							name='lastName'
							type='text'
							value={employeeLastName}
							onChange={e => setEmployeeLastName(e.target.value)}
						/>
					</div>

					<button type='submit' className={styles.createEmployee}>Create</button>
				</form>
			</section>
		</div>
	)
}

export default Company