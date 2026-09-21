import {type SubmitEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../../services/api.ts'
import { useAuth } from '../../context/AuthContext.tsx'

const Register = () => {
	const { user, setUser } = useAuth()
	const navigate = useNavigate()

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")

	useEffect(() => {
		if (user) navigate("/dashboard", {replace: true})
	}, [user, navigate])


	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()
		try {
			const response = await api.post("/auth/register", {
				firstName,
				lastName,
				email,
				password
			})
			setUser(response.data.user)
			navigate("/dashboard", { replace: true })
		} catch(error) {
			console.error("Login failed: " + error)
		}
	}

	return (
		<main className='register-page'>
			<section className='register-box'>
				<h1>Register</h1>
				<form onSubmit={handleSubmit}>
					<div>
						<div>
							<label htmlFor='firstName'>First name</label>
							<input
								id='firstName'
								name='firstName'
								type='text'
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								autoComplete='given-name'
								required
							/>
						</div>
						<div>
							<label htmlFor='lastName'>Last name</label>
							<input
								id='lastName'
								name='lastName'
								type='text'
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								autoComplete='family-name'
							/>
						</div>
					</div>

					<div>
						<label htmlFor='email'>Email</label>
						<input
							id='email'
							name='email'
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							autoComplete='email'
							required
						/>
					</div>

					<div>
						<label htmlFor='password'>Password</label>
						<input
							id='password'
							name='password'
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							autoComplete='new-password'
						/>
					</div>
					
					<button type='submit'>Register</button>
				</form>
			</section>
		</main>
	)
}

export default Register