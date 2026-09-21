import type {
  AIProvider,
  GenerateEmbeddingInput,
  GenerateEmbeddingsInput,
  GenerateTextInput,
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