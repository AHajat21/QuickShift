import { useEffect, useState, type SubmitEvent } from 'react'
import { api } from '../../services/api.ts'
import { useAuth } from '../../context/AuthContext.tsx'
import { toast } from 'sonner'

import styles from './SettingsPage.module.css'

const SettingsPage = () => {
	const { user, setUser } = useAuth()

	const [firstName, setFirstName] = useState(user?.firstName ?? '')
	const [lastName, setLastName] = useState(user?.lastName ?? '')
	const [email, setEmail] = useState(user?.email ?? '')

	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const [loading, setLoading] = useState(false)

	useEffect(() => {
		setFirstName(user?.firstName ?? '')
		setLastName(user?.lastName ?? '')
		setEmail(user?.email ?? '')
	}, [user])


	const handleProfileUpdate = async (e: SubmitEvent) => {
		e.preventDefault()

		try {
			setLoading(true)

			const response = await api.patch('/auth/me', {
				firstName,
				lastName,
				email,
			})
			setUser(response.data.user)

			toast.success('Personal information updated')
		} catch (error: any) {
			toast.error(error.response?.data?.message || 'Failed to update information')
		} finally {
			setLoading(false)
		}
	}

	const handlePasswordUpdate = async (e: SubmitEvent) => {
		e.preventDefault()

		if (newPassword !== confirmPassword) {
			toast.error('Passwords do not match')
			return
		}

		if (newPassword.length < 8) {
			toast.error('Password must be at least 8 characters')
			return
		}

		try {
			setLoading(true)

			await api.patch('/auth/me/password', {
				currentPassword,
				newPassword,
			})

			setCurrentPassword('')
			setNewPassword('')
			setConfirmPassword('')

			toast.success('Password updated successfully')
		} catch (error: any) {
			toast.error(error.response?.data?.message || 'Failed to update password')
		} finally {
			setLoading(false)
		}
	}


	const handleDeleteAccount = async () => {
		const confirmed = window.confirm(
			'Are you sure you want to delete your account? This action cannot be undone.'
		)
		if (!confirmed) return

		try {
			setLoading(true)
			await api.delete('/auth/me')
			setUser(null)
			toast.success('Account deleted')
			window.location.reload()
		} catch (error: any) {
			toast.error(error.response?.data?.message || 'Failed to delete account')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className={styles.settingsPage}>
			<header className={styles.pageHeader}>
				<div>
					<h1>Settings</h1>
					<p>Manage your account and preferences.</p>
				</div>
			</header>

			<div className={styles.settingsContainer}>
				<SettingsSection
					title="Personal information"
					description="Update your personal details and email address."
				>
					<form onSubmit={handleProfileUpdate}>
						<div className={styles.formGrid}>
							<div className={styles.inputGroup}>
								<label htmlFor="firstName">First name</label>
								<input
									id="firstName"
									type="text"
									value={firstName}
									onChange={e => setFirstName(e.target.value)}
									required
								/>
							</div>

							<div className={styles.inputGroup}>
								<label htmlFor="lastName">Last name</label>
								<input
									id="lastName"
									type="text"
									value={lastName}
									onChange={e => setLastName(e.target.value)}
								/>
							</div>
						</div>

						<div className={styles.inputGroup}>
							<label htmlFor="email">Email address</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={e => setEmail(e.target.value)}
								required
							/>
						</div>

						<div className={styles.formFooter}>
							<button
								type="submit"
								className={styles.primaryButton}
								disabled={loading}
							>
								Save changes
							</button>
						</div>
					</form>
				</SettingsSection>


				<SettingsSection
					title="Password & security"
					description="Keep your account secure by regularly updating your password."
				>
					<form onSubmit={handlePasswordUpdate}>
						<div className={styles.inputGroup}>
							<label htmlFor="currentPassword">Current password</label>
							<input
								id="currentPassword"
								type="password"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								autoComplete="current-password"
								required
							/>
						</div>

						<div className={styles.formGrid}>
							<div className={styles.inputGroup}>
								<label htmlFor="newPassword">New password</label>
								<input
									id="newPassword"
									type="password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									autoComplete="new-password"
									required
								/>
							</div>

							<div className={styles.inputGroup}>
								<label htmlFor="confirmPassword">Confirm new password</label>
								<input
									id="confirmPassword"
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									autoComplete="new-password"
									required
								/>
							</div>
						</div>

						<div className={styles.formFooter}>
							<button
								type="submit"
								className={styles.primaryButton}
								disabled={loading}
							>
								Update password
							</button>
						</div>
					</form>
				</SettingsSection>


				<SettingsSection
					title="Danger zone"
					description="Irreversible actions relating to your account."
				>
					<div className={styles.dangerCard}>
						<div>
							<h3>Delete account</h3>
							<p>
								Permanently delete your account and associated data.
								This action cannot be undone.
							</p>
						</div>

						<button
							type="button"
							className={styles.dangerButton}
							onClick={handleDeleteAccount}
							disabled={loading}
						>
							Delete account
						</button>
					</div>
				</SettingsSection>
			</div>
		</div>
	)
}

export default SettingsPage




type SettingsSectionProps = {
	title: string
	description?: string
	children: React.ReactNode
}
const SettingsSection = ({
	title,
	description,
	children,
}: SettingsSectionProps) => {
	return (
		<section className={styles.section}>
			<div className={styles.sectionHeader}>
				<h2>{title}</h2>
				{description && <p>{description}</p>}
			</div>

			<div className={styles.sectionContent}>
				{children}
			</div>
		</section>
	)
}