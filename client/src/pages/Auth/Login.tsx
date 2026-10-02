import {type SubmitEvent , useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../../services/api.ts'
import { useAuth } from '../../context/AuthContext.tsx'

import styles from './Login.module.css'

const Login = () => {
	const { user, setUser } = useAuth()
	const navigate = useNavigate()

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	useEffect(() => {
		if (user) navigate("/dashboard", {replace: true})
	}, [user, navigate])

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()
		try {
			const response = await api.post("/auth/login", {
				email,
				password
			})
			setUser(response.data.user)
			navigate("/dashboard", { replace: true })
		} catch (error) {
			console.error("Login failed: " + error)
		}
	}

	return (
		<main className={styles.loginPage}>
			<h1 className={styles.logo}>QuickShift</h1>
			<section className={styles.loginBox}>
				<h2>Login</h2>
				<form onSubmit={handleSubmit}>
					<div className={styles.formGroup}>
						<label htmlFor='email'>Email</label>
						<input
							id='email'
							name='email'
							type='email'
							value={email}
							onChange={e => setEmail(e.target.value)}
							autoComplete='email'
							required
						/>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor='password'>Password</label>
						<input
							id='password'
							name='password'
							type='password'
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						/>
					</div>
					
					<button type='submit'>Login</button>
				</form>
			</section>
		</main>
	)
}

export default Login