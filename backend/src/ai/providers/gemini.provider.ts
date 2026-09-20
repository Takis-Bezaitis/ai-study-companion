import { GoogleGenAI } from '@google/genai';

import { env } from '../../config/env.js';

import type {
  AIProvider,
  GenerateTextInput,
} from '../types/ai.types.js';

export class GeminiProvider implements AIProvider {
  private readonly client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    });
  }

  async generateText(
    input: GenerateTextInput,
  ): Promise<string> {
    const interaction = await this.client.interactions.create({
      model: env.GEMINI_MODEL,
      input: input.prompt,
    });

    return interaction.output_text ?? '';
  }
}