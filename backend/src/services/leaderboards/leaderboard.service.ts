import { AppError } from "../../utils/AppError.js";
import { leaderboardRepository } from "../../repositories/leaderboard.repository.js";

import { GameType } from "../../../generated/prisma/client.js";

const LEADERBOARD_LIMIT = 5;

export class LeaderboardService {
  /**
   * total score = gameScore + educationalScore.
   */
  
  async getOverallLeaderboard() {
    const scores =
      await leaderboardRepository.getOverallScores();

    const users = await leaderboardRepository.getUsers(
      scores.map((item) => item.userId),
    );

    const userMap = new Map(
      users.map((user) => [user.id, user]),
    );

    const leaderboard = scores
      .map((item) => ({
        userId: item.userId,
        name: userMap.get(item.userId)?.name ?? "Unknown user",
        score:
          (item._sum.gameScore ?? 0) +
          (item._sum.educationalScore ?? 0),
      }))
      .sort(
        (a, b) =>
          b.score - a.score ||
          a.userId.localeCompare(b.userId),
      );

    return {
      leaderboard: leaderboard.slice(0, LEADERBOARD_LIMIT),
    };
  }


  /**
   * total score of a user
   */
  
  async getUserTotalScore(userId: string) {
    const score =
      await leaderboardRepository.getUserTotalScore(userId);

    return { score };
  }


  /**
   * Ranking by lesson
   */
  async getLessonLeaderboard(lessonId: string) {
    const lessons = await leaderboardRepository.getLessons();

    const lesson = lessons.find(
      (item) => item.id === lessonId,
    );

    if (!lesson) {
      throw new AppError("Lesson not found.", 404);
    }

    const scores =
      await leaderboardRepository.getLessonScores(lessonId);

    const users = await leaderboardRepository.getUsers(
      scores.map((item) => item.userId),
    );

    const userMap = new Map(
      users.map((user) => [user.id, user]),
    );

    const leaderboard = scores
      .map((item) => ({
        userId: item.userId,
        name: userMap.get(item.userId)?.name ?? "Unknown user",
        score: item._sum.educationalScore ?? 0,
      }))
      .sort(
        (a, b) =>
          b.score - a.score ||
          a.userId.localeCompare(b.userId),
      );

    return {
      lesson: {
        id: lesson.id,
        title: lesson.title,
      },
      leaderboard: leaderboard.slice(0, LEADERBOARD_LIMIT),
    };
  }

  /**
   * Ranking by game.
   */
  
  async getGameLeaderboard(gameType: GameType) {
    const attempts =
      await leaderboardRepository.getGameAttempts(gameType);

    const leaderboard = attempts
      .map((attempt) => ({
        attemptId: attempt.id,
        userId: attempt.userId,
        name: attempt.user.name ?? "Unknown user",
        score: attempt.gameScore + attempt.educationalScore,
        completedAt: attempt.completedAt,
      }))
      .sort(
        (a, b) =>
          b.score - a.score ||
          a.completedAt.getTime() - b.completedAt.getTime() ||
          a.attemptId.localeCompare(b.attemptId),
      )
      .slice(0, LEADERBOARD_LIMIT);

    return {
      gameType,
      leaderboard,
    };
  }


  /**
   * Knowledge Check ranking
   */
  async getKnowledgeCheckLeaderboard() {
    const scores =
      await leaderboardRepository.getKnowledgeCheckScores();

    const users = await leaderboardRepository.getUsers(
      scores.map((item) => item.userId),
    );

    const userMap = new Map(
      users.map((user) => [user.id, user]),
    );

    const leaderboard = scores
      .map((item) => ({
        userId: item.userId,
        name: userMap.get(item.userId)?.name ?? "Unknown user",
        score: item._sum.score ?? 0,
      }))
      .sort(
        (a, b) =>
          b.score - a.score ||
          a.userId.localeCompare(b.userId),
      );

    return {
      leaderboard: leaderboard.slice(0, LEADERBOARD_LIMIT),
    };
  }

  async getAvailableGames() {
    const games = Object.values(GameType).map((gameType) => ({
      gameType,
      title: gameType
        .toLowerCase()
        .split("_")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() + word.slice(1),
        )
        .join(" "),
    }));

    return { games };
  }

}

export const leaderboardService = new LeaderboardService();
