import React from 'react'

import styles from "./UnavailabilityPanel.module.css"
import { timeToMinutes } from '../../../utils/helper';


type SelectedCell = 
 {name: "day-cell"; day: string} |
 {name: "employee-cell"; employeeId: string; eName: string} |
 {name: "shift-cell"; employeeId: string; eName: string; day: string} |
 null

type UnavailabilityPanelProps = {
	selectedCell: SelectedCell
	employees: Employee[]
	unavailabilities: Unavailability[]
	shifts: Shift[]
}

const UnavailabilityPanel = (props: UnavailabilityPanelProps) => {
	const { selectedCell, employees, unavailabilities, shifts } = props
	const times = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
	const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

	
	switch (selectedCell?.name) {
		case "day-cell":
			return (
				<div className={styles.chartContainer}>
					<div className={styles.unavailabilitiesChart}>
						<div className={styles.corner}>{selectedCell.day}'s Availability</div>

						<div className={styles.timesHeader}>
							{times.map(t => 
								<div key={t} className={styles.smallTime}>{t}</div>
							)}
						</div>

						{employees.map(employee => 
							<React.Fragment key={employee.id}>
								<div className={styles.rowHeader}>
									{employee.firstName} {employee.lastName}
								</div>

								<div className={styles.unavailabilityCell}>
									{unavailabilities.filter(a => 
										a.employeeId === employee.id && 
										a.day === selectedCell.day.toUpperCase()
									).map(a =>
										<div key={a.id}
											className={styles.unavailabilityBar}
											title={`${a.startTime}-${a.endTime}`}
											style={{
												left: `${(timeToMinutes(a.startTime)/1440) * 100}%`,
												width: `${((timeToMinutes(a.endTime) - timeToMinutes(a.startTime)) / 1440) * 100}%`
											}}
										/>
									)}
								</div>
							</React.Fragment>
						)}
					</div>
				</div>
			)

		case "employee-cell":
			return (
				<div className={styles.chartContainer}>
					<div className={styles.unavailabilitiesChart}>
						<div className={styles.corner}>{selectedCell.eName}'s Availability</div>

						<div className={styles.timesHeader}>
							{times.map(t => 
								<div key={t} className={styles.smallTime}>{t}</div>
							)}
						</div>

						{daysOfWeek.map(d => 
							<React.Fragment key={d}>
								<div className={styles.rowHeader}>{d}</div>

								<div className={styles.unavailabilityCell}>
									{unavailabilities.filter(a => 
										a.employeeId === selectedCell.employeeId && 
										a.day === d.toUpperCase()
									).map(a =>
										<div key={a.id} className={styles.unavailabilityBar}
											style={{
												left: `${(timeToMinutes(a.startTime)/1440) * 100}%`,
												width: `${((timeToMinutes(a.endTime) - timeToMinutes(a.startTime)) / 1440) * 100}%`
											}}
										/>
									)}
								</div>
							</React.Fragment>
						)}
					</div>
				</div>
			)

		case "shift-cell":
			const shift = shifts.find(s => 
				s.employeeId === selectedCell.employeeId && 
				s.day === selectedCell.day.toUpperCase()
			)
			const shiftStart = shift ? timeToMinutes(shift.startTime) : 0
			const shiftEnd = shift ? timeToMinutes(shift.endTime) : 0
			return (
				<div className={styles.chartContainer}>
					<div className={styles.unavailabilitiesChart}>
						<div className={styles.corner}>{selectedCell.eName}'s {selectedCell.day} Availability</div>

						<div className={styles.timesHeader}>
							{times.map(t => 
								<div key={t} className={styles.smallTime}>{t}</div>
							)}
						</div>


						<div className={styles.rowHeader}>Availability</div>
						<div className={styles.unavailabilityCell}>
							{unavailabilities.filter(a => 
								a.employeeId === selectedCell.employeeId && 
								a.day === selectedCell.day.toUpperCase()
							).map(a =>
								<div key={a.id} className={styles.unavailabilityBar}
									style={{
										left: `${(timeToMinutes(a.startTime)/1440) * 100}%`,
										width: `${((timeToMinutes(a.endTime) - timeToMinutes(a.startTime)) / 1440) * 100}%`
									}}
								/>
							)}
						</div>

						<div className={styles.rowHeader}>Shift</div>
						<div className={styles.unavailabilityCell}>
							<div className={styles.unavailabilityBar}
								style={{
									left: `${(shiftStart / 1440) * 100}%`,
									width: `${((shiftEnd - shiftStart) / 1440) * 100}%`,
									backgroundColor: "rgb(74, 137, 107)"
								}}
							/>
						</div>
					</div>
				</div>
			)
	
		default:
			return (
				<div className={styles.emptyState}>Select a cell for more unavailability information</div>
			)
	}
}

export default UnavailabilityPanel