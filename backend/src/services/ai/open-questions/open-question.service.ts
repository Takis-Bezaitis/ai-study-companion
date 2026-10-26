import { AppError } from "../../../utils/AppError.js";
import { aiService } from "../../../ai/ai.container.js";
import prisma from "../../../lib/prismaClient.js";
import { openQuestionRepository } from "../../../repositories/open-question.repository.js";
import {
  generatedOpenQuestionSchema,
  openQuestionEvaluationSchema,
  submitOpenQuestionAnswerSchema,
} from "../../../validations/open-question.validation.js";

const MAX_SECTION_CHARS = 24_000;

export class OpenQuestionService {
  async generateQuestion(
    userId: string,
    lessonId: string,
  ) {
    const chunks = await prisma.lessonChunk.findMany({
      where: { lessonId },
      select: {
        id: true,
        content: true,
        sectionTitle: true,
        chunkIndex: true,
      },
    });

    if (chunks.length === 0) {
      throw new AppError(
        "No lesson content is available.",
        404,
      );
    }

    // Select one section at random.
    const sections = new Map<
      string,
      typeof chunks
    >();

    for (const chunk of chunks) {
      const section = sections.get(chunk.sectionTitle) ?? [];
      section.push(chunk);
      sections.set(chunk.sectionTitle, section);
    }

    const selectedSection = Array.from(
      sections.values(),
    )[Math.floor(Math.random() * sections.size)];

    if (!selectedSection) {
      throw new AppError(
        "Could not select a lesson section.",
        500,
      );
    }

    const sectionTitle = selectedSection[0]!.sectionTitle;
    
    const orderedChunks = [...selectedSection].sort(
        (a, b) => a.chunkIndex - b.chunkIndex,
    );

    const includedChunks: typeof orderedChunks = [];
    let totalChars = 0;

    for (const chunk of orderedChunks) {
    const extraChars = chunk.content.length;

    if (totalChars + extraChars > MAX_SECTION_CHARS) {
        // Include a partial chunk only if some space remains.
        const remaining = MAX_SECTION_CHARS - totalChars;

        if (remaining > 0) {
        includedChunks.push({
            ...chunk,
            content: chunk.content.slice(0, remaining),
        });
        }

        break;
    }

    includedChunks.push(chunk);
    totalChars += extraChars;
    }

    if (includedChunks.length === 0) {
    throw new AppError(
        "The selected lesson section has no usable content.",
        422,
    );
    }

    const sourceText = includedChunks
    .map((chunk) => chunk.content)
    .join("\n\n");

    const prompt = `
You are an educational assessment designer.

Use ONLY the lesson material below to create one open-ended
question that tests understanding, not just memorization.

Return ONLY valid JSON matching this structure:
{
  "question": "string",
  "referenceAnswer": "string",
  "evaluationCriteria": [
    {
      "criterion": "string",
      "maxPoints": 30
    }
  ]
}

Rules:
- Create 2 to 5 distinct, specific evaluation criteria.
- Each criterion must describe an assessable aspect of the answer.
- Each maxPoints must be a positive integer.
- The sum of maxPoints must equal exactly 100.
- The reference answer and criteria must be grounded in the lesson.
- Do not include Markdown fences or text outside the JSON.

Section: ${sectionTitle}

Lesson material:
${sourceText}
`;

    const raw = await aiService.generateText({ prompt });
    const generated = this.parseJson(
      raw,
      generatedOpenQuestionSchema,
    );

    const question = await openQuestionRepository.create({
      userId,
      lessonId,
      sectionTitle,
      question: generated.question,
      referenceAnswer: generated.referenceAnswer,
      evaluationCriteria: generated.evaluationCriteria,
      sourceChunkIds: includedChunks.map((chunk) => chunk.id),
    });

    return {
      id: question.id,
      lessonId: question.lessonId,
      sectionTitle: question.sectionTitle,
      question: question.question,
      evaluationCriteria: question.evaluationCriteria,
      createdAt: question.createdAt,
    };
  }

  async evaluateAnswer(
    userId: string,
    lessonId: string,
    questionId: string,
    input: unknown,
    ) {
    const { answer } = submitOpenQuestionAnswerSchema.parse(input);

    const question = await openQuestionRepository.findById(
        questionId,
        userId,
        lessonId,
    );

    if (!question) {
        throw new AppError("Question not found.", 404);
    }

    const chunks = await prisma.lessonChunk.findMany({
        where: {
        id: { in: question.sourceChunkIds },
        lessonId,
        },
        select: {
        id: true,
        content: true,
        sectionTitle: true,
        chunkIndex: true,
        },
    });

    if (chunks.length !== question.sourceChunkIds.length) {
        throw new AppError(
            "Some source lesson content is unavailable.",
            404,
        );
    }

    // Restore the original lesson order.
    const orderedChunks = chunks.sort(
        (a, b) => a.chunkIndex - b.chunkIndex,
    );

    const criteria = generatedOpenQuestionSchema.shape
        .evaluationCriteria.parse(
        question.evaluationCriteria,
        );

    const sourceText = orderedChunks
        .map((chunk) => chunk.content)
        .join("\n\n");

    const prompt = `
    You are a fair educational evaluator.

    Evaluate the student's answer using ONLY the lesson material,
    the question, the reference answer, and the supplied rubric.

    Return ONLY valid JSON matching this structure:
    {
    "criterionScores": [
        {
        "criterion": "exact rubric criterion name",
        "awardedPoints": 0,
        "feedback": "brief explanation"
        }
    ],
    "reasoning": "overall explanation",
    "correctPoints": ["..."],
    "missingPoints": ["..."],
    "suggestions": ["..."]
    }

    Rules:
    - Return exactly one criterionScores entry per rubric criterion.
    - Use each criterion name EXACTLY as provided.
    - awardedPoints must be an integer from 0 to that criterion's maxPoints.
    - Do not award credit for unsupported or incorrect claims.
    - Be fair to equivalent wording; do not require exact phrases.
    - Feedback must be constructive and based on the lesson.
    - Do not include Markdown fences or text outside the JSON.

    Question:
    ${question.question}

    Reference answer:
    ${question.referenceAnswer}

    Rubric:
    ${JSON.stringify(criteria)}

    Lesson material:
    ${sourceText}

    Student answer:
    ${answer}
    `;

    const raw = await aiService.generateText({ prompt });

    const evaluation = this.parseJson(
        raw,
        openQuestionEvaluationSchema,
    );

    if (
        evaluation.criterionScores.length !== criteria.length
    ) {
        throw new AppError(
        "AI returned an invalid evaluation rubric.",
        502,
        );
    }

    const scoresByCriterion = new Map(
        evaluation.criterionScores.map((item) => [
        item.criterion,
        item,
        ]),
    );

    const criterionScores = criteria.map((criterion) => {
        const result = scoresByCriterion.get(
        criterion.criterion,
        );

        if (
        !result ||
        result.awardedPoints > criterion.maxPoints
        ) {
        throw new AppError(
            "AI returned an invalid evaluation rubric.",
            502,
        );
        }

        return result;
    });

    if (
        new Set(
        evaluation.criterionScores.map(
            (item) => item.criterion,
        ),
        ).size !== criteria.length
    ) {
        throw new AppError(
        "AI returned duplicate evaluation criteria.",
        502,
        );
    }

    const score = criterionScores.reduce(
        (total, item) => total + item.awardedPoints,
        0,
    );

    const feedback = {
        ...evaluation,
        criterionScores,
    };

    const savedEvaluation =
        await openQuestionRepository.createEvaluation({
        userId,
        lessonId,
        questionId,
        answer,
        score,
        feedback,
        });

    return {
        id: savedEvaluation.id,
        questionId,
        answer,
        score,
        maxScore: 100,
        feedback,
        createdAt: savedEvaluation.createdAt,
    };
  }

  private parseJson<T>(
    raw: string,
    schema: {
      parse: (value: unknown) => T;
    },
  ): T {
    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new AppError(
        "AI returned invalid JSON.",
        502,
      );
    }

    try {
      return schema.parse(parsed);
    } catch {
      throw new AppError(
        "AI returned an invalid response structure.",
        502,
      );
    }
  }
}

export const openQuestionService =
  new OpenQuestionService();
