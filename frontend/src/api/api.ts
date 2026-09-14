const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

export const API = {
  auth: {
    base: `${BASE_URL}/api/auth`,
    login: `${BASE_URL}/api/auth/login`,
    refresh: `${BASE_URL}/api/auth/refresh`,
    logout: `${BASE_URL}/api/auth/logout`,
    me: `${BASE_URL}/api/auth/me`,
  },

  lessons: `${BASE_URL}/api/lessons`,
  progress: `${BASE_URL}/api/progress`,
};