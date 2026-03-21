export type LLMResponse = string | string[];

export interface LLMProvider {
  generate(prompt: string): Promise<LLMResponse>;
}