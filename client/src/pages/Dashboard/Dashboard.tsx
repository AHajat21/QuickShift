import React, { useEffect } from 'react'
import { NavLink } from 'react-router'

import { useAuth } from '../../context/AuthContext'

import styles from "./Dashboard.module.css"


const Dashboard = () => {
	const {user} = useAuth()
	const currentDate = new Date()
	
	return (
		<div className={styles.dashboard}>
			<section className={styles.welcome}>
				<h2>Hello {user?.firstName}!</h2>
				<p>What would you like to do?</p>
			</section>
			

			<section className={styles.summaryCards}>
				<article className={styles.employeeCard}>
					<h3>Employees</h3>
					
					<NavLink to="/employees">See all</NavLink>
				</article>

				<article className={styles.availableCard}>
					<h3>Availabilities</h3>

					<NavLink to="/availabilities">See all</NavLink>
				</article>

				<article className={styles.timeOffCard}>
					<h3>Time off</h3>

					<NavLink to="/time-offs">See all</NavLink>
				</article>
			</section>


			<section className={styles.todaysShifts}>
				<div>
					<h3>Today ({currentDate.getDay()}, {currentDate.getDate()}): </h3>
					<NavLink to="/timetables">See all</NavLink>
				</div>

				{/* <div className={styles.shiftList}>
					<div className={styles.shift}>
						<span>09:00 - 13:00</span>
						<span>Sarah Smith</span>
					</div>
				</div> */}
			</section>


			<section className={styles.timetableOptions}>
				<NavLink to="/timetables/new">Create new timetable</NavLink>
			</section>

		</div>
	)
}

export default Dashboard