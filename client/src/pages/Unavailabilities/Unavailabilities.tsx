import React, { useEffect, useState } from 'react'

import styles from "./Unavailabilities.module.css"
import { api } from '../../services/api'
import { timeToMinutes } from '../../utils/time'
import { toast } from 'sonner'
import ErrorPage from '../ErrorPage/ErrorPage'
import LoadingPage from '../LoadingPage/LoadingPage'


type NewUnavailability = {
	employeeId: string
	startTime?: string
}

const Unavailabilities = () => {
	const [loading, setLoading] = useState(true)
	const [isError, setIsError] = useState(false)
	const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]
	const times = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
	
	const [unavailabilities, setUnavailabilities] = useState<Unavailability[]>([])
	const [newUnavailability, setNewUnavailability] = useState<NewUnavailability>()
	const [selectedDay, setSelectedDay] = useState<DayOfWeek>("MONDAY")
	const [employees, setEmployees] = useState<Employee[]>([])
	const [startTimeIndicPos, setStartTimeIndicPos] = useState("")
	const [showStartTimeIndic, setShowStartTimeIndic] = useState(false)

	useEffect(() => {
		const getUnavailabilityData = async () => {
			try {
				const [unavailabilitiesResponse, employeesResponse] = 
					await Promise.all([
						api.get("/companies/availabilities"),
						api.get("/employees")
					])

				setUnavailabilities(unavailabilitiesResponse.data.unavailabilities)
				setEmployees(employeesResponse.data.employees)
			} catch (error) {
				console.error("Failed to fetch unavailability data:", error)
				setIsError(true)
			} finally {
				setLoading(false)
			}
		}

		getUnavailabilityData()
	}, [])


	const createUnavailability = async (employeeId: string, startTime: string, endTime: string, day: string) => {
		const promise = api.post(`/employees/${employeeId}/availabilities`, {
			startTime, endTime, day,
		})
		toast.promise(promise, {
			loading: "Creating availability...",
			success: (response) => {
				setUnavailabilities(prev => [...prev, response.data.unavailability])
				return "Availability created successfully!"
			},
			error: (error) => {
				console.error("Failed to create unavailability:", error)
				return "Failed to create availability. Please try again."
			}
		})
	}
	const deleteUnavailability = async (employeeId: string, unavailabilityId: number) => {
		const promise = api.delete(`/employees/${employeeId}/availabilities/${unavailabilityId}`)
		toast.promise(promise, {
			loading: "Deleting availability...",
			success: () => {
				setUnavailabilities(prev => prev.filter(a => 
					a.id !== unavailabilityId
				))
				return "Availability deleted successfully."
			},
			error: (error) => {
				console.error("Failed to delete unavailability:", error)
				return "Failed to delete availability. Please try again."
			}
		})
	}

	const handleUnavailabilityClick = (e: React.MouseEvent<HTMLDivElement>, employeeId: string) => {
		const rect = e.currentTarget.getBoundingClientRect()
		const clickX = e.clientX - rect.left
    
		const percentage = Math.min(Math.max((clickX / rect.width), 0), 1)

		const mins = Math.round((percentage * 1440) / 15) * 15
		const hours = Math.floor(mins / 60)
		const minsRemainder = mins % 60
		const time = String(hours).padStart(2, "0") + ":" + String(minsRemainder).padStart(2, "0")


		if (!newUnavailability) {
			setNewUnavailability({
				employeeId,
				startTime: time
			})
			setShowStartTimeIndic(true)
			setStartTimeIndicPos(String(percentage*100))
			return
		}

		if (newUnavailability.employeeId !== employeeId) {
			setNewUnavailability(undefined)
			setShowStartTimeIndic(false)
			return
		}

		if (!newUnavailability.startTime) return

		if (mins <= timeToMinutes(newUnavailability.startTime)) return

		createUnavailability(
			employeeId,
			newUnavailability.startTime,
			time,
			selectedDay.toUpperCase()
		)

		setNewUnavailability(undefined)
		setShowStartTimeIndic(false)
	}


	if (loading) return <LoadingPage />
	if (isError) return <ErrorPage />

	return (
		<div className={styles.unavailabilitiesPage}>

			<div className={styles.selectDay}>
				<label htmlFor='selectedDay'>Choose a day</label>
				<select
					id='selectedDay'
					value={selectedDay}
					onChange={e => {
						setSelectedDay(e.target.value as DayOfWeek)
						setNewUnavailability(undefined)
						setShowStartTimeIndic(false)
					}}
				>
					{daysOfWeek.map(day =>
						<option key={day} value={day}>{day}</option>
					)}
				</select>
				
			</div>
			
			<div className={styles.chartContainer}>
				<div className={styles.unavailabilitiesChart}>
					<div className={styles.corner}/>

					<div className={styles.timesHeader}>
						{times.map(t => 
							<div key={t} className={styles.smallTime}>{t}</div>
						)}
					</div>

					{employees.map(employee => 
						<React.Fragment key={employee.id}>
							<div className={styles.employeeCell}>
								{employee.firstName} {employee.lastName}
							</div>

							<div className={styles.unavailabilityCell}
								onClick={e => handleUnavailabilityClick(e, employee.id)}
							>
								{/* ONLY this employees unavailabilities */}
								{unavailabilities.filter(a => 
									a.employeeId === employee.id && 
									a.day === selectedDay.toUpperCase()
								).map(a =>
									<div key={a.id} 
										className={styles.unavailabilityBar}
										title={`${a.startTime}-${a.endTime}`}
										style={{
											left: `${(timeToMinutes(a.startTime)/1440) * 100}%`,
											width: `${((timeToMinutes(a.endTime) - timeToMinutes(a.startTime)) / 1440) * 100}%`
										}}
									>
										<button className={styles.deleteUnavailability} 
											onClick={e => {
												e.stopPropagation()
												deleteUnavailability(a.employeeId, a.id)}
											}
										>X</button>
									</div>
								)}

								{(showStartTimeIndic && newUnavailability?.employeeId === employee.id) &&
									<div className={styles.startTimeIndicator}
										style={{left: `${startTimeIndicPos}%`}}
									/>
								}
							</div>

						</React.Fragment>
					)}
				</div>
			</div>
		</div>
	)
}

export default Unavailabilities