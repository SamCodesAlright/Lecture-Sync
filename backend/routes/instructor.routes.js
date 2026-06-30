import express from "express";
import {
  getAllInstructors,
  getInstructorById,
} from "../controllers/instructor.controller.js";

const router = express.Router();

// Get a list of all instructors
router.get("/", getAllInstructors);

// Get details for a single instructor by ID
router.get("/:id", getInstructorById);

export default router;
