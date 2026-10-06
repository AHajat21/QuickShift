import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { useAuth } from '../../context/AuthContext'

import styles from "./Dashboard.module.css"
import { api } from '../../services/api'


type Shift = {
	id: string
	employeeId: string
	timetableId: string
	date: string
	day: string
	startTime: string
	endTime: string

	employee: {
		firstName: string
		lastName: string
	}
	timetable: {
		name: string
	}
}

type ShiftsByTimetable = {
	[timetableId: string]: {
		name: string
		shifts: Shift[]
	}
}

const Dashboard = () => {
	const { user } = useAuth()
	const currentDate = new Date()
	const [loading, setLoading] = useState(true)
	const [shiftsByTimetable, setShiftsByTimetable] = useState<ShiftsByTimetable>({})
	
	useEffect(() => {
		const getDashboardData = async () => {
			try {
				const todayShiftsResponse = await api.get("/timetables/shifts/today")
				const todayShifts = todayShiftsResponse.data.todayShifts

				setShiftsByTimetable(todayShifts.reduce((groups: ShiftsByTimetable, shift: Shift) => {
					const timetableId = shift.timetableId

					if (!groups[timetableId]) {
						groups[timetableId] = {
							name: shift.timetable.name,
							shifts: []
						}
					}

					groups[timetableId].shifts.push(shift)
					return groups
				}, {}))
			} catch (error) {
				console.error("Failed to fetch dashboard data:", error)
			} finally {
				setLoading(false)
			}
		}

		getDashboardData()
	}, [user])




	if (loading) return <p>Loading...</p>

	return (
		<div className={styles.dashboard}>
			<section className={styles.welcome}>
				<h1>Hello {user?.firstName}!</h1>
				<p>What would you like to do?</p>
			</section>
			

			<section className={styles.summaryCards}>
				<article className={styles.employeeCard}>
					<h2>Employees</h2>
					
					<Link to="/company">See all</Link>
				</article>

				<article className={styles.availableCard}>
					<h2>Availabilities</h2>

					<Link to="/availabilities">See all</Link>
				</article>

				<article className={styles.timeOffCard}>
					<h2>Time off</h2>

					<Link to="/time-offs">See all</Link>
				</article>
			</section>


			<section className={styles.todayShifts}>
				<h2>Today's shifts ({currentDate.toLocaleDateString()})</h2>

				<div className={styles.timetableScroll}>
					{Object.entries(shiftsByTimetable).map(([timetableId, timetable]) => (
						<div className={styles.timetableCard} key={timetableId}>
							<h3>{timetable.name}</h3>

							<div className={styles.shiftList}>
								{timetable.shifts.map(shift => (
									<div className={styles.shift} key={shift.id}>
										<span>
											{shift.startTime} - {shift.endTime}
										</span>

										<span>
											{shift.employee.firstName} {shift.employee.lastName}
										</span>
									</div>
								))}
							</div>
							<Link to={`../timetables/${timetableId}`} className={styles.viewTimetable}>Go to timetable</Link>
						</div>
					))}
				</div>
			</section>
		</div>
	)
}

export default Dashboard