import { prisma } from "../lib/prisma.js"

export const validateUnavailabilityService = async ({
	employeeId, day, startTime, endTime
}) => {
	const unavailability = await prisma.unavailabilities.findFirst({
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
	if (unavailability) {
		throw new Error("Unavailability already exists here:", unavailability)
	}
}