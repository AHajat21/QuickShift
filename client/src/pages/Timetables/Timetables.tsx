import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'

import styles from './Timetables.module.css'
import { Link } from 'react-router'

type Timetable = {
	id: string
	name: string
	weekCommencing: Date
}

const Timetables = () => {
	const [timetables, setTimetables] = useState<Timetable[]>([])
	const [loading, setLoading] = useState(true)

	const [name, setName] = useState("")
	const [weekDate, setWeekDate] = useState("")

	useEffect(() => {
		const fetchTimetables = async () => {
			try {
				const response = await api.get("/timetables")
				setTimetables(response.data.timetables)
			} catch(error) {
				console.error("Failed to fetch timetables: ", error)
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
		try {
			const response = await api.post("/timetables", {
				name: name.trim(),
				weekCommencing
			})
			setTimetables(prev => [...prev, response.data.timetable])

			setName("")
			setWeekDate("")
		} catch (error) {
			console.error("Failed to create timetable")
		}
	}
	const deleteTimetable = async (timetableId: string) => {
		try {
			await api.delete(`/timetables/${timetableId}`)
			setTimetables(prev => prev.filter(t => t.id !== timetableId))
		} catch (error) {
			console.error("Failed to create timetable")
		}
	}


	if (loading) return <p>Loading timetables</p>

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


			<div className={styles.timetableCards}>
				{timetables.length === 0 ? 
					<div className={styles.emptyState}>
						<h2>No timetables yet</h2>
						<p>Create your first timetable to get started.</p>
					</div>
				: 
				timetables.map(t => (
					<div key={t.id} className={styles.timetableCard}>
						<div className={styles.timetableHeader}>
							<h2>{t.name}</h2>
							<button className={styles.deleteTimetable} onClick={() => deleteTimetable(t.id)}>X</button>
						</div>

						<p>
							Week commencing: 
							{new Date(t.weekCommencing).toLocaleDateString()}
						</p>

						<Link to={`/timetables/${t.id}`} className={styles.viewTimetable}>Open timetable</Link>

					</div>
				))}
			</div>

		</div>
	)
}

export default Timetables