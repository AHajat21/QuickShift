import { Link, Outlet, useLocation, useNavigate } from "react-router"
import Sidebar from "./Sidebar"

import styles from './AppLayout.module.css'
import { api } from "../services/api"
import { useAuth } from "../context/AuthContext.tsx"
import { toast } from "sonner"

const AppLayout = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { user, setUser } = useAuth()

	const pageNames: Record<string, string> = {
		"/dashboard": "Dashboard",
		"/company": "Company",
		"/timetables": "Timetables",
		"/availabilities": "Employee availabilities",
		"/time-offs": "Time Offs",
		"/settings": "Settings"
	}
	const pageName = pageNames[location.pathname] ?? "QuickShift"

	const handleLogout = () => {
		const promise = api.post("/auth/logout")
		toast.promise(promise, {
			loading: "Logging out...",
			success: () => {
				setUser(null)
				navigate("/login")
				return "Logged out successfully."
			},
			error: (error) => {
				console.error("Failed to logout:", error)
				return "Failed to log out. Please try again."
			}
		})
	}

	return (
		<div className={styles.appLayout}>
			<Sidebar />

			<div className={styles.mainContent}>
				<header>
					<h2 className={styles.pageName} onClick={() => navigate("/dashboard")}>{pageName}</h2>
					{user?.isGuest ? 
						<Link to="/register" className={styles.guestButton}>
							Save your data
						</Link>
					:
						<button className={styles.logoutButton}
							onClick={handleLogout}
						>Logout
						</button>
					}
				</header>

				<main>
					<Outlet />
				</main>
			</div>
		</div>
	)
}

export default AppLayout