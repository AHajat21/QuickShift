import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router"

import styles from './AppLayout.module.css'
import { api } from "../services/api"
import { useAuth } from "../context/AuthContext.tsx"
import { toast } from "sonner"
import Sidebar from "./Sidebar.tsx"
import { useEffect, useRef, useState } from "react"

const AppLayout = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { user, setUser } = useAuth()
	const menuContainerRef = useRef<HTMLDivElement>(null)

	const [openMenu, setOpenMenu] = useState(false)

	const pageNames: Record<string, string> = {
		"/dashboard": "Dashboard",
		"/company": "Company",
		"/timetables": "Timetables",
		"/availabilities": "Availabilities",
		"/settings": "Settings"
	}
	const pageName = pageNames[location.pathname] ?? "QuickShift"

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuContainerRef.current &&
				!menuContainerRef.current.contains(event.target as Node)
			) setOpenMenu(false)
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		}
	}, []);

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

			<header className={`${styles.navBar} no-print`}>
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
				</nav>
				
				
				{user?.isGuest ? 
					<Link to="/register" className={styles.guestButton}>
						Register!
					</Link>
				:
					<div className={styles.accountWrapper} ref={menuContainerRef}>
						<button
							type="button"
							className={styles.menuButton}
							aria-label={`Options for user`}
							aria-haspopup="menu"
							aria-expanded={openMenu}
							onClick={() =>
								setOpenMenu(openMenu ? false : true)
							}
						>👤</button>
						{openMenu && (
						<div className={styles.dropdown} role="menu">
							<button
								type="button"
								role="menuitem"
								onClick={() => {
									navigate("/settings")
									setOpenMenu(false)
								}}
							>Settings</button>

							{/* <button
								type="button"
								role="menuitem"
								onClick={() => {
									setOpenMenu(false)
								}}
							>Feedback</button> */}
						</div>
					)}
						<button className={styles.logoutButton} onClick={handleLogout}>
							Logout
						</button>
					</div>
				}
			</header>

			<main>
				<Outlet />
			</main>
		</div>
	)
}

export default AppLayout