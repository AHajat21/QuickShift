import {type SubmitEvent , useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

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
		} catch(error) {
			console.error("Login failed: " + error)
		}
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