import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'

import styles from './Timetables.module.css'
import { Link } from 'react-router'
import { toast } from 'sonner'
import ErrorPage from '../ErrorPage/ErrorPage'


const Timetables = () => {
	const [loading, setLoading] = useState(true)
	const [isError, setIsError] = useState(false)

	const [timetables, setTimetables] = useState<Timetable[]>([])
	const [name, setName] = useState("")
	const [weekDate, setWeekDate] = useState("")

	useEffect(() => {
		const fetchTimetables = async () => {
			try {
				const response = await api.get("/timetables")
				setTimetables(response.data.timetables)
			} catch(error) {
				console.error("Failed to fetch timetables: ", error)
				setIsError(true)
			} finally {
				setLoading(false)
			}
		}

		fetchTimetables()
	}, [])

	
	const getMonday = (dateString: string) => {
		const date = new Date(`${dateString}`)
		const day = date.getDay()
		const daysFromMonday = day === 0 ? 6 : day - 1
		date.setDate(date.getDate() - daysFromMonday)

		return date
	}

	const createTimetable = async (e: React.SubmitEvent) => {
		e.preventDefault()
		if (!name.trim() || !weekDate) return
		const weekCommencing = getMonday(weekDate)

		const promise = api.post("/timetables", {
			name: name.trim(),
			weekCommencing
		})
		toast.promise(promise, {
			loading: "Creating timetable...",
			success: (response) => {
				setTimetables(prev => [...prev, response.data.timetable])
				setName("")
				setWeekDate("")

				return "Timetable created successfully!"
			},
			error:  (error) => {
				console.error("Failed to create timetable:", error)
				return "Failed to create timetable. Please try again."
			} 
		})
	}
	const deleteTimetable = async (timetableId: string) => {
		const promise = api.delete(`/timetables/${timetableId}`)
		toast.promise(promise, {
			loading: "Deleting timetable...",
			success: () => {
				setTimetables(prev => prev.filter(t => t.id !== timetableId))
				return "Timetable deleted successfully."
			},
			error: (error) => {
				console.error("Failed to create timetable:", error)
				return "Failed to create timetable. Please try again."
			}
		})
	}


	if (loading) return <p>Loading timetables</p>
	if (isError) return <ErrorPage />

  	return (
		<div className={styles.timetablePage}>
			<div className={styles.header}>
				<h1>Timetables</h1>
				<p>Create and manage your weekly timetables.</p>
			</div>
			
			<form className={styles.createForm} onSubmit={createTimetable}>
				<div className={styles.formGroup}>
					<label htmlFor="timetableName">
						Name
					</label>

					<input
						id="timetableName"
						type="text"
						value={name}
						onChange={e => setName(e.target.value)}
						placeholder="e.g. Weekly rota"
						required
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="weekDate">
						Week
					</label>

					<input
						id="weekDate"
						type="date"
						value={weekDate}
						onChange={e => setWeekDate(e.target.value)}
						required
					/>
				</div>

				<button type="submit" className={styles.createButton}>
					Create timetable
				</button>
			</form>


			<div className={styles.timetableGrid}>
				{timetables.length === 0 ? 
					<div className={styles.emptyState}>
						<h2>No timetables yet</h2>
						<p>Create your first timetable to get started.</p>
					</div>
				: 
				timetables.map(t =>
					<div key={t.id} className={styles.timetableCard}>
						<div className={styles.timetableHeader}>
							<h2>{t.name}</h2>
							<button className={styles.deleteTimetable} onClick={() => deleteTimetable(t.id)}>X</button>
						</div>

						<p>
							Week commencing: {new Date(t.weekCommencing).toLocaleDateString()}
						</p>

						<Link to={`/timetables/${t.id}`} className={styles.viewTimetable}>Open timetable</Link>

					</div>
				)}
			</div>

		</div>
	)
}

export default Timetables