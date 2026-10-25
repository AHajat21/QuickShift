import React, { useState } from 'react'
import { useNavigate, NavLink } from 'react-router'

import styles from './Sidebar.module.css'

const Sidebar = () => {
	const navigate = useNavigate()
	const [open, setOpen] = useState(false)

	return (
		<aside className={`${styles.sidebar} ${open && styles.open}`}>
			<h1 className={styles.logo} onClick={() => navigate("/")}>QuickShift</h1>

			<nav>
				<NavLink to="/dashboard" className={styles.navLink}
					onClick={() => setOpen(prev => prev === true && false)}
				>
					{({ isActive }) => 
    					<span className={isActive ? styles.active : ""}>Dashboard</span>
 					}
				</NavLink>

				<NavLink to="/timetables" className={styles.navLink}
					onClick={() => setOpen(prev => prev === true && false)}
				>
					{({ isActive }) => 
   					<span className={isActive ? styles.active : ""}>Timetables</span>
					}
				</NavLink>

				<NavLink to="/company" className={styles.navLink}
					onClick={() => setOpen(prev => prev === true && false)}
				>
					{({ isActive }) => 
   					<span className={isActive ? styles.active : ""}>Company</span>
					}
				</NavLink>

				<NavLink to="/availabilities" className={styles.navLink}
					onClick={() => setOpen(prev => prev === true && false)}
				>
					{({ isActive }) => 
   					<span className={isActive ? styles.active : ""}>Availabilities</span>
					}
				</NavLink>

				{/* <NavLink to="/time-offs" className={styles.navLink}
					onClick={() => setOpen(prev => prev === true && false)}
				>
					{({ isActive }) => 
   					<span className={isActive ? styles.active : ""}>Time Offs</span>
					}
				</NavLink>

				<NavLink to="/settings" className={styles.navLink}
					onClick={() => setOpen(prev => prev === true && false)}
				>
					{({ isActive }) => 
   					<span className={isActive ? styles.active : ""}>Settings</span>
					}
				</NavLink> */}
			</nav>

			<div 
				className={styles.pullTab}
				onClick={() => setOpen(prev => !prev)}
			>
   			<span>{open ? "<" : ">"}</span>
			</div>
		</aside>
	)
}

export default Sidebar