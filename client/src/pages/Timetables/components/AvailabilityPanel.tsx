import React from 'react'

type SelectedCell = 
 {name: "day-cell"; day: string} |
 {name: "employee-cell"; employeeId: string} |
 {name: "shift-cell"; employeeId: string; day: string}

type AvailabilityPanelProps = {
	selection: SelectedCell
	employees: Employee[]
	availabilities: Availability[]
	shifts: Shift[]
}

const AvailabilityPanel = () => {
  return (
	 <div>AvailabilityPanel</div>
  )
}

export default AvailabilityPanel