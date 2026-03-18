export type LLMResponse = string[];

export interface LLMProvider {
  generateQuestions(topic: string): Promise<LLMResponse>;
}