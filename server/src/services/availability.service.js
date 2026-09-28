import { prisma } from "../lib/prisma"

export const validateAvailabilityService = async ({
	employeeId, day, startTime, endTime
}) => {
	const availability = await prisma.availabilities.findFirst({
		where: {
			employeeId,
			day,
			AND: [
				{
					startTime: {lt: endTime},
					endTime: {gt: startTime}
				}
			]
		}
	})

	if (availability) {
		throw new Error("Availability already exists here")
	}
}