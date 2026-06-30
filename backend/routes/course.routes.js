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
import uploadToCloudinary, {
  uploadToCloudinaryOptional,
} from "../middleware/upload.middleware.js";
import {
  createCourseValidation,
  updateCourseValidation,
} from "../validators/course.validator.js";

const router = express.Router();

// Create a new course (admin only) — image is required
router.post(
  "/",
  (req, res, next) => {
    console.log("POST /api/courses - Request received");
    console.log("Request body:", req.body ? JSON.stringify(req.body) : "Empty/undefined");
    console.log("Request file:", req.file ? `Present (size: ${req.file.size}, type: ${req.file.mimetype})` : "Missing");
    next();
  },
  protect,
  verifyAdmin,
  upload.single("image"),
  uploadToCloudinary,
  createCourseValidation,
  createCourse,
);

// Get all courses
router.get("/", protect, getAllCourses);

// Get details for a single course by ID
router.get("/:id", protect, getCourseById);

// Update an existing course by ID (admin only) — image is optional
router.put(
  "/:id",
  protect,
  verifyAdmin,
  upload.single("image"),
  uploadToCloudinaryOptional,
  updateCourseValidation,
  updateCourse,
);

// Delete a course by ID (admin only)
router.delete("/:id", 
  (req, res, next) => {
    console.log("DELETE /api/courses/:id - Request received");
    console.log("Course ID:", req.params.id);
    next();
  },
  protect, 
  verifyAdmin, 
  deleteCourse
);

export default router;
