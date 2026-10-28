import { BrowserRouter, Routes, Route } from "react-router"
import { Toaster } from "sonner"
import Login from "./pages/Auth/Login.tsx"
import Register from "./pages/Auth/Register.tsx"
import AppLayout from "./layouts/AppLayout.tsx"
import Dashboard from "./pages/Dashboard/Dashboard.tsx"
import ProtectedRoute from "./components/ProtectedRoute.tsx"
import Timetables from "./pages/Timetables/Timetables.tsx"
import Company from "./pages/Company/Company.tsx"
import Unavailabilities from "./pages/Unavailabilities/Unavailabilities.tsx"
import ManageTimetable from "./pages/Timetables/ManageTimetable.tsx"
import LandingPage from "./pages/LandingPage/LandingPage.tsx"


const App = () => {

	return (
		<>
			<Toaster position="top-right" richColors />
			<BrowserRouter>
			
				<Routes>
					<Route index element={<LandingPage />} />
					<Route path="login" element={<Login />} />
					<Route path="register" element={<Register />} />

					<Route element={<ProtectedRoute />}>
						<Route element={<AppLayout />}>
							<Route path="dashboard" element={<Dashboard />} />
							<Route path="timetables" element={<Timetables />} />	
							<Route path="timetables/:timetableId" element={<ManageTimetable />} />
							<Route path="company" element={<Company />} />
							<Route path="availabilities" element={<Unavailabilities />} />
							{/* <Route path="time-offs" element={<TimeOffs />} />
							<Route path="settings" element={<Settings />} /> */}
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App
