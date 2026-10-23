export const timeToMinutes = (time: string) => {
	const [hours, minutes] = time.split(":").map(Number)
	return hours * 60 + minutes
}

export const dateToDay = (day: string, date: Date) => {
	const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]
	const newDate = new Date(date)
	newDate.setDate(newDate.getDate() + daysOfWeek.indexOf(day))
	return newDate
}

export const getShiftColour = (shift: Shift | undefined) => {
    if (!shift) return "shiftRed"
    if (shift.endTime <= "17:00" && shift.endTime !== "00:00") return "shiftYellow"
    if (shift.startTime >= "17:00") return "shiftBlue"
    return "shiftGreen"
}