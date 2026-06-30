import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import protect from "../middleware/auth.middleware.js";
import verifyAdmin from "../middleware/role.middleware.js";
import upload from "../config/multer.js";
import uploadToCloudinary from "../middleware/upload.middleware.js";
import {
  createCourseValidation,
  updateCourseValidation,
} from "../validators/course.validator.js";

const router = express.Router();

// Create a new course (admin only)
router.post(
  "/",
  protect,
  verifyAdmin,
  upload.single("image"),
  uploadToCloudinary,
  createCourseValidation,
  createCourse,
);

// Get all courses for the logged-in user
router.get("/", protect, getAllCourses);

// Get details for a single course by ID
router.get("/:id", protect, getCourseById);

// Update an existing course by ID (admin only)
router.put(
  "/:id",
  protect,
  verifyAdmin,
  upload.single("image"),
  uploadToCloudinary,
  updateCourseValidation,
  updateCourse,
);

// Delete a course by ID (admin only)
router.delete("/:id", protect, verifyAdmin, deleteCourse);

export default router;
