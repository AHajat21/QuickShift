import React, { useEffect, useRef, useState } from 'react'
import { api } from '../../services/api'
import { Link, useParams } from 'react-router'

import styles from './ManageTimetable.module.css'
import UnavailabilityPanel from './components/UnavailabilityPanel.tsx'
import { toast } from 'sonner'
import ErrorPage from '../ErrorPage/ErrorPage.tsx'
import LoadingPage from '../LoadingPage/LoadingPage.tsx'
import { dateToDay, getShiftColour } from '../../utils/helper.ts'
import TimePicker from 'react-time-picker'
import 'react-time-picker/dist/TimePicker.css'

type SelectedCell = 
 {name: "day-cell"; day: string} |
 {name: "employee-cell"; employeeId: string; eName: string} |
 {name: "shift-cell"; employeeId: string; eName: string; day: string}

const ManageTimetable = () => {
	const { timetableId } = useParams()
	const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

	const [loading, setLoading] = useState(true)
	const [isError, setIsError] = useState(false)

	const [timetable, setTimetable] = useState<Timetable | null>(null)
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

				setTimetable(timetableResponse.data.timetable)
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
		try {
			api.patch(`/timetables/${timetableId}/shifts/${shiftId}`, {
				date, employeeId, field, value
			})
		} catch (error) {
			console.error("Failed to update shift:", error)
			toast.error("Failed to update shift. Please try again.")
			setShifts(prev =>
				prev.map(s =>
					s.id === shiftId ? { ...s, [field]: previousValue.current } : s
				)
			)			
		}
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
	const deleteShift = async (shiftId: number, e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
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
	if (employees.length === 0) return <div className={styles.noEmployees}>You have no employees yet. Please <Link to="../company">add employees</Link> to your company first.</div>

	return (
		<div className={styles.manageTimetable}>
			<header className={styles.header}>
				<h1>{timetable?.name}</h1>
				<button className={styles.saveButton} onClick={() => window.print()}>
					<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H6.6M12 15V4M12 15L9 12M12 15L15 12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</header>
			
			<div className={styles.timetableContainer}>
				<div className={styles.timetable}>
					<div className={styles.corner}
						onClick={() => setSelectedCell(null)}
					/>

					{daysOfWeek.map(day =>
						<div key={day}
							className={`${styles.dayHeader} ${
								isSelected({ name: "day-cell", day }) && styles.selectedCell
							}`}
							onClick={() => setSelectedCell({name: 'day-cell', day})}
						>
							<span>{day.substring(0, 3)}</span>
							<span>{dateToDay(day, weekCommencing).getDate()}</span>
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
										<TimePicker
											className={styles.startTime}
											value={shift.startTime}
											onFocus={() => previousValue.current = shift.startTime}
											onChange={value =>
												setShifts(prev => prev.map(s =>
													s.id === shift.id ? { ...s, startTime: value ?? ""} : s
												))
											}
											onBlur={() => updateShift(shift.id, employee.id, day, "startTime", shift.startTime)}
											disableClock
											clearIcon={null}
											format='HH:mm'
										/>

										<TimePicker
											className={styles.endTime}
											value={shift.endTime}
											onFocus={() => previousValue.current = shift.endTime}
											onChange={value =>
												setShifts(prev => prev.map(s =>
													s.id === shift.id ? { ...s, endTime: value ?? "" } : s
												))
											}
											onBlur={() => updateShift(shift.id, employee.id, day, "endTime", shift.endTime)}
											disableClock
											clearIcon={null}
											format='HH:mm'
										/>

										<button className={styles.deleteShift} onClick={e => deleteShift(shift.id, e)}>X</button>
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