import { useState } from 'react'
import { NavLink, Link } from 'react-router'

import styles from './Sidebar.module.css'

const Sidebar = () => {
	const [open, setOpen] = useState(false)

	return (
		<aside className={`${styles.sidebar} ${open && styles.open}`}>
			<Link to="/" className={styles.logo}>QuickShift</Link>

			<nav className={styles.navLinks}>
				<NavLink to="/dashboard" onClick={() => setOpen(false)}>
					{({ isActive }) => 
    					<span className={isActive ? styles.active : ""}>Dashboard</span>
 					}
				</NavLink>

				<NavLink to="/timetables" onClick={() => setOpen(false)}>
					{({ isActive }) => 
   					<span className={isActive ? styles.active : ""}>Timetables</span>
					}
				</NavLink>

				<NavLink to="/company" onClick={() => setOpen(false)}>
					{({ isActive }) => 
   					<span className={isActive ? styles.active : ""}>Company</span>
					}
				</NavLink>

				<NavLink to="/availabilities" onClick={() => setOpen(false)}>
					{({ isActive }) => 
   					<span className={isActive ? styles.active : ""}>Availabilities</span>
					}
				</NavLink>
			</nav>

			<div 
				className={styles.pullTab}
				onClick={() => setOpen(prev => !prev)}
			>
   			<span>||</span>
			</div>
		</aside>
	)
}

export default Sidebar