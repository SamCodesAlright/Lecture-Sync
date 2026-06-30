import User from "../models/User.js";

export const getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" })
      .select("-password")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      message: "Instructors fetched successfully",
      count: instructors.length,
      data: instructors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch instructors",
    });
  }
};

export const getInstructorById = async (req, res) => {
  try {
    const instructor = await User.findOne({
      _id: req.params.id,
      role: "instructor",
    }).select("-password");

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Instructor fetched successfully",
      data: instructor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch instructor",
    });
  }
};

export default {
  getAllInstructors,
  getInstructorById,
};
