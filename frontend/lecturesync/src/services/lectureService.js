import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

const assignLecture = async (lectureData) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.LECTURE.ASSIGN,
      lectureData,
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to assign lecture.",
      }
    );
  }
};

const getAllLectures = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.LECTURE.GET_ALL);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch lectures.",
      }
    );
  }
};

const getMyLectures = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.LECTURE.GET_MY_LECTURES);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch your lectures.",
      }
    );
  }
};

const deleteLecture = async (lectureId) => {
  try {
    const response = await axiosInstance.delete(
      API_PATHS.LECTURE.DELETE(lectureId),
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to delete lecture.",
      }
    );
  }
};

const lectureService = {
  assignLecture,
  getAllLectures,
  getMyLectures,
  deleteLecture,
};

export default lectureService;
