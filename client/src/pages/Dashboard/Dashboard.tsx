import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { useAuth } from '../../context/AuthContext.tsx'
import { api } from '../../services/api.js'

import styles from "./Dashboard.module.css"
import ErrorPage from '../ErrorPage/ErrorPage.tsx'
import LoadingPage from '../LoadingPage/LoadingPage.tsx'


type ShiftsByTimetable = {
	[timetableId: string]: {
		name: string
		shifts: Shift[]
	}
}

const Dashboard = () => {
	const { user } = useAuth()
	const [loading, setLoading] = useState(true)
	const [isError, setIsError] = useState(false)
	const currentDate = new Date()
	const [shiftsByTimetable, setShiftsByTimetable] = useState<ShiftsByTimetable>({})
	
	useEffect(() => {
		const getDashboardData = async () => {
			try {
				if (!user?.companyId) return
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
				setIsError(true)
			} finally {
				setLoading(false)
			}
		}

		getDashboardData()
	}, [user])




	if (loading) return <LoadingPage />
	if (isError) return <ErrorPage />

	return (
		<div className={styles.dashboard}>
			<section className={styles.welcome}>
				{user?.isGuest &&
				<div className={styles.guestNotice}>
					<h2>Notice!</h2>
					<p>
						As a guest user your data is not saved. 
						Please register to keep your data.
					</p>
				</div>
				}

				<div className={styles.greeting}>
					<h2>Hello {user?.firstName}!</h2>
					<p>What would you like to do?</p>
				</div>

				<div className={styles.generalNotice}>
					<h2>Beta version</h2>
					<p>
						Please note that this is a beta version and may contain bugs.
						I would appreciate any feedback you may have. 
						You can reach me at <a href="mailto:ahajat60@gmail.com">ahajat60@gmail.com</a>
					</p>
				</div>

			</section>
			

			<section className={styles.summaryCards}>
				<article className={styles.companyCard}>
					<h2>Company {!user?.companyId && <span> - Start here!</span>}</h2>
					<p>Manage company and employees</p>
					<Link to="/company">See all</Link>
				</article>

				<article className={styles.availableCard}>
					<h2>Availabilities</h2>
					<p>Set individual employee availabilities</p>
					<Link to="/availabilities">See all</Link>
				</article>

				<article className={styles.timetablesCard}>
					<h2>Timetables</h2>
					<p>Manage weekly rotas and shifts</p>
					<Link to="/timetables">See all</Link>
				</article>
			</section>


			<section className={styles.todayShifts}>
				<h2>Today's shifts ({currentDate.toLocaleDateString()})</h2>
				{Object.keys(shiftsByTimetable).length === 0 ?
					<div className={styles.emptyState}>
						<p>No shifts today</p>
					</div>
				:
					<div className={styles.timetableScroll}>
						{Object.entries(shiftsByTimetable).map(([tId, t]) =>
							<div className={styles.timetableCard} key={tId}>
								<h3>{t.name}</h3>

								<div className={styles.shiftList}>
									{t.shifts.map(s => 
										<div className={styles.shift} key={s.id}>
											<span>
												{s.startTime} - {s.endTime}
											</span>

											<span>
												{s.employee.firstName} {s.employee.lastName}
											</span>
										</div>
									)}
								</div>
								<Link to={`../timetables/${tId}`} className={styles.viewTimetable}>Go to timetable →</Link>
							</div>
						)}
					</div>
				}

				
			</section>
		</div>
	)
}

export default Dashboard