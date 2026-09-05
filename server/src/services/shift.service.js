import { prisma } from "../lib/prisma.js"

export const validateShiftService = async ({
	employeeId, timetableId, shiftId, companyId, shiftDate, startTime, endTime
}) => {
	const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
	// Same company and same timetable check
	await prisma.companies.findFirstOrThrow({
		where: {
			id: companyId,
			employee: {
				id: employeeId,
				role: "EMPLOYEE"
			},
			timetables: {
				id: timetableId,
				...(shiftId && {
						shifts: {
							some: {id: shiftId}}
					})
				
			}
		}
	})

	// Employee availibility and timeoff check
	await prisma.users.findFirstOrThrow({
		where: {
			id: employeeId,
			availabilities: {
				some: {
					dayOfWeek: daysOfWeek[shiftDate.getDay()],
					startTime: {lte: startTime},
					endTime: {gte: endTime}
				}
			},
			timeOffRequests: {
				none: {
					startDate: {lte: shiftDate},
					endDate: {gte: shiftDate},
					status: "ACCEPTED"
				}
			}
		}
	})


	// Check for conflicting shift
	const conflictingShift = await prisma.shifts.findFirst({
		where: {
			date: shiftDate,
			startTime: {lt: endTime},
			endTime: {gt: startTime},
			employeeId,

			...(shiftId && {
            id: { not: shiftId }
        })
		}
	})

	if (conflictingShift) {
   	throw new Error("Employee already has a shift during this time")
	}
}


// consflictingShift logic:
// There are 4 cases of an overlap:
// 	1. new shift starts before existing shift starts. ends before existing shift ends.
// 	2. new shift starts before existing shift starts. ends after existing shift ends
// 	3. new shift starts after existing shift starts. Ends before existing shift ends
// 	4. new shift starts after existing shift starts. Ends after existing shift ends.

// Only case we can allow is if:
// 	1. new shift's end time is before existing shifts start time. NSE < ESS. ESS > NSE
// 	2. new shift's start time is after existing shifts end time. NSS > ESE. ESE < NSS
// We want NOT of this
