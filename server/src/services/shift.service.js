import { prisma } from "../lib/prisma.js"

export const validateShiftService = async ({
	employeeId, timetableId, shiftId, companyId, shiftDate, startTime, endTime
}) => {
	const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
	// Same company and same timetable check
	await prisma.companies.findFirstOrThrow({
		where: {
			id: companyId,
			employees: {
				some: {id: employeeId,}
			},
			timetables: {
				some: {
					id: timetableId,
					...(shiftId && {
						shifts: {
							some: {id: shiftId}}
					})
				}

			}
		}
	})

	// // Employee availibility and timeoff check
	// await prisma.users.findFirstOrThrow({
	// 	where: {
	// 		id: employeeId,
	// 		availabilities: {
	// 			some: {
	// 				dayOfWeek: daysOfWeek[shiftDate.getDay()],
	// 				startTime: {lte: startTime},
	// 				endTime: {gte: endTime}
	// 			}
	// 		},
	// 		timeOffRequests: {
	// 			none: {
	// 				startDate: {lte: shiftDate},
	// 				endDate: {gte: shiftDate},
	// 				status: "ACCEPTED"
	// 			}
	// 		}
	// 	}
	// })


	// // Check for conflicting shift
	// const conflictingShift = await prisma.shifts.findFirst({
	// 	where: {
	// 		date: shiftDate,
	// 		startTime: {lt: endTime},
	// 		endTime: {gt: startTime},
	// 		employeeId,

	// 		...(shiftId && {
   //          id: { not: shiftId }
   //      })
	// 	}
	// })

	// if (conflictingShift) {
   // 	throw new Error("Employee already has a shift during this time")
	// }
}