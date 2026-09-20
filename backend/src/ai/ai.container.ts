import { AIService } from './ai.service.js';
import { GeminiProvider } from './providers/gemini.provider.js';

const geminiProvider = new GeminiProvider();

export const aiService = new AIService(geminiProvider);