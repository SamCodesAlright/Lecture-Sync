import { validationResult } from "express-validator";
import Lecture from "../models/Lecture.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

const normalizeDate = (dateValue) => {
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const assignLecture = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((error) => error.msg),
      });
    }

    const { course, instructor, lectureDate } = req.body;

    const existingCourse = await Course.findById(course);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const existingInstructor = await User.findOne({
      _id: instructor,
      role: "instructor",
    });

    if (!existingInstructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    const normalizedLectureDate = normalizeDate(lectureDate);
    const conflict = await Lecture.findOne({
      instructor,
      lectureDate: {
        $gte: normalizedLectureDate,
        $lt: new Date(normalizedLectureDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: "Instructor is already assigned a lecture on this date.",
      });
    }

    const lecture = await Lecture.create({
      course,
      instructor,
      lectureDate: normalizedLectureDate,
    });

    const populatedLecture = await Lecture.findById(lecture._id)
      .populate("course", "name")
      .populate("instructor", "name email role");

    res.status(201).json({
      success: true,
      message: "Lecture assigned successfully.",
      data: populatedLecture,
    });
  } catch (error) {
    console.error("Assign lecture error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to assign lecture",
    });
  }
};

export const getAllLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find()
      .populate("course", "name")
      .populate("instructor", "name email role")
      .sort({ lectureDate: 1 });

    res.status(200).json({
      success: true,
      count: lectures.length,
      data: lectures,
    });
  } catch (error) {
    console.error("Get all lectures error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lectures",
    });
  }
};

export const getInstructorLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({ instructor: req.user.id })
      .populate("course", "name")
      .sort({ lectureDate: 1 });

    res.status(200).json({
      success: true,
      count: lectures.length,
      data: lectures,
    });
  } catch (error) {
    console.error("Get instructor lectures error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch instructor lectures",
    });
  }
};

export const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findByIdAndDelete(req.params.id);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    console.error("Delete lecture error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete lecture",
    });
  }
};

export default {
  assignLecture,
  getAllLectures,
  getInstructorLectures,
  deleteLecture,
};
