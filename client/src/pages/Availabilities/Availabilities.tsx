import React, { useEffect, useRef, useState } from 'react'

import styles from "./Availabilities.module.css"
import { api } from '../../services/api'
import { timeToMinutes } from '../../utils/time'


type Availability = {
	id: string
	employeeId: string
	startTime: string
	endTime: string
	day: string
}
type NewAvailability = {
	employeeId: string
	startTime?: string
	endTime?: string
}
type Employee = {
	id: string
	firstName: string
	lastName: string
}

const Availabilities = () => {
	const [loading, setLoading] = useState(true)
	const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
	const times = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
	const [availabilities, setAvailabilities] = useState<Availability[]>([])
	const [newAvailability, setNewAvailability] = useState<NewAvailability>()
	const [selectedDay, setSelectedDay] = useState("Monday")
	const [employees, setEmployees] = useState<Employee[]>([])

	useEffect(() => {
		const getAvilabilityData = async () => {
			try {
				const [availabilitiesResponse, employeesResponse] = 
					await Promise.all([
						api.get("/companies/availabilities"),
						api.get("/employees")
					])

				setAvailabilities(availabilitiesResponse.data.availabilities)
				setEmployees(employeesResponse.data.employees)
			} catch (error) {
				console.error("Failed to fetch availability data:", error)
			} finally {
				setLoading(false)
			}
		}

		getAvilabilityData()
	}, [])

	const createAvailability = async (employeeId: string, startTime: string, endTime: string, day: string) => {
		try {
			const response = await api.post(`/employees/${employeeId}/availabilities`, {
				startTime,
				endTime,
				day,
			})
			setAvailabilities(prev => [...prev, response.data.availability])
		} catch (error) {
			console.log("Failed to create availability:", error)
		}
	}
	const deleteAvailability = async (employeeId: string, availabilityId: string) => {
		try {
			await api.delete(`/employees/${employeeId}/availabilities/${availabilityId}`)
			setAvailabilities(prev =>
				prev.filter(a => 
					a.id !== availabilityId
			))
		} catch (error) {
			console.log("Failed to delete availability:", error)
		}
	}

	const handleAvailabilityClick = (e: React.MouseEvent<HTMLDivElement>, employeeId: string) => {
		const rect = e.currentTarget.getBoundingClientRect()
		const clickX = e.clientX - rect.left
    
		const percentage = Math.min(Math.max((clickX / rect.width), 0), 1)

		const mins = Math.round((percentage * 1440) / 15) * 15
		const hours = Math.floor(mins / 60)
		const minsRemainder = mins % 60
		const time = String(hours).padStart(2, "0") + ":" + String(minsRemainder).padStart(2, "0")


		if (!newAvailability) {
			setNewAvailability({
				employeeId,
				startTime: time
			})
			return
		}

		if (newAvailability.employeeId !== employeeId) {
			setNewAvailability(undefined)
			return
		}

		if (!newAvailability.startTime) return

		if (mins <= timeToMinutes(newAvailability.startTime)) {
			return
		}

		createAvailability(
			employeeId,
			newAvailability.startTime,
			time,
			selectedDay.toUpperCase()
		)

		setNewAvailability(undefined)
	}


	if (loading) return <p>Loading...</p>

	return (
		<div className={styles.availabilitiesPage}>

			<label>Choose a day:
				<select 
					value={selectedDay}
					onChange={e => {
						setSelectedDay(e.target.value)
						setNewAvailability(undefined)
					}}
				>
					{daysOfWeek.map(day =>
						<option value={day}>{day}</option>
					)}
				</select>
			</label>
			
			<div className={styles.availabilitiesChart}>
				<div className={styles.corner}></div>

				<div className={styles.timesHeader}>
					{times.map(t => (
						<>
							<div className={styles.smallTime}>.30</div>
							<div className={styles.bigTime}>{t}</div>
						</>
					))}
					<div className={styles.smallTime}>.30</div>
				</div>

				{employees.map(employee => (
					<React.Fragment key={employee.id}>
						<div className={styles.employeeCell}>
							{employee.firstName}
						</div>

						<div className={styles.availabilityCell}
							onMouseUp={e => handleAvailabilityClick(e, employee.id)}
						>
							{/* ONLY this employees availabilities */}
							{availabilities.filter(a => 
								a.employeeId === employee.id && 
								a.day === selectedDay.toUpperCase()
							).map(a => (
								<div key={a.id} className={styles.availabilityBar}
									style={{
										left: `${(timeToMinutes(a.startTime)/1440) * 100}%`,
										width: `${((timeToMinutes(a.endTime) - timeToMinutes(a.startTime)) / 1440) * 100}%`
									}}
								>
									<button className={styles.deleteAvailability} onClick={() => deleteAvailability(a.employeeId, a.id)}>X</button>
								</div>
							))}

							{newAvailability?.startTime && (
								<div className={styles.startTimeIndicator} style={{left: `${(timeToMinutes(newAvailability.startTime)/1440) * 100}%`}}/>
							)}
						</div>

					</React.Fragment>
				))}
			</div>



		</div>
	)
}

export default Availabilities