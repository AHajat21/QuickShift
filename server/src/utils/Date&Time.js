export const isValidTime = (time) => {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(time)
}

export const timeToMinutes = (time) => {
	const [hours, minutes] = time.split(":").map(Number)
	return hours * 60 + minutes
}

export const getMonday = (dateString) => {
	const date = new Date(`${dateString}`)
	const day = date.getDay()
	const daysFromMonday = day === 0 ? 6 : day - 1
	date.setDate(date.getDate() - daysFromMonday)

	return date
}