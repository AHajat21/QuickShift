import { type SubmitEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { api } from '../../services/api.ts'
import { useAuth } from '../../context/AuthContext.tsx'
import { toast } from 'sonner'

import styles from './Login.module.css'
import { loginValidator } from '../../utils/helper.ts'

const Login = () => {
	const { user, setUser } = useAuth()
	const navigate = useNavigate()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	

	useEffect(() => {
		if (user?.isGuest === false) {
			navigate('/dashboard', { replace: true })
		}
	}, [user, navigate])


	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()
		if (isSubmitting) return
		setIsSubmitting(true)

		const validationError = loginValidator(email, password)
		if (validationError) {
			toast.error(validationError)
			return
		}

		if (user?.isGuest) await api.post('/auth/logout')

		const promise = api.post('/auth/login', {
			email: email.trim(),
			password,
		})

		toast.promise(promise, {
			loading: 'Logging in...',
			success: (response) => {
				setUser(response.data.user)
				navigate('/dashboard', { replace: true })
				return 'Logged in successfully!'
			},
			error: (error) => {
				console.error('Login failed:', error)
				return 'Login failed. Please check your details and try again.'
			},
		})
	}

	const continueAsGuest = async () => {
		if (user?.isGuest) {
			navigate('/dashboard', { replace: true })
			return
		}

		const promise = api.post('/auth/guest')
		toast.promise(promise, {
			loading: 'Preparing your workspace...',
			success: (response) => {
				setUser(response.data.user)
				navigate('/dashboard', { replace: true })
				return 'Guest registration successfull!'
			},
			error: (error) => {
				console.error('Guest registration failed:', error)
				return 'Failed to continue as a guest. Please try again.'
			},
		})
	}

	return (
		<main className={styles.loginPage}>
			<header className={styles.navBar}>
				<Link to="/" className={styles.logo}>QuickShift</Link>

				<Link to="/register" className={styles.registerButton}>Create account</Link>
			</header>

			<div className={styles.loginContent}>
				<section className={styles.intro}>
					<span className={styles.eyebrow}>WELCOME BACK</span>
					<h1>
						Your team. <br />
						<span>Your schedule.</span>
					</h1>
					<p>
						Pick up where you left off. <br />
						Manage your employees,
						organise your shifts and keep your team's schedule
						in one place.
					</p>
				</section>

				<section className={styles.loginBox}>
					<div className={styles.formHeader}>
						<h2>Welcome back</h2>
						<p>Enter your details to continue.</p>
					</div>

					<form onSubmit={handleSubmit}>
						<div className={styles.formGroup}>
							<label htmlFor="email">Email address</label>
							<input
								id="email"
								name="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								autoComplete="email"
								placeholder="you@example.com"
								required
							/>
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="password">Password</label>

							<input
								id="password"
								name="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete="current-password"
								placeholder="Enter your password"
								required
							/>
						</div>

						<button type="submit" className={styles.submitButton}>
							Log in
							<span aria-hidden="true">→</span>
						</button>
					</form>

					<div className={styles.accountPrompt}>
						Don't have an account?{' '}
						<Link to="/register">Register instead</Link>
					</div>

					<div className={styles.divider}>
						<span>OR</span>
					</div>

					<button
						type="button"
						className={styles.guestButton}
						onClick={continueAsGuest}
					>
						Continue as a guest
						<span aria-hidden="true">→</span>
					</button>
				</section>
			</div>
		</main>
	)
}

export default Login