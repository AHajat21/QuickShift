export const isValidTime = (time) => {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(time)
}

export const timeToMinutes = (time) => {
	const [hours, minutes] = time.split(":").map(Number)
	return hours * 60 + minutes
}