
import { z } from 'zod';

// Request from the student
export const submitOpenQuestionAnswerSchema = z.object({
  answer: z
    .string()
    .trim()
    .min(1, 'Answer is required')
    .max(5000, 'Answer is too long'),
});

// Gemini output: question generation
export const generatedOpenQuestionSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1)
    .max(1000),

  referenceAnswer: z
    .string()
    .trim()
    .min(1)
    .max(3000),

  evaluationCriteria: z
    .array(
      z.object({
        criterion: z.string().trim().min(1).max(200),
        maxPoints: z.number().int().positive().max(100),
      }),
    )
    .min(2)
    .max(5)
    .refine(
      (criteria) =>
        criteria.reduce(
          (sum, item) => sum + item.maxPoints,
          0,
        ) === 100,
      'Evaluation criteria must total 100 points',
    ),
});

// Gemini output: answer evaluation
export const openQuestionEvaluationSchema = z.object({
  criterionScores: z
    .array(
      z.object({
        criterion: z.string().trim().min(1).max(200),
        awardedPoints: z.number().int().min(0).max(100),
        feedback: z.string().trim().min(1).max(1000),
      }),
    )
    .min(2)
    .max(5),

  reasoning: z.string().trim().min(1).max(2000),

  correctPoints: z.array(
    z.string().trim().min(1).max(500),
  ).max(10),

  missingPoints: z.array(
    z.string().trim().min(1).max(500),
  ).max(10),

  suggestions: z.array(
    z.string().trim().min(1).max(500),
  ).max(10),
});

export type SubmitOpenQuestionAnswerInput = z.infer<
  typeof submitOpenQuestionAnswerSchema
>;

export type GeneratedOpenQuestion = z.infer<
  typeof generatedOpenQuestionSchema
>;

export type OpenQuestionEvaluation = z.infer<
  typeof openQuestionEvaluationSchema
>;
