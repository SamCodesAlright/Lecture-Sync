// Default API URLs
const DEFAULT_DEV_API_URL = "http://localhost:3000";
const DEFAULT_PROD_API_URL = "https://your-backend-url.onrender.com";

// Base URL
export const BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL_DEV || DEFAULT_DEV_API_URL
  : import.meta.env.VITE_API_URL || DEFAULT_PROD_API_URL;

// API Endpoints
export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
  },

  INSTRUCTOR: {
    GET_ALL: "/api/instructors",
    GET_BY_ID: (id) => `/api/instructors/${id}`,
  },

  COURSE: {
    CREATE: "/api/courses",
    GET_ALL: "/api/courses",
    GET_BY_ID: (id) => `/api/courses/${id}`,
    UPDATE: (id) => `/api/courses/${id}`,
    DELETE: (id) => `/api/courses/${id}`,
  },

  LECTURE: {
    ASSIGN: "/api/lectures",
    GET_ALL: "/api/lectures",
    GET_MY_LECTURES: "/api/lectures/my-lectures",
    DELETE: (id) => `/api/lectures/${id}`,
  },
};
