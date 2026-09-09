import {type SubmitEvent , useState } from 'react'
import { api } from '../services/api'

const Login = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault()

		const response = await api.post("/api/auth/login", {
				email,
				password
		})

		console.log(response.data)
	}

	return (
		<main className='login-page'>
			<section className='login-box'>
				<h1>Login</h1>
				<form onSubmit={handleSubmit}>
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
					
					<button type='submit'>Login</button>
				</form>
			</section>
		</main>
	)
}

export default Login