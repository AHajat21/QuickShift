import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router"

import styles from './AppLayout.module.css'
import { api } from "../services/api"
import { useAuth } from "../context/AuthContext.tsx"
import { toast } from "sonner"
import Sidebar from "./Sidebar.tsx"

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

			<header className={styles.navBar}>
				<h2 className={styles.pageName} onClick={() => navigate("/")}>{pageName}</h2>
				
				<nav className={styles.navLinks}>
					<NavLink to="/dashboard">
						{({ isActive }) => 
							<span className={isActive ? styles.active : ""}>Dashboard</span>
						}
					</NavLink>
					|
					<NavLink to="/timetables">
						{({ isActive }) => 
							<span className={isActive ? styles.active : ""}>Timetables</span>
						}
					</NavLink>
					|
					<NavLink to="/company">
						{({ isActive }) => 
							<span className={isActive ? styles.active : ""}>Company</span>
						}
					</NavLink>
					|
					<NavLink to="/availabilities">
						{({ isActive }) => 
							<span className={isActive ? styles.active : ""}>Availabilities</span>
						}
					</NavLink>

					{/* <NavLink to="/time-offs">
						{({ isActive }) => 
							<span className={isActive ? styles.active : ""}>Time Offs</span>
						}
					</NavLink>

					<NavLink to="/settings">
						{({ isActive }) => 
							<span className={isActive ? styles.active : ""}>Settings</span>
						}
					</NavLink> */}
				</nav>
				
				
				{user?.isGuest ? 
					<Link to="/register" className={styles.guestButton}>
						Register!
					</Link>
				:
					<button className={styles.logoutButton} onClick={handleLogout}>
						Logout
					</button>
				}
			</header>

			<main>
				<Outlet />
			</main>
		</div>
	)
}

export default AppLayout