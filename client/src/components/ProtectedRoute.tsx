import { Navigate, Outlet } from "react-router"
import { useAuth } from "../context/AuthContext"
import LoadingPage from "../pages/LoadingPage/LoadingPage"

const ProtectedRoute = () => {
	const { user, loading } = useAuth()

	if (loading) {
		return <LoadingPage />
	}

	if (!user) {
		return <Navigate to="/login" replace />
	}

	return <Outlet />
}

export default ProtectedRoute