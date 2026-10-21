import { useEffect, useRef, useState } from "react";
import styles from "./TimetableCard.module.css"
import { Link } from 'react-router'


type TimetableCardProps = {
	t: Timetable
	deleteTimetable: (id: string) => void
	duplicateTimetable: (tID: string) => void
}
const TimetableCard = ({t, deleteTimetable, duplicateTimetable}: TimetableCardProps) => {
	const [openMenu, setOpenMenu] = useState<boolean>(false)
	const menuContainerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
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
			<div className={styles.header}>
				<h2>{t.name}</h2>
				<button className={styles.deleteTimetable} onClick={() => deleteTimetable(t.id)}>X</button>
			</div>

			<p>
				Week commencing: {new Date(t.weekCommencing).toLocaleDateString()}
			</p>

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
								}}
							>Rename</button>

							<button
								type="button"
								role="menuitem"
								onClick={() => {
									setOpenMenu(false);
									duplicateTimetable(t.id)
								}}
							>Duplicate</button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default TimetableCard