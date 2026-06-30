import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

/**
 * Build a FormData payload for course create / update.
 * Fields: name, level, description, image (File | null).
 * If image is null/undefined it is omitted (for update without re-uploading).
 */
const buildCourseFormData = ({ name, level, description, image }) => {
  const formData = new FormData();
  if (name) formData.append("name", name);
  if (level) formData.append("level", level);
  if (description) formData.append("description", description);
  if (image instanceof File) formData.append("image", image);
  return formData;
};

const createCourse = async (courseData) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.COURSE.CREATE,
      buildCourseFormData(courseData),
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create course." };
  }
};

const getAllCourses = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.COURSE.GET_ALL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch courses." };
  }
};

const getCourseById = async (courseId) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.COURSE.GET_BY_ID(courseId),
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to fetch course details." }
    );
  }
};

const updateCourse = async (courseId, courseData) => {
  try {
    const response = await axiosInstance.put(
      API_PATHS.COURSE.UPDATE(courseId),
      buildCourseFormData(courseData),
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update course." };
  }
};

const deleteCourse = async (courseId) => {
  try {
    const response = await axiosInstance.delete(
      API_PATHS.COURSE.DELETE(courseId),
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete course." };
  }
};

const courseService = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};

export default courseService;
