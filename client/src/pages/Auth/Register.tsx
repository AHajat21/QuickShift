import {type SubmitEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { api } from '../../services/api.ts'
import { useAuth } from '../../context/AuthContext.tsx'

import styles from './Register.module.css'
import { toast } from 'sonner'
import { registrationValidator } from '../../utils/helper.ts'

const Register = () => {
	const { user, setUser } = useAuth()
	const navigate = useNavigate()

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")

	useEffect(() => {
		if (user?.isGuest === false) navigate("/dashboard", {replace: true})
	}, [user, navigate])


	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()

		const validationError = registrationValidator(email, password, firstName)
		if (validationError) {
			toast.error(validationError)
			return
		}

		const endpoint = user?.isGuest ? "/auth/guest/convert" : "/auth/register"
		const outcome = user?.isGuest ? "Link" : "Register"
		
		const promise = api.post(endpoint, {
			firstName,
			lastName,
			email,
			password
		})

		toast.promise(promise, {
			loading: "Registering...",
			success: (response) => {
				setUser(response.data.user)
				navigate("/dashboard", { replace: true })
				return outcome + "ed successfully!"
			},
			error: (error) => {
				console.error("Register failed:", error)
				return "Failed to " + outcome.toLowerCase() + ". Please try again."
			}
		})
	}
	const registerGuest = async () => {
		const promise = api.post("/auth/guest")
		toast.promise(promise, {
			loading: "Continuing as guest...",
			success: (response) => {
				setUser(response.data.user)
				navigate("/dashboard", { replace: true })
				return "Continuing as guest."
			},
			error: (error) => {
				console.error("Guest register failed:", error)
				return "Failed to continue as guest. Please try again."
			}
		})
	}

	return (
		<main className={styles.registerPage}>
			<h1 className={styles.logo}>QuickShift</h1>
			<section className={styles.registerBox}>
				<div className={styles.header}>
					<h2>Register</h2>
					<Link to="/login">Login Instead</Link>
				</div>
				<form onSubmit={handleSubmit}>
					<div className={styles.formGroup}>
						<label htmlFor='firstName'>First name</label>
						<input
							id='firstName'
							name='firstName'
							type='text'
							value={firstName}
							onChange={e => setFirstName(e.target.value)}
							autoComplete='given-name'
							required
						/>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor='lastName'>Last name</label>
						<input
							id='lastName'
							name='lastName'
							type='text'
							value={lastName}
							onChange={e => setLastName(e.target.value)}
							autoComplete='family-name'
						/>
					</div>

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
							autoComplete='new-password'
							required
						/>
					</div>
					
					<button type='submit'>Register</button>
				</form>
			</section>
			<button className={styles.guestButton}
				onClick={registerGuest}
			>Continue as guest -{'>'}</button>
		</main>
	)
}

export default Register