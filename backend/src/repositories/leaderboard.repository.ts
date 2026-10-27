
import prisma from "../lib/prismaClient.js";
import type { GameType } from "../../generated/prisma/client.js";

export class LeaderboardRepository {
  async getOverallScores() {
    return prisma.activityAttempt.groupBy({
      by: ["userId"],
      _sum: {
        gameScore: true,
        educationalScore: true,
      },
    });
  }

  async getUserTotalScore(userId: string) {
    const result = await prisma.activityAttempt.aggregate({
      where: { userId },
      _sum: {
        gameScore: true,
        educationalScore: true,
      },
    });

    return (
      (result._sum.gameScore ?? 0) +
      (result._sum.educationalScore ?? 0)
    );
  }

  async getLessonScores(lessonId: string) {
    return prisma.activityAttempt.groupBy({
      by: ["userId"],
      where: { lessonId },
      _sum: {
        educationalScore: true,
      },
    });
  }

  /**
   * Επιστρέφει όλες τις προσπάθειες του συγκεκριμένου παιχνιδιού.
   * Ο ίδιος μαθητής μπορεί να εμφανίζεται σε πολλές θέσεις.
   */
  async getGameAttempts(gameType: GameType) {
    return prisma.activityAttempt.findMany({
      where: {
        gameSession: {
          is: { gameType },
        },
      },
      select: {
        id: true,
        userId: true,
        gameScore: true,
        educationalScore: true,
        completedAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async getKnowledgeCheckScores() {
    return prisma.openQuestionEvaluation.groupBy({
      by: ["userId"],
      _sum: {
        score: true,
      },
    });
  }

  async getUsers(userIds: string[]) {
    if (userIds.length === 0) {
      return [];
    }

    return prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getLessons() {
    return prisma.lesson.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: "asc",
      },
    });
  }
}

export const leaderboardRepository =
  new LeaderboardRepository();
