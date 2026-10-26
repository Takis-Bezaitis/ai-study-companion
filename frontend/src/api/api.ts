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
    stream: (lessonId: string) => `${BASE_URL}/api/lessons/${lessonId}/ask/stream`,
    chunks: (lessonId: string) => `${BASE_URL}/api/lessons/${lessonId}/chunks`,
    openQuestions: (lessonId: string) => `${BASE_URL}/api/lessons/${lessonId}/open-questions`,
    evaluateOpenQuestion: (lessonId: string, questionId: string,) =>
      `${BASE_URL}/api/lessons/${lessonId}/open-questions/${questionId}/evaluate`,
  },
  
  games: {
    roadRaceMission: (lessonId: string) => `${BASE_URL}/api/lessons/${lessonId}/games/road-race/mission`,
    startRoadRace: (lessonId: string) => `${BASE_URL}/api/lessons/${lessonId}/games/road-race/start`,
    nextRoadRaceBatch: (sessionId: string) => `${BASE_URL}/api/games/sessions/${sessionId}/spawns/next`,
    catchItems: (lessonId: string) => `${BASE_URL}/api/lessons/${lessonId}/games/catch-items`,
  },

  completeGameSession: (sessionId: string) => `${BASE_URL}/api/games/sessions/${sessionId}/complete`,

  progress: `${BASE_URL}/api/progress`,
};