import Course from "../models/Course.js";
import { validationResult } from "express-validator";

export const createCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((error) => error.msg),
        statusCode: 400,
      });
    }

    const { name, level, description } = req.body;
    const imageUrl = req.cloudinaryImage?.url || null;

    if (!name || !level || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        statusCode: 400,
      });
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Course image is required",
        statusCode: 400,
      });
    }

    const course = await Course.create({
      name,
      level,
      description,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      statusCode: 500,
    });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("Get all courses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      statusCode: 500,
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Get course by id error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      statusCode: 500,
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((error) => error.msg),
        statusCode: 400,
      });
    }

    const { name, level, description } = req.body;
    const updatedData = {};

    if (name) updatedData.name = name;
    if (level) updatedData.level = level;
    if (description) updatedData.description = description;

    if (req.cloudinaryImage?.url) {
      updatedData.image = req.cloudinaryImage.url;
    }

    const course = await Course.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update course",
      statusCode: 500,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      statusCode: 500,
    });
  }
};

export default {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
