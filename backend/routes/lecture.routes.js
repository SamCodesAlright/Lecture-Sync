import express from "express";
import {
  assignLecture,
  getAllLectures,
  getInstructorLectures,
  deleteLecture,
} from "../controllers/lecture.controller.js";
import { lectureValidation } from "../validators/lecture.validator.js";
import protect from "../middleware/auth.middleware.js";
import verifyAdmin from "../middleware/role.middleware.js";

const router = express.Router();

// Assign a new lecture to an instructor/course (admin only)
router.post("/", protect, verifyAdmin, lectureValidation, assignLecture);

// Get all lectures across the application (admin only)
router.get("/", protect, verifyAdmin, getAllLectures);

// Get all lectures assigned to the logged-in instructor
router.get("/my-lectures", protect, getInstructorLectures);

// Delete a lecture by ID (admin only)
router.delete("/:id", protect, verifyAdmin, deleteLecture);

export default router;
