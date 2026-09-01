import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js"
import companyRoutes from "./routes/company.routes.js"
import employeeRoutes from "./routes/employee.routes.js"
import timetableRoutes from "./routes/timetable.routes.js"
import { prismaErrorHandler } from "./middleware/error.middleware.js";
import { authenticate } from "./middleware/auth.middleware.js";

const app = express();

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/companies", authenticate, companyRoutes)
app.use("/api/employees", authenticate, employeeRoutes)
app.use("/api/timetables", authenticate, timetableRoutes)

// Error Handling
app.use(prismaErrorHandler);

export default app;