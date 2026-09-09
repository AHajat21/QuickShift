import {type SubmitEvent, useEffect, useState } from 'react'
import { api } from '../services/api'

const Register = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [role, setRole] = useState("employee")


	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()

		const response = await api.post("/auth/register", {
				firstName,
				lastName,
				email,
				password,
				role
		})

		console.log(response.data)
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
						/>
					</div>


					<fieldset>
						<legend>Account type</legend>

						<div>
							<input
								id='employee'
								name='role'
								type='radio'
								value='employee'
								checked={role === "employee"}
								onChange={(e) => setRole(e.target.value)}
							/>
							<label htmlFor='employee'>Employee</label>
						</div>

						<div>
							<input
								id='manager'
								name='role'
								type='radio'
								value='manager'
								checked={role === "manager"}
								onChange={(e) => setRole(e.target.value)}
							/>
							<label htmlFor='manager'>Manager</label>
						</div>
					</fieldset>

					
					<button type='submit'>Register</button>
				</form>
			</section>
		</main>
	)
}

export default Register