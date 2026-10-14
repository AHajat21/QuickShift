import React, { useEffect, useRef, useState } from 'react'
import { api } from '../../services/api'
import { useParams } from 'react-router'

import styles from './ManageTimetable.module.css'
import UnavailabilityPanel from './components/UnavailabilityPanel.tsx'


type SelectedCell = 
 {name: "day-cell"; day: string} |
 {name: "employee-cell"; employeeId: string; eName: string} |
 {name: "shift-cell"; employeeId: string; eName: string; day: string}

const ManageTimetable = () => {
	const { timetableId } = useParams()
	const [loading, setLoading] = useState(true)
	const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
	const [weekCommencing, setWeekCommencing] = useState(new Date())

	const [shifts, setShifts] = useState<Shift[]>([])
	const [employees, setEmployees] = useState<Employee[]>([])
	const [unavailabilities, setUnavailabilities] = useState<Unavailability[]>([])
	
	const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null)
	const selectedCellStyle = {outline: '2px solid #ffffff', outlineOffset: '-2px'}
	
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
			} finally {
				setLoading(false)
			}
		}

		getTimetableData()
	}, [timetableId])


	const updateShift = async (shiftId: string, employeeId: string, day: string, field: "startTime" | "endTime", value: string) => {
		const date = new Date(weekCommencing)
		date.setDate(
			date.getDate() + daysOfWeek.indexOf(day)
		)
		try {
			await api.patch(`/timetables/${timetableId}/shifts/${shiftId}`, {
				date,
				employeeId,
				field,
				value
			})
		} catch (error) {
			console.error("Failed to update shift:", error)
			setShifts(prev =>
				prev.map(s =>
					s.id === shiftId ? { ...s, [field]: previousValue.current } : s
				)
			)
		}
	}
	const createShift = async (employeeId: string, day: string) => {
		const date = new Date(weekCommencing)
		date.setDate(
			date.getDate() + daysOfWeek.indexOf(day)
		)
		try {
			const response = await api.post(`/timetables/${timetableId}/shifts`, {
				employeeId,
				day: day.toUpperCase(),
				date
			})

			setShifts(prev => [...prev, response.data.shift])
		} catch (error) {
			console.error("Failed to create shift:", error)
		}
	}
	const deleteShift = async (shiftId: string) => {
		try {
			await api.delete(`/timetables/${timetableId}/shifts/${shiftId}`)
			setShifts(prev =>
				prev.filter(s =>
					s.id !== shiftId
				)
			)
		} catch (error) {
			console.error("Failed to remove shift:", error)
		}
	}



	if (loading) return <p>Fetching timetable data...</p>
	return (
		<div className={styles.manageTimetable}>
			<div className={styles.timetableContainer}>
				<div className={styles.timetable}>
					<div className={styles.corner}/>

					{daysOfWeek.map(day =>
						<div key={day} className={styles.dayHeader}
							onClick={() => setSelectedCell({name: 'day-cell', day})}
						> {day} </div>
					)}

					{employees.map(employee =>
						<React.Fragment key={employee.id}>
							<div className={styles.employeeCell}
								onClick={() => setSelectedCell({name: 'employee-cell', employeeId: employee.id, eName: employee.firstName})}
							> {employee.firstName} {employee.lastName} </div>

							{daysOfWeek.map(day => {
								const shift = shifts.find(shift => 
									shift.employeeId === employee.id &&
									shift.day === day.toUpperCase()
								)

								if (!shift) return (
									<button key={`${employee.id}-${day}`}
										className={styles.emptyCell}
										onClick={() => createShift(employee.id, day)}
									> + </button>
								)
								
								if (shift) return (
									<div key={`${employee.id}-${day}`} className={styles.shiftCell}
										onClick={() => setSelectedCell({name: 'shift-cell', employeeId: employee.id, eName: employee.firstName, day})}
									>
										<input
											type="time"
											value={shift.startTime}
											onFocus={() => previousValue.current = shift.startTime}
											onChange={e =>
												setShifts(prev =>
													prev.map(s =>
														s.id === shift.id ? { ...s, startTime: e.target.value } : s
													)
												)
											}
											onBlur={e => updateShift(shift.id, employee.id, day, "startTime", e.target.value)}
											title='startTime'
										/>

										<input
											type="time"
											value={shift.endTime}
											onFocus={() => previousValue.current = shift.endTime}
											onChange={e =>
												setShifts(prev =>
													prev.map(s =>
														s.id === shift.id ? { ...s, endTime: e.target.value }
														: s
													)
												)
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