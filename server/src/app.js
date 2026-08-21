// Builds server
// Routes branch from here
import express from "express";
import cors from "cors";
// Import different routes
import authRoutes from "./routes/auth.routes.js"

const app = express();

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)


export default app;