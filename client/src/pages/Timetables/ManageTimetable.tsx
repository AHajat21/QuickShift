import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { useParams } from 'react-router'

import styles from './ManageTimetable.module.css'


type Employee = {
	id: string
	firstName: string
}
type Shift = {
	id: string
	employeeId: string
	date: string
	day: string
	startTime: string
	endTime: string
}

const ManageTimetable = () => {
	const { timetableId } = useParams()

	const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
	const [weekCommencing, setWeekCommencing] = useState(new Date())
	const [shifts, setShifts] = useState<Shift[]>([])
	const [employees, setEmployees] = useState<Employee[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const getTimetableData = async () => {
			try {
				const [timetableResponse, shiftsResponse, employeesResponse] =
						await Promise.all([
							api.get(`/timetables/${timetableId}`),
							api.get(`/timetables/${timetableId}/shifts`),
							api.get("/employees")
						])

				setWeekCommencing(new Date(timetableResponse.data.timetable.weekCommencing))
				setShifts(shiftsResponse.data.shifts)
				setEmployees(employeesResponse.data.employees)
			} catch (error) {
				console.error("Failed to fetch timetable data:", error)
			} finally {
				setLoading(false)
			}
		}

		getTimetableData()
	}, [timetableId])


	const updateShift = async (shiftId: string, field: "startTime" | "endTime", value: string) => {
		try {
			await api.patch(`/timetables/${timetableId}/shifts/${shiftId}`, {
				[field]: value
			})
		} catch (error) {
			console.error("Failed to update shift:", error)
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
				date,
				startTime: "00:00",
				endTime: "00:00"
			})
			const newShift: Shift = response.data.shift

			setShifts(prev => [...prev, newShift])
		} catch (error) {
			console.error("Failed to create shift")
		}
	}



	if (loading) return <p>Fetching timetable data...</p>

	if (employees.length === 0) return <p>You have no employees. Please add some first.</p>

	return (
		<div className={styles.viewTimetable}>

			<div className={styles.timetable}>
				<div className={styles.corner}></div>

				{daysOfWeek.map((day) => (
					<div key={day} className={styles.dayHeader}>
							{day}
					</div>
				))}

				{employees.map((employee) => (
					<React.Fragment key={employee.id}>
						<div className={styles.employeeName}>
							{employee.firstName}
						</div>

						{daysOfWeek.map((day) => {
							const shift = shifts.find(shift => 
								shift.employeeId === employee.id &&
								shift.day === day.toUpperCase()
							)
							
							if (shift) return (
								<div key={`${employee.id}-${day}`} className={styles.shiftCell}>
									<input
										type="time"
										value={shift.startTime}
										onChange={(e) => {
											setShifts(prev =>
												prev.map(s =>
													s.id === shift.id ? { ...s, startTime: e.target.value }
													: s
												)
											)
										}}
										onBlur={(e) => updateShift(shift.id, "startTime", e.target.value)}
									/>

									<span>-</span>

									<input
										type="time"
										value={shift.endTime}
										onChange={(e) => {
											setShifts(prev =>
												prev.map(s =>
													s.id === shift.id ? { ...s, endTime: e.target.value }
													: s
												)
											)
										}}
										onBlur={(e) => updateShift(shift.id, "endTime", e.target.value)}
									/>
								</div>
							)

							if (!shift) return (
								<div key={`${employee.id}-${day}`}
									className={`${styles.shiftCell} ${styles.emptyCell}`}
									onClick={() => {
										createShift(employee.id, day)
									}}
								>
									+
								</div>
							)
						})}
					</React.Fragment>
				))}
			</div>

		</div>
	)
}

export default ManageTimetable