import { GoogleGenAI } from '@google/genai';

import { env } from '../../config/env.js';

import type {
  AIProvider,
  GenerateEmbeddingInput,
  GenerateEmbeddingsInput,
  GenerateTextInput,
} from '../types/ai.types.js';

export class GeminiProvider implements AIProvider {
  private readonly client: GoogleGenAI;

  private readonly maxRetries = 3;
  private readonly initialRetryDelayMs = 1000;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    });
  }

  async generateText(
    input: GenerateTextInput,
  ): Promise<string> {
    return this.withRetry(
      async () => {
        const interaction =
          await this.client.interactions.create({
            model: env.GEMINI_MODEL,
            input: input.prompt,
          });

        return interaction.output_text ?? '';
      },
    );
  }

  async generateEmbedding(
    input: GenerateEmbeddingInput,
  ): Promise<number[]> {
    return this.withRetry(
      async () => {
        const response =
          await this.client.models.embedContent({
            model: env.GEMINI_EMBEDDING_MODEL,
            contents: input.text,
            config: {
              taskType: input.task,
              outputDimensionality:
                env.GEMINI_EMBEDDING_DIMENSIONS,
            },
          });

        return response.embeddings?.[0]?.values ?? [];
      },
    );
  }

  async generateEmbeddings(
    input: GenerateEmbeddingsInput,
  ): Promise<number[][]> {
    return this.withRetry(
      async () => {
        const response =
          await this.client.models.embedContent({
            model: env.GEMINI_EMBEDDING_MODEL,
            contents: input.texts,
            config: {
              taskType: input.task,
              outputDimensionality:
                env.GEMINI_EMBEDDING_DIMENSIONS,
            },
          });

        return (
          response.embeddings?.map(
            (embedding) =>
              embedding.values ?? [],
          ) ?? []
        );
      },
    );
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
  ): Promise<T> {
    for (
      let attempt = 0;
      attempt <= this.maxRetries;
      attempt += 1
    ) {
      try {
        return await operation();
      } catch (error) {
        if (
          !this.isRateLimitError(error) ||
          attempt === this.maxRetries
        ) {
          throw error;
        }

        const delay =
          this.initialRetryDelayMs *
          2 ** attempt;

        await this.sleep(delay);
      }
    }

    throw new Error(
      'Retry operation failed unexpectedly.',
    );
  }

  private isRateLimitError(
    error: unknown,
  ): boolean {
    if (
      typeof error !== 'object' ||
      error === null
    ) {
      return false;
    }

    const candidate = error as {
      status?: number;
      code?: number | string;
      message?: string;
    };

    return (
      candidate.status === 429 ||
      candidate.code === 429 ||
      candidate.message?.includes('429') === true ||
      candidate.message
        ?.toLowerCase()
        .includes('resource exhausted') === true
    );
  }

  private sleep(
    delayMs: number,
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, delayMs);
    });
  }
}