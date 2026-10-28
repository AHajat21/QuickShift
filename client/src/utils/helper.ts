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

export const loginValidator = (email: string, password: string): string | null => {
	if (!email.trim()) return "Email is required."
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
		return "Please enter a valid email address."
	}
	if (!password) return "Password is required."
	if (password.length < 8) return "Password is incorrect"

	return null
}
export const registrationValidator = (email: string, password: string, firstName: string): string | null => {
	if (!email.trim()) return "Email is required."
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
		return "Please enter a valid email address."
	}
	if (!password) return "Password is required."
	if (password.length < 8) return "Password is incorrect"
	if (!firstName) return "First name is required"

	return null
}