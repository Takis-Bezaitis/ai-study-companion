export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GenerateTextInput {
  prompt: string;
}

export interface RewriteQueryInput {
  question: string;
  history: ChatHistoryMessage[];
}

export type EmbeddingTask =
  | 'RETRIEVAL_DOCUMENT'
  | 'RETRIEVAL_QUERY';

export interface GenerateEmbeddingInput {
  text: string;
  task: EmbeddingTask;
}

export interface GenerateEmbeddingsInput {
  texts: string[];
  task: EmbeddingTask;
}

export interface AIProvider {
  generateText(input: GenerateTextInput): Promise<string>;

  rewriteQuery(
    input: RewriteQueryInput,
  ): Promise<string>;

  generateEmbedding(
    input: GenerateEmbeddingInput,
  ): Promise<number[]>;

  generateEmbeddings(
    input: GenerateEmbeddingsInput,
  ): Promise<number[][]>;
}

