// LLM Router: Single entry point for generating completions with fallback support.
import { groqProvider } from "./groq.provider";

// Primary completion function wrapping the Groq provider execution
export const generateWithFallback = async (fullPrompt: string) => {
  try {
    return await groqProvider.generate(fullPrompt);
  } catch (err) {
    throw new Error("Groq provider failed", { cause: err instanceof Error ? err : new Error(String(err)) });
  }
};

// Aliases exported for backwards compatibility across task modules
export const generateFromLLM = generateWithFallback;
export const generateQuestionsWithFallback = generateWithFallback;