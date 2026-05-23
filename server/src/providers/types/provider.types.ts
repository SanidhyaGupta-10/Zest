export type LLMResponse = string;

export interface LLMProvider {
  readonly name: string;
  generate(prompt: string): Promise<LLMResponse>;
}