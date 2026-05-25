import { groqProvider } from "./groq.provider";

// Generates high-speed responses using the Groq provider (Llama 3.3 70B)
export const generateWithFallback = async (fullPrompt: string) => {
  try {
    return await groqProvider.generate(fullPrompt);
  } catch (err) {
    throw new Error("Groq provider failed", { cause: err instanceof Error ? err : new Error(String(err)) });
  }
};

// Aliases for compatibility with different modules
export const generateFromLLM = generateWithFallback;
export const generateQuestionsWithFallback = generateWithFallback;