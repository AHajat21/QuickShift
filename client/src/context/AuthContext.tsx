import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
	id: string
	email: string
	firstName: string
	lastName?: string
	role: "MANAGER" | "EMPLOYEE"
	companyId?: string
}

type AuthContextType = {
	user: User | null
	loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const getCurrentUser = async () => {
			try {
				const response = await api.get("/auth/profile")
				setUser(response.data.user)
			} catch(error) {
				setUser(null)
			} finally {
				setLoading(false)
			}
		}

		getCurrentUser()
	}, [])

	return (
		<AuthContext.Provider value={{user, loading}}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
}