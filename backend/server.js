import "dotenv/config";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import instructorRoutes from "./routes/instructor.routes.js";
import lectureRoutes from "./routes/lecture.routes.js";
import errorHandler from "./middleware/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initializing express app
const app = express();

// Connect to the mongodb database
connectDB();

// Middleware for handling CORS
// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   }),
// );

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Body parser middleware to parse incoming JSON data
app.use(express.json());
// Middleware to parse URL-encoded data sent by HTML forms
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React frontend app
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/lectures", lectureRoutes);

// Error handling middleware
app.use(errorHandler);

// Handle 404 errors for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    statusCode: 404,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  console.error("Error stack:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    statusCode: 500,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
