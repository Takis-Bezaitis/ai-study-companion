import prisma from "../lib/prismaClient.js";

export interface CreateOpenQuestionInput {
  userId: string;
  lessonId: string;
  sectionTitle: string;
  question: string;
  referenceAnswer: string;
  evaluationCriteria: {
    criterion: string;
    maxPoints: number;
  }[];
  sourceChunkIds: string[];
}

export interface CreateOpenQuestionEvaluationInput {
  userId: string;
  questionId: string;
  answer: string;
  score: number;
  feedback: {
    criterionScores: {
      criterion: string;
      awardedPoints: number;
      feedback: string;
    }[];
    reasoning: string;
    correctPoints: string[];
    missingPoints: string[];
    suggestions: string[];
  };
}

export class OpenQuestionRepository {
  async create(
    input: CreateOpenQuestionInput,
  ) {
    return prisma.openQuestion.create({
      data: {
        userId: input.userId,
        lessonId: input.lessonId,
        sectionTitle: input.sectionTitle,
        question: input.question,
        referenceAnswer: input.referenceAnswer,
        evaluationCriteria: input.evaluationCriteria,
        sourceChunkIds: input.sourceChunkIds,
      },
    });
  }

  async findById(
    questionId: string,
    userId: string,
    lessonId: string,
  ) {
    return prisma.openQuestion.findFirst({
      where: {
        id: questionId,
        userId,
        lessonId,
      },
    });
  }

  async createEvaluation(
    input: CreateOpenQuestionEvaluationInput,
  ) {
    return prisma.openQuestionEvaluation.create({
      data: {
        userId: input.userId,
        questionId: input.questionId,
        answer: input.answer,
        score: input.score,
        feedback: input.feedback,
      },
    });
  }

  async findEvaluationsByUser(
    userId: string,
    lessonId?: string,
  ) {
    return prisma.openQuestionEvaluation.findMany({
      where: {
        userId,
        ...(lessonId
          ? {
              question: {
                lessonId,
              },
            }
          : {}),
      },
      include: {
        question: {
          select: {
            id: true,
            lessonId: true,
            sectionTitle: true,
            question: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export const openQuestionRepository =
  new OpenQuestionRepository();
