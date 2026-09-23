import type {
  AIProvider,
  GenerateEmbeddingInput,
  GenerateEmbeddingsInput,
  GenerateTextInput,
  RewriteQueryInput,
} from '../../ai/types/ai.types.js';

export class AIService {
  constructor(
    private readonly provider: AIProvider,
  ) {}

  async generateText(
    input: GenerateTextInput,
  ): Promise<string> {
    return this.provider.generateText(input);
  }

  async rewriteQuery(
    input: RewriteQueryInput,
  ): Promise<string> {
    return this.provider.rewriteQuery(input);
  }

  async generateEmbedding(
    input: GenerateEmbeddingInput,
  ): Promise<number[]> {
    return this.provider.generateEmbedding(input);
  }

  async generateEmbeddings(
    input: GenerateEmbeddingsInput,
  ): Promise<number[][]> {
    return this.provider.generateEmbeddings(input);
  }
}