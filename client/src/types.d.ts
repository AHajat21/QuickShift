type User = {
	id: string
	companyId: string
	email: string
	password: string
	googleId: string
	firstName: string
	lastName: string
	createdAt: Date
}
type Session = {
	id: String
	userId: String
	tokenHash: String
	expiresAt: Date
	createdAt: Date
}
type Company = {
	id: string
	name: string
	createdAt: Date
}
type Employee = {
	id: string
	firstName: string
	lastName: string
	email: string
	phone: string
	createdAt: Date
}
type Timetable = {
	id: string
	companyId: string
	name: string
	weekCommencing: Date
	createdAt: Date
}
type Shift = {
	id: number
	employeeId: string
	timetableId: string
	date: Date
	day: string
	startTime: string
	endTime: string
	createdAt: Date

	employee: Employee
	timetable: Timetable
}
type Unavailability = {
	id: number
	employeeId: string
	day: DayOfWeek
	startTime: string
	endTime: string
}
type timeOff = {
	id: number
	employeeId: string
	startDate: Date
	endDate: Date
	reason: string
	createdAt: Date
}

type DayOfWeek = 
	"MONDAY" |
	"TUESDAY" |
	"WEDNESDAY" |
	"THURSDAY" |
	"FRIDAY"|
	"SATURDAY"|
	"SUNDAY"