const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

export const API = {
  auth: {
    base: `${BASE_URL}/api/auth`,
    login: `${BASE_URL}/api/auth/login`,
    refresh: `${BASE_URL}/api/auth/refresh`,
    logout: `${BASE_URL}/api/auth/logout`,
    me: `${BASE_URL}/api/auth/me`,
  },

  categories: `${BASE_URL}/api/categories`,
  lessons: {
    base: `${BASE_URL}/api/lessons`,
    ask: (lessonId: string) => `${BASE_URL}/api/lessons/${lessonId}/ask`,
    chunks: (lessonId: string) => `${BASE_URL}/api/lessons/${lessonId}/chunks`,
  },
  progress: `${BASE_URL}/api/progress`,
};