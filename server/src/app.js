// Builds server
// Routes branch from here
import express from "express";
import cors from "cors";

// Import different routes

const app = express();

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get("/", (req, res) => res.send("HELLO"))


export default app;