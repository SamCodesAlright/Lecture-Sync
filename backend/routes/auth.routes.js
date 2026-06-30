import express from "express";
import { body } from "express-validator";
import { loginUser, getLoggedInUser } from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// Validation middleware for login route
const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Public route for user login
router.post("/login", loginValidation, loginUser);

// Protected route to get the logged-in user's information
router.get("/profile", protect, getLoggedInUser);

export default router;
