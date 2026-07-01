import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Fetching JWT token from localStorage
    const token = localStorage.getItem("token");

    // Attaching Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Preventing override Content-Type for FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Checking if JWT is expired or invalid
    if (error.response?.status === 401) {
      console.error("Unauthorized. Please login again.");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Preventing redirect loop
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Handling Forbidden status
    if (error.response?.status === 403) {
      console.error("Access denied.");
    }

    // Handling Not Found status
    if (error.response?.status === 404) {
      console.error("Requested resource not found.");
    }

    // Handling Validation Error
    if (error.response?.status === 400) {
      console.error(error.response.data?.message || "Bad Request");
    }

    // Handling Server Error
    if (error.response?.status >= 500) {
      console.error("Internal Server Error");
    }

    // Handling Request Timeout
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout.");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
