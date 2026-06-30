import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

const login = async (email, password) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Login failed.",
      }
    );
  }
};

const getLoggedInUser = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch logged-in user.",
      }
    );
  }
};

const authService = {
  login,
  getLoggedInUser,
};

export default authService;
