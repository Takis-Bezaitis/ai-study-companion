export interface GenerateTextInput {
  prompt: string;
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

  generateEmbedding(
    input: GenerateEmbeddingInput,
  ): Promise<number[]>;

  generateEmbeddings(
    input: GenerateEmbeddingsInput,
  ): Promise<number[][]>;
}