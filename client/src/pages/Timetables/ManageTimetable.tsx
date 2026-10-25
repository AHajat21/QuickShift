import React, { useEffect, useRef, useState } from 'react'
import { api } from '../../services/api'
import { useParams } from 'react-router'

import styles from './ManageTimetable.module.css'
import UnavailabilityPanel from './components/UnavailabilityPanel.tsx'
import { toast } from 'sonner'
import ErrorPage from '../ErrorPage/ErrorPage.tsx'
import LoadingPage from '../LoadingPage/LoadingPage.tsx'
import { dateToDay, getShiftColour } from '../../utils/helper.ts'


type SelectedCell = 
 {name: "day-cell"; day: string} |
 {name: "employee-cell"; employeeId: string; eName: string} |
 {name: "shift-cell"; employeeId: string; eName: string; day: string}

const ManageTimetable = () => {
	const { timetableId } = useParams()
	const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

	const [loading, setLoading] = useState(true)
	const [isError, setIsError] = useState(false)

	const [weekCommencing, setWeekCommencing] = useState(new Date())
	const [shifts, setShifts] = useState<Shift[]>([])
	const [employees, setEmployees] = useState<Employee[]>([])
	const [unavailabilities, setUnavailabilities] = useState<Unavailability[]>([])
	
	const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null)
	const isSelected = (cell: SelectedCell) => {
		if (!selectedCell) return false

		if (selectedCell.name === "day-cell" && cell.name === "day-cell") {
			return selectedCell.day === cell.day
		}
		if (selectedCell.name === "employee-cell" && cell.name === "employee-cell") {
			return selectedCell.employeeId === cell.employeeId
		}
		if (selectedCell.name === "shift-cell" && cell.name === "shift-cell") {
			return selectedCell.employeeId === cell.employeeId && selectedCell.day === cell.day
		}
		return false
	}
	
	const previousValue = useRef<string>("")
	

	useEffect(() => {
		const getTimetableData = async () => {
			try {
				const [timetableResponse, shiftsResponse, employeesResponse, unavailabilitiesResponse] =
					await Promise.all([
						api.get(`/timetables/${timetableId}`),
						api.get(`/timetables/${timetableId}/shifts`),
						api.get("/employees"),
						api.get("/companies/availabilities")
					])

				setWeekCommencing(new Date(timetableResponse.data.timetable.weekCommencing))
				setShifts(shiftsResponse.data.shifts)
				setEmployees(employeesResponse.data.employees)
				setUnavailabilities(unavailabilitiesResponse.data.unavailabilities)
			} catch (error) {
				console.error("Failed to fetch timetable data:", error)
				setIsError(true)
			} finally {
				setLoading(false)
			}
		}

		getTimetableData()
	}, [timetableId])


	const updateShift = async (shiftId: number, employeeId: string, day: string, field: "startTime" | "endTime", value: string) => {
		const date = dateToDay(day, weekCommencing)

		const promise = api.patch(`/timetables/${timetableId}/shifts/${shiftId}`, {
			date, employeeId, field, value
		})
		toast.promise(promise, {
			loading: "Updating shift...",
			success: "Shift updated successfully!",
			error: (error) => {
				setShifts(prev =>
					prev.map(s =>
						s.id === shiftId ? { ...s, [field]: previousValue.current } : s
					)
				)
				console.error("Failed to update shift:", error)
				return "Failed to update shift. Please try again."
			}
		})
	}
	const createShift = async (employeeId: string, day: string) => {
		const date = dateToDay(day, weekCommencing)
		
		const promise = api.post(`/timetables/${timetableId}/shifts`, {
			employeeId, day, date
		})
		toast.promise(promise, {
			loading: "Creating shift...",
			success: (response) => {
				setShifts(prev => [...prev, response.data.shift])
				return "Shift created successfully!"
			},
			error: (error) => {
				console.error("Failed to create shift:", error)
				return "Failed to create shift. Please try again."
			}
		})
	}
	const deleteShift = async (shiftId: number) => {
		const promise = api.delete(`/timetables/${timetableId}/shifts/${shiftId}`)
		toast.promise(promise, {
			loading: "Deleting shift...",
			success: () => {
				setShifts(prev =>prev.filter(s =>
					s.id !== shiftId
				))
				return "Shift deleted successfully."
			},
			error: (error) => {
				console.error("Failed to remove shift:", error)
				return "Failed to delete shift. Please try again."
			}
		})
	}


	if (loading) return <LoadingPage />
	if (isError) return <ErrorPage />

	return (
		<div className={styles.manageTimetable}>
			<div className={styles.timetableContainer}>
				<div className={styles.timetable}>
					<div className={styles.corner}/>

					{daysOfWeek.map(day =>
						<div key={day}
							className={`${styles.dayHeader} ${
								isSelected({ name: "day-cell", day }) && styles.selectedCell
							}`}
							onClick={() => setSelectedCell({name: 'day-cell', day})}
						>
							<span>{day}</span>
							<span>{dateToDay(day, weekCommencing).toLocaleDateString()}</span>
						
						</div>
					)}

					{employees.map(employee =>
						<React.Fragment key={employee.id}>
							<div
								className={`${styles.employeeCell} ${
									isSelected({
										name: "employee-cell",
										employeeId: employee.id,
										eName: employee.firstName
									}) && styles.selectedCell
								}`}
								onClick={() => setSelectedCell({
									name: 'employee-cell',
									employeeId: employee.id,
									eName: employee.firstName
								})}
							>{employee.firstName} {employee.lastName}</div>

							{daysOfWeek.map(day => {
								const shift = shifts.find(shift => 
									shift.employeeId === employee.id &&
									shift.day === day.toUpperCase()
								)

								if (!shift) return (
									<button key={`${employee.id}-${day}`}
										className={styles.emptyCell}
										onClick={() => createShift(employee.id, day.toUpperCase())}
									>+</button>
								)
								const color = getShiftColour(shift)
								if (shift) return (
									<div key={`${employee.id}-${day}`}
										className={`${styles.shiftCell} ${styles[color]} ${
											isSelected({
												name: "shift-cell",
												employeeId: employee.id,
												eName: employee.firstName,
												day
											}) && styles.selectedCell
										}`}
										onClick={() => setSelectedCell({
											name: 'shift-cell',
											employeeId: employee.id,
											eName: employee.firstName,
											day
										})}
									>
										<input
											className={styles[color]}
											type="time"
											value={shift.startTime}
											onFocus={() => previousValue.current = shift.startTime}
											onChange={e =>
												setShifts(prev => prev.map(s =>
													s.id === shift.id ? { ...s, startTime: e.target.value } : s
												))
											}
											onBlur={e => updateShift(shift.id, employee.id, day, "startTime", e.target.value)}
											title='startTime'
										/>

										<input
											type="time"
											value={shift.endTime}
											onFocus={() => previousValue.current = shift.endTime}
											onChange={e =>
												setShifts(prev => prev.map(s =>
													s.id === shift.id ? { ...s, endTime: e.target.value } : s
												))
											}
											onBlur={e => updateShift(shift.id, employee.id, day, "endTime", e.target.value)}
											title='endTime'
										/>

										<button className={styles.deleteShift} onClick={() => deleteShift(shift.id)}>X</button>
									</div>
								)

							})}
						</React.Fragment>
					)}
				</div>
			</div>



			<UnavailabilityPanel selectedCell={selectedCell} employees={employees} shifts={shifts} unavailabilities={unavailabilities}/>

		</div>
	)
}

export default ManageTimetable