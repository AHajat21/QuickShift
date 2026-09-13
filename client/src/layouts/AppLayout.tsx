import { Outlet, useLocation, useNavigate } from "react-router"
import Sidebar from "./Sidebar"

import styles from './AppLayout.module.css'
import { api } from "../services/api"
import { useAuth } from "../context/AuthContext.tsx"

const AppLayout = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { setUser } = useAuth()

	const pageNames: Record<string, string> = {
		"/dashboard": "Dashboard",
		"/employees": "Employees",
		"/timetables": "Timetables",
		"/time-off": "Time Offs",
		"/settings": "Settings"
	}
	const pageName = pageNames[location.pathname] ?? "QuickShift"

	const handleLogout = () => {
		api.post("/auth/logout")
		setUser(null)
		navigate("/login")
	}

	return (
		<div className={styles.appLayout}>
			<Sidebar />

			<div className={styles.mainContent}>
				<header>
					<h2>{pageName}</h2>
					<button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
				</header>

				<main>
					<Outlet />
				</main>
			</div>
		</div>
	)
}

export default AppLayout