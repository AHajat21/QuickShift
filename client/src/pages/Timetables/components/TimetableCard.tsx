import { useEffect, useRef, useState } from "react";
import styles from "./TimetableCard.module.css"
import { Link } from 'react-router'


type TimetableCardProps = {
	t: Timetable
	setTimetables: (updater: (prev: Timetable[]) => Timetable[]) => void
	deleteTimetable: (id: string) => void
	duplicateTimetable: (tId: string) => void
	renameTimetable: (tId: string, name: string, previousValue: string) => void
}
const TimetableCard = ({t, setTimetables, deleteTimetable, duplicateTimetable, renameTimetable}: TimetableCardProps) => {
	const [openMenu, setOpenMenu] = useState<boolean>(false)
	const menuContainerRef = useRef<HTMLDivElement>(null)
	const previousValue = useRef("")

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuContainerRef.current &&
				!menuContainerRef.current.contains(event.target as Node)
			) setOpenMenu(false)
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		}
   }, []);

	return (
		<div key={t.id} className={styles.timetableCard} ref={menuContainerRef}>
			<input 
				type="text"
				className={styles.timetableName}
				value={t.name}
				onChange={e => 
					setTimetables(prev => prev.map(timetable =>
						timetable.id === t.id ? { ...timetable, name: e.target.value } : timetable
					))
				}
				onFocus={e => previousValue.current = e.target.value}
				onBlur={e => renameTimetable(t.id, e.target.value, previousValue.current)}
			/>
			
			<div>
				<p>Week commencing: {new Date(t.weekCommencing).toLocaleDateString()}</p>
				<p>Created at: {new Date(t.createdAt).toLocaleDateString()}</p>
			</div>


			<div className={styles.footer}>
				<Link to={`/timetables/${t.id}`} className={styles.viewTimetable}
				>Open timetable</Link>

				<div className={styles.menuWrapper}>
					<button
						type="button"
						className={styles.menuButton}
						aria-label={`Options for ${t.name}`}
						aria-haspopup="menu"
						aria-expanded={openMenu}
						onClick={() =>
							setOpenMenu(openMenu ? false : true)
						}
					>⋮</button>

					{openMenu && (
						<div className={styles.dropdown} role="menu">
							<button
								type="button"
								role="menuitem"
								onClick={() => {
									setOpenMenu(false);
									duplicateTimetable(t.id)
								}}
							>Duplicate</button>

							<button
								type="button"
								role="menuitem"
								onClick={() => {
									setOpenMenu(false);
									deleteTimetable(t.id)
								}}
							>Delete</button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default TimetableCard