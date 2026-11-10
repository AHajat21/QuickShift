import { type SubmitEvent, useState } from 'react'
import styles from "./CreateCompanyPage.module.css"
import { api } from '../../services/api'
import { toast } from 'sonner'

const CreateCompanyPage = () => {
	const [companyName, setCompanyName] = useState("")


	const createCompany = async (e: SubmitEvent) => {
		e.preventDefault()

		const promise = api.post("/companies", { name: companyName })
		toast.promise(promise, {
			loading: "Creating company...",
			success: () => {
				setCompanyName("")
				window.location.reload()
				return "Company created successfully!"
			},
			error: (error) => {
				console.error("Failed to create company:", error)
				return "Failed to create company. Please try again."
			}
		})
	}

	return (
		<main className={styles.companyPage}>
			<section className={styles.setupCard}>
				<div className={styles.headingIcon} aria-hidden="true">
					<svg viewBox="0 0 24 24">
						<path d="M3.5 20.5h17M5.5 20.5V6.8l6.5-3.3 6.5 3.3v13.7M9 9h.01M15 9h.01M9 13h.01M15 13h.01M10 20.5v-4h4v4" />
					</svg>
				</div>
				<p className={styles.eyebrow}>GETTING STARTED</p>
				<h1>Create your company</h1>
				<p className={styles.pageDescription}>
					Set up your company to start organising your team.
				</p>

				<form className={styles.companyForm} onSubmit={createCompany}>
					<label htmlFor="companyName">Company name</label>
					<input
						id="companyName"
						name="companyName"
						type="text"
						placeholder="e.g. The Corner Café"
						value={companyName}
						onChange={e => setCompanyName(e.target.value)}
						required
						maxLength={100}
					/>
					<button className={styles.primaryButton} type="submit">
						Create company
						<span aria-hidden="true">→</span>
					</button>
				</form>
			</section>
		</main>
	)
}

export default CreateCompanyPage