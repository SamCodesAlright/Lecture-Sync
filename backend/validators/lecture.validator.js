import { body } from "express-validator";

export const lectureValidation = [
  body("course")
    .trim()
    .notEmpty()
    .withMessage("Course is required")
    .isMongoId()
    .withMessage("Course must be a valid MongoDB ObjectId"),
  body("instructor")
    .trim()
    .notEmpty()
    .withMessage("Instructor is required")
    .isMongoId()
    .withMessage("Instructor must be a valid MongoDB ObjectId"),
  body("lectureDate")
    .trim()
    .notEmpty()
    .withMessage("Lecture date is required")
    .isISO8601()
    .withMessage("Lecture date must be a valid date"),
];

export default lectureValidation;
