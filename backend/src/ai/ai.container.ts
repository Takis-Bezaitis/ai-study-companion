import { AIService } from '../services/ai/ai.service.js';
import { GeminiProvider } from './providers/gemini.provider.js';

const geminiProvider = new GeminiProvider();

export const aiService = new AIService(geminiProvider);