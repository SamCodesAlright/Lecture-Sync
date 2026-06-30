import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

const getAllInstructors = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.INSTRUCTOR.GET_ALL);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch instructors.",
      }
    );
  }
};

const getInstructorById = async (instructorId) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.INSTRUCTOR.GET_BY_ID(instructorId),
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch instructor details.",
      }
    );
  }
};

const instructorService = {
  getAllInstructors,
  getInstructorById,
};

export default instructorService;
