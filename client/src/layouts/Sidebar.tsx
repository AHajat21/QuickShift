import React from 'react'
import { useNavigate } from 'react-router'

import styles from './Sidebar.module.css'

const Sidebar = () => {
	const navigate = useNavigate()
	return (
		<aside className={styles.sidebar}>
			<div className={styles.logo}>
				<h1>QuickShift</h1>
			</div>

			<nav>
				<button className={styles.navButton} 
					onClick={() => navigate("/dashboard")}
				> Dashboard</button>
				<button className={styles.navButton}
					onClick={() => navigate("/timetables")}
				> Timetables</button>
				<button className={styles.navButton}
					onClick={() => navigate("/company")}
				> Company</button>
				<button className={styles.navButton}
					onClick={() => navigate("/availabilities")}
				> Availabilities</button>
				<button className={styles.navButton}
					onClick={() => navigate("/time-offs")}
				> Time Offs</button>
				<button className={styles.navButton}
					onClick={() => navigate("/settings")}
				> Settings</button>
			</nav>
		</aside>
	)
}

export default Sidebar