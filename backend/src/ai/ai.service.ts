import type {
  AIProvider,
  GenerateTextInput,
} from './types/ai.types.js';

export class AIService {
  constructor(
    private readonly provider: AIProvider,
  ) {}

  async generateText(
    input: GenerateTextInput,
  ): Promise<string> {
    return this.provider.generateText(input);
  }
}