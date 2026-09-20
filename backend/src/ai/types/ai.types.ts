export interface GenerateTextInput {
  prompt: string;
}

export interface AIProvider {
  generateText(input: GenerateTextInput): Promise<string>;
}