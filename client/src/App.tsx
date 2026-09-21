import { BrowserRouter, Routes, Route } from "react-router"
import Login from "./pages/Auth/Login.tsx"
import Register from "./pages/Auth/Register.tsx"
import AppLayout from "./layouts/AppLayout.tsx"
import Dashboard from "./pages/Dashboard/Dashboard.tsx"
import ProtectedRoute from "./components/ProtectedRoute.tsx"
import LandingPage from "./pages/LandingPage/LandingPage.tsx"
import Timetable from "./pages/Timetables/Timetables.tsx"
import Company from "./pages/Company/Company.tsx"
import Availabilities from "./pages/Availabilities/Availabilities.tsx"
import TimeOffs from "./pages/Time-offs/TimeOffs.tsx"
import Settings from "./pages/Settings/Settings.tsx"
import ManageTimetable from "./pages/Timetables/ManageTimetable.tsx"

const App = () => {

	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<LandingPage />} />

				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />

				<Route element={<ProtectedRoute />}>
					<Route element={<AppLayout />}>
						<Route path="dashboard" element={<Dashboard />} />
						<Route path="timetables" element={<Timetable />} />	
						<Route path="/timetables/:timetableId" element={<ManageTimetable />} />
						<Route path="company" element={<Company />} />
						<Route path="availabilities" element={<Availabilities />} />
						<Route path="time-offs" element={<TimeOffs />} />
						<Route path="settings" element={<Settings />} />
					</Route>
				</Route>
			</Routes>
			
		</BrowserRouter>
	)
}

export default App
