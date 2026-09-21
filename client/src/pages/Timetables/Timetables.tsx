import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'

import styles from './Timetables.module.css'
import { Link } from 'react-router'

type Timetable = {
	id: string
	name: string
	weekCommencing: Date
}

const Timetable = () => {
	const [timetables, setTimetables] = useState<Timetable[]>([])
	const [loading, setLoading] = useState(true)

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


	const createTimetable = async () => {
		try {
			const response = await api.post("/timetables", {
				name: "test1",
				weekCommencing: new Date()
			})
			setTimetables(prev => [...prev, response.data.timetable])
			console.log(response)
		} catch (error) {
			console.error("Failed to create timetable")
		}
	}


	if (loading) return <p>Loading timetables</p>

  	return (
	 <div className={styles.timetableList}>
			<h1>Timetables</h1>
			
			<button onClick={createTimetable}>Create timetable</button>

			{timetables.length === 0 ? (
				<p>No timetables yet</p>
			) : (
				timetables.map((timetable) => (
					<div key={timetable.id} className={styles.timetableCard}>
						<h2>{timetable.name}</h2>
						<p>
							Week commencing: {" "}
							{new Date(timetable.weekCommencing).toLocaleDateString()}
						</p>

						<Link to={`/timetables/${timetable.id}`}>Go to timetable</Link>
					</div>
				))
			)}
	 </div>
  	)
}

export default Timetable