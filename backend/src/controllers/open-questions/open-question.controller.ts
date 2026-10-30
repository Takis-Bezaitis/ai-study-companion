import type { Response, NextFunction } from "express";
import { openQuestionService } from "../../services/ai/open-questions/open-question.service.js";
import type { AuthRequest } from '../../types/custom.js';
import { AppError } from "../../utils/AppError.js";

export async function generateOpenQuestion(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const { lessonId } = req.params;

    if (typeof lessonId !== "string") {
        throw new AppError("Invalid lesson ID.", 400);
    }

    const result = await openQuestionService.generateQuestion(
      userId,
      lessonId,
    );

    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function evaluateOpenQuestion(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const { lessonId, questionId } = req.params;

    if (typeof lessonId !== "string" || typeof questionId !== "string") {
        throw new AppError("Invalid route parameters.", 400);
    }

    const result = await openQuestionService.evaluateAnswer(
      userId,
      lessonId,
      questionId,
      req.body,
    );

    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
}
