import { type SubmitEvent, useEffect, useState } from "react";

import { api } from "../../services/api";
import styles from "./Company.module.css";
import { toast } from "sonner";
import ErrorPage from "../ErrorPage/ErrorPage";
import LoadingPage from "../LoadingPage/LoadingPage";
import { useAuth } from "../../context/AuthContext";
import CreateCompanyPage from "../CreateCompanyPage/CreateCompany";


// const getInitials = (employee: Employee) => {
// 	const first = employee.firstName?.trim().charAt(0) ?? "";
// 	const last = employee.lastName?.trim().charAt(0) ?? "";
// 	return `${first}${last}`.toUpperCase() || "?";
// };

const Company = () => {
	const { user } = useAuth()

	const [loading, setLoading] = useState(true)
	const [isError, setIsError] = useState(false)
	const [company, setCompany] = useState<Company | null>(null)
	const [employees, setEmployees] = useState<Employee[]>([])

	const [employeeFirstName, setEmployeeFirstName] = useState("")
	const [employeeLastName, setEmployeeLastName] = useState("")

	const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null)
	const [editFirstName, setEditFirstName] = useState("")
	const [editLastName, setEditLastName] = useState("")
	const [savingEmployee, setSavingEmployee] = useState(false)
	const [creatingEmployee, setCreatingEmployee] = useState(false)

	useEffect(() => {
		let isMounted = true

		const getCompanyData = async () => {
			try {
				if (!user?.companyId) {
					if (isMounted) setCompany(null)
					return;
				}

				const [companyResponse, employeeResponse] = await Promise.all([
					api.get("/companies"),
					api.get("/employees"),
				]);

				if (!isMounted) return;

				setCompany(companyResponse.data.company)
				setEmployees(employeeResponse.data.employees)
			} catch (error) {
				console.error("Failed to fetch company data:", error)
				if (isMounted) setIsError(true)
			} finally {
				if (isMounted) setLoading(false)
			}
		}

		getCompanyData()

		return () => {
			isMounted = false
		};
	}, [user?.companyId])


	const createEmployee = async (e: SubmitEvent) => {
		e.preventDefault()

		if (!employeeFirstName.trim()) {
			toast.error("Please enter an employee's first name.")
			return
		}

		setCreatingEmployee(true);

		const promise = api.post("/employees", {
			firstName: employeeFirstName.trim(),
			lastName: employeeLastName.trim() || undefined,
		})
		toast.promise(promise, {
			loading: "Creating employee...",
			success: (response) => {
				setEmployees((previous) => [...previous, response.data.employee])
				setEmployeeFirstName("")
				setEmployeeLastName("")
				return "Employee added successfully!"
			},
			error: (error) => {
				console.error("Failed to create employee:", error)
				return "Failed to add employee. Please try again."
			},
			finally: () => setCreatingEmployee(false)
		})
	}

	const startEditing = (employee: Employee) => {
		setEditingEmployeeId(employee.id)
		setEditFirstName(employee.firstName)
		setEditLastName(employee.lastName ?? "")
	};

	const cancelEditing = () => {
		setEditingEmployeeId(null)
		setEditFirstName("")
		setEditLastName("")
	};

	const saveEmployee = async (employee: Employee) => {
		const firstName = editFirstName.trim()
		const lastName = editLastName.trim()

		if (!firstName) {
			toast.error("First name cannot be empty.")
			return
		}

		const updates: Promise<unknown>[] = []

		if (firstName !== employee.firstName) {
			updates.push(
				api.patch(`/employees/${employee.id}`, {
					employeeId: employee.id,
					field: "firstName",
					value: firstName,
				}),
			)
		}

		if (lastName !== (employee.lastName ?? "")) {
			updates.push(
				api.patch(`/employees/${employee.id}`, {
					employeeId: employee.id,
					field: "lastName",
					value: lastName,
				}),
			)
		}

		if (updates.length === 0) {
			cancelEditing()
			return
		}

		setSavingEmployee(true)

		try {
			await Promise.all(updates);
			setEmployees(prev =>
				prev.map(e =>
					e.id === employee.id
						? { ...e, firstName, lastName: lastName ?? null }
						: e,
				),
			)
			cancelEditing()
			toast.success("Employee updated successfully.")
		} catch (error) {
			console.error("Failed to update employee:", error)

			// Re-fetch in case one of the two field updates succeeded.
			try {
				const response = await api.get("/employees")
				setEmployees(response.data.employees)
			} catch (refreshError) {
				console.error("Failed to refresh employees:", refreshError)
			}

			toast.error("Couldn't update the employee. Please try again.")
		} finally {
			setSavingEmployee(false);
		}
	};

	const deleteEmployee = async (employee: Employee) => {
		const confirmed = window.confirm(
			`Delete ${employee.firstName} ${employee.lastName ?? ""}? This will remove their shifts and availability.`,
		)

		if (!confirmed) return

		const promise = api.delete(`/employees/${employee.id}`);
		toast.promise(promise, {
			loading: "Deleting employee...",
			success: () => {
				setEmployees(prev =>
					prev.filter(item => item.id !== employee.id),
				)
				return "Employee deleted."
			},
			error: (error) => {
				console.error("Failed to delete employee:", error)
				return "Failed to delete employee. Please try again."
			}
		})
	}

	if (loading) return <LoadingPage />
	if (isError) return <ErrorPage />

	if (!company) return <CreateCompanyPage />

	return (
		<main className={styles.companyPage}>
			<header className={styles.pageHeader}>
				<div>
					<p className={styles.eyebrow}>YOUR WORKSPACE</p>
					<h1>{company.name}</h1>
					<p className={styles.pageDescription}>
						Manage your team here.
					</p>
				</div>
				<div className={styles.companyBadge} aria-hidden="true">
					<svg viewBox="0 0 24 24">
						<path d="M3.5 20.5h17M5.5 20.5V6.8l6.5-3.3 6.5 3.3v13.7M9 9h.01M15 9h.01M9 13h.01M15 13h.01M10 20.5v-4h4v4" />
					</svg>
				</div>
			</header>

			<section className={styles.contentCard} aria-labelledby="employees-heading">
				<div className={styles.sectionHeader}>
					<div>
						<h2 id="employees-heading">Employees</h2>
						<p>Keep your employee's details up to date.</p>
					</div>
					<span className={styles.employeeCount}>
						{employees.length} {employees.length === 1 ? "employee" : "employees"}
					</span>
				</div>

				{employees.length === 0 ? 
					<div className={styles.emptyEmployees}>
						<div className={styles.emptyIcon} aria-hidden="true">
							<svg viewBox="0 0 24 24">
								<path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM17 8h4M19 6v4" />
							</svg>
						</div>
						<h3>Start your team here</h3>
						<p>
							Add your first employee below. You can then include them in your
							availability and shift planning.
						</p>
					</div>
				 : 
					<div className={styles.employeeList}>
						{employees.map(emp => {
							const isEditing = editingEmployeeId === emp.id;

							return (
								<div className={styles.employeeRow} key={emp.id}>
									{/* <div className={styles.avatar} aria-hidden="true">
										{getInitials(emp)}
									</div> */}

									{isEditing ? (
										<div className={styles.editFields}>
											<input
												aria-label="First name"
												value={editFirstName}
												onChange={(event) =>
													setEditFirstName(event.target.value)
												}
												autoFocus
											/>
											<input
												aria-label="Last name"
												value={editLastName}
												onChange={(event) =>
													setEditLastName(event.target.value)
												}
												placeholder="Last name"
											/>
										</div>
									) : (
										<div className={styles.employeeInfo}>
											<span className={styles.employeeName}>
												{emp.firstName} {emp.lastName}
											</span>
											{/* <span className={styles.employeeSubtext}>Team member</span> */}
										</div>
									)}

									<div className={styles.rowActions}>
										{isEditing ? 
											<>
												<button
													type="button"
													className={styles.textButton}
													onClick={cancelEditing}
													disabled={savingEmployee}
												>Cancel</button>

												<button
													type="button"
													className={styles.saveButton}
													onClick={() => saveEmployee(emp)}
													disabled={savingEmployee}
												>{savingEmployee ? "Saving…" : "Save"}</button>
											</>
										: 
											<>
												<button
													type="button"
													className={styles.iconButton}
													onClick={() => startEditing(emp)}
													aria-label={`Edit ${emp.firstName} ${emp.lastName ?? ""}`}
													title="Edit employee"
												>
													<svg viewBox="0 0 24 24" aria-hidden="true">
														<path d="m14 5 5 5M4 20l4.2-.9L19 8.3a2.1 2.1 0 0 0-3-3L5.2 16.1 4 20Z" />
													</svg>
												</button>
												<button
													type="button"
													className={`${styles.iconButton} ${styles.deleteButton}`}
													onClick={() => deleteEmployee(emp)}
													aria-label={`Delete ${emp.firstName} ${emp.lastName ?? ""}`}
													title="Delete employee"
												>
													<svg viewBox="0 0 24 24" aria-hidden="true">
														<path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" />
													</svg>
												</button>
											</>
										}
									</div>
								</div>
							)
						})}
					</div>
				}
			</section>

			<section className={styles.addEmployeeCard} aria-labelledby="add-employee-heading">
				<div className={styles.addEmployeeIntro}>
					<div className={styles.addIcon} aria-hidden="true">
						<svg viewBox="0 0 24 24">
							<path d="M12 5v14M5 12h14" />
						</svg>
					</div>
					<div>
						<h2 id="add-employee-heading">Add an employee</h2>
						<p>Add someone to your team to include them in your rotas.</p>
					</div>
				</div>

				<form className={styles.employeeForm} onSubmit={createEmployee}>
					<div className={styles.formField}>
						<label htmlFor="firstName">First name</label>
						<input
							id="firstName"
							name="firstName"
							type="text"
							placeholder="e.g. Alex"
							value={employeeFirstName}
							onChange={(event) => setEmployeeFirstName(event.target.value)}
							required
							maxLength={80}
						/>
					</div>
					<div className={styles.formField}>
						<label htmlFor="lastName">Last name <span>(optional)</span></label>
						<input
							id="lastName"
							name="lastName"
							type="text"
							placeholder="e.g. Taylor"
							value={employeeLastName}
							onChange={(event) => setEmployeeLastName(event.target.value)}
							maxLength={80}
						/>
					</div>
					<button
						className={styles.primaryButton}
						type="submit"
						disabled={creatingEmployee}
					>
						{creatingEmployee ? "Adding…" : "Add employee"}
						<span aria-hidden="true">+</span>
					</button>
				</form>
			</section>
		</main>
	);
};

export default Company;
