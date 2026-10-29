import { type SubmitEvent, useEffect, useRef, useState } from 'react'
import { api } from '../../services/api'

import styles from "./Company.module.css"
import { toast } from 'sonner'
import ErrorPage from '../ErrorPage/ErrorPage'
import LoadingPage from '../LoadingPage/LoadingPage'
import { useAuth } from '../../context/AuthContext'


const Company = () => {
	const { user } = useAuth()
	const [loading, setLoading] = useState(true)
	const [isError, setIsError] = useState(false)
	const [company, setCompany] = useState<Company>()
	const [employees, setEmployees] = useState<Employee[]>([])
	const [employeeFirstName, setEmployeeFirstName] = useState("")
	const [employeeLastName, setEmployeeLastName] = useState("")
	const [companyName, setCompanyName] = useState("")
	const previousValue = useRef<string>("")
	

	useEffect(() => {
		const getCompanyData = async () => {
			try {
				if (!user?.companyId) return
				const [companyResponse, employeeResponse] =
					await Promise.all([
						api.get("/companies"),
						api.get("/employees")
					])
				setCompany(companyResponse.data.company)
				setEmployees(employeeResponse.data.employees)
			} catch (error) {
				console.error("Failed to fetch data:", error)
				setIsError(true)
			} finally {
				setLoading(false)
			}
		}

		getCompanyData()
	}, [])


	const createCompany = async (e: SubmitEvent) => {
		e.preventDefault()
		const promise = api.post("/companies", {
			name: companyName
		})
		toast.promise(promise, {
			loading: "Creating company...",
			success: (response) => {
				setCompany(response.data.company)
				setCompanyName("")
				return "Company created successfully!"
			},
			error: (error) => {
				console.error("Failed to create a company:", error)
				return "Failed to create company. Please try again."
			}
		})
	}
	const createEmployee = async (e: SubmitEvent) => {
		e.preventDefault()

		const promise = api.post("/employees", {
			firstName: employeeFirstName,
			lastName: employeeLastName
		})
		toast.promise(promise, {
			loading: "Creating employee...",
			success: (response) => {
				setEmployees(prev => [...prev, response.data.employee])
				return "Employee created successfully!"
			},
			error: (error) => {
				console.error("Failed to create employee:", error)
				return "Failed to create employee. Please try again."
			},
			finally: () => {
				setEmployeeFirstName("")
				setEmployeeLastName("")
			}
		})
	}
	const deleteEmployee = async (employeeId: string) => {
		const promise = api.delete(`/employees/${employeeId}`)
		toast.promise(promise, {
			loading: "Deleting employee...",
			success: () => {
				setEmployees(prev => prev.filter(emp =>
					emp.id !== employeeId
				))
				return "Employee deleted successfully."
			},
			error: (error) => {
				console.error("Failed to remove employee:", error)
				return "Failed to delete employee. Please try again."
			}
		})
	}
	const updateEmployee = async (employeeId: string, field: "firstName" | "lastName", value: string) => {
		const promise = api.patch(`/employees/${employeeId}`, {
			employeeId, field, value
		})
		toast.promise(promise, {
			loading: "Updating employee data...",
			success: "Employee updated successfully!",
			error: (error) => {
				setEmployees(prev => prev.map(emp => 
					emp.id === employeeId ? {...emp, [field]: previousValue.current} : emp
				))
				console.error("Failed to update employee:", error)
				return "Failed to update employee. Please try again."
			}
		})
	}


	if (loading) return <LoadingPage />
	if (isError) return <ErrorPage />
	if (!user?.companyId && !company) return (
		<div className={styles.emptyState}>
			<h1>Create your company</h1>

			<form onSubmit={createCompany}>
				<label htmlFor="name">Company name: </label>
				<div className={styles.formGroup}>
					<input
						id='name'
						name='name'
						type='text'
						value={companyName}
						onChange={e => setCompanyName(e.target.value)}
						required
					/>
					<button type='submit' className={styles.createCompany}>Create</button>
				</div>
			</form>
		</div>
	)

	return (
		<div className={styles.companyPage}>
			<h1>{company?.name}</h1>

			<section className={styles.employeeSection}>
				<h2>Employees</h2>
				<div className={styles.employeeList}>
					{employees.length === 0 ? 
						<div className={styles.employeeEmptyState}>
							No employees yet. Add your first employee below.
						</div>
					: 
						employees.map(employee => 
							<div key={employee.id} className={styles.employeeRow}>
								<input
									type='text'
									value={employee.firstName}
									onFocus={() => previousValue.current = employee.firstName}
									onChange={e => 
										setEmployees(prev => prev.map(emp =>
											emp.id === employee.id ? { ...emp, firstName: e.target.value } : emp
										))
									}
									onBlur={e => updateEmployee(employee.id, "firstName", e.target.value)}
								/>
								<input
									type='text'
									value={employee.lastName ?? ""}
									onFocus={() => previousValue.current = employee.lastName}
									onChange={e => 
										setEmployees(prev => prev.map(emp =>
											emp.id === employee.id ? { ...emp, lastName: e.target.value } : emp
										))
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