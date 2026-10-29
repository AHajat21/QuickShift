import { type SubmitEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { api } from '../../services/api.ts'
import { useAuth } from '../../context/AuthContext.tsx'
import { toast } from 'sonner'

import styles from './Register.module.css'
import { registrationValidator } from '../../utils/helper.ts'

const Register = () => {
	const { user, setUser } = useAuth()
	const navigate = useNavigate()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
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

		const validationError = registrationValidator(
			email, password, firstName
		)
		if (validationError) {
			toast.error(validationError)
			return
		}

		const isGuest = user?.isGuest === true
		const endpoint = isGuest
			? '/auth/guest/convert'
			: '/auth/register'

		const action = isGuest ? 'Link' : 'Register'

		const promise = api.post(endpoint, {
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			email: email.trim(),
			password,
		})

		toast.promise(promise, {
			loading: isGuest ? 'Linking your account...' : 'Creating your account...',
			success: (response) => {
				setUser(response.data.user)
				navigate('/dashboard', { replace: true })
				return isGuest
					? 'Account linked successfully!'
					: 'Account created successfully!'
			},
			error: (error) => {
				console.error(`${action} failed:`, error)
				return isGuest
					? 'Failed to link your account. Please try again.'
					: 'Failed to create your account. Please try again.'
			},
			finally: () => setIsSubmitting(false)
		})
	}

	const registerGuest = async () => {
		if (isSubmitting) return
		setIsSubmitting(true)
		const promise = api.post('/auth/guest')
		toast.promise(promise, {
			loading: 'Creating a guest account...',
			success: (response) => {
				setUser(response.data.user)
				navigate('/dashboard', { replace: true })
				return 'Guest registration successfull!'
			},
			error: (error) => {
				console.error('Guest registration failed:', error)
				return 'Failed to continue as a guest. Please try again.'
			},
			finally: () => setIsSubmitting(false)
		})
	}

	return (
		<main className={styles.registerPage}>
			<header className={styles.navBar}>
				<Link to="/" className={styles.logo}>QuickShift</Link>
				<Link to="/login" className={styles.loginButton}>Log in instead</Link>
			</header>

			{/* Registration content */}
			<div className={styles.registerContent}>
				<section className={styles.intro}>
					<span className={styles.eyebrow}>GET STARTED WITH QUICKSHIFT</span>
					<h1>
						Make scheduling<br />
						<span>simpler.</span>
					</h1>
					<p>
						Bring your team's shifts, availability and timetables
						together in one straightforward workspace.
					</p>
				</section>

				<section className={styles.registerBox}>
					<div className={styles.formHeader}>
						<div>
							<h2>Create your account</h2>
							<p>Enter your details to get started.</p>
						</div>
					</div>

					<form onSubmit={handleSubmit}>
						<div className={styles.nameFields}>
							<div className={styles.formGroup}>
								<label htmlFor="firstName">First name</label>
								<input
									id="firstName"
									name="firstName"
									type="text"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									autoComplete="given-name"
									placeholder="Your first name"
									required
								/>
							</div>

							<div className={styles.formGroup}>
								<label htmlFor="lastName">
									Last name <span className={styles.optional}>Optional</span>
								</label>
								<input
									id="lastName"
									name="lastName"
									type="text"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									autoComplete="family-name"
									placeholder="Your last name"
								/>
							</div>
						</div>

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
								autoComplete="new-password"
								placeholder="Create a password"
								required
							/>
						</div>

						<button type="submit" className={styles.submitButton}>
							Create account <span> →</span>
						</button>
					</form>

					<div className={styles.divider}>
						<span>OR</span>
					</div>

					<button
						type="button"
						className={styles.guestButton}
						onClick={registerGuest}
					>
						Continue as a guest <span> →</span>
					</button>
				</section>
			</div>
		</main>
	)
}

export default Register