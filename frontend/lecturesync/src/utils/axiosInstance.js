import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

// ==========================
// Request Interceptor
// ==========================
axiosInstance.interceptors.request.use(
  (config) => {
    // Get JWT token from localStorage
    const token = localStorage.getItem("token");

    // Attach Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't override Content-Type for FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ==========================
// Response Interceptor
// ==========================
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // JWT expired or invalid
    if (error.response?.status === 401) {
      console.error("Unauthorized. Please login again.");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Prevent redirect loop
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Forbidden
    if (error.response?.status === 403) {
      console.error("Access denied.");
    }

    // Not Found
    if (error.response?.status === 404) {
      console.error("Requested resource not found.");
    }

    // Validation Error
    if (error.response?.status === 400) {
      console.error(error.response.data?.message || "Bad Request");
    }

    // Server Error
    if (error.response?.status >= 500) {
      console.error("Internal Server Error");
    }

    // Request Timeout
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout.");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
