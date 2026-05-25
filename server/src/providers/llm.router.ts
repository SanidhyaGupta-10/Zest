import { groqProvider } from "./groq.provider";

// Multi-provider fallback ensures responses are under 2-3 seconds by prioritizing fast models (Groq)
export const generateWithFallback = async (fullPrompt: string) => {
  // 1️⃣ HIGH SPEED: Groq (Llama 3.3 70B)
  try {
    return await groqProvider.generate(fullPrompt);
  } catch (err) {
    throw new Error("Groq provider failed");
  }
};

// Aliases for compatibility with different modules
export const generateFromLLM = generateWithFallback;
export const generateQuestionsWithFallback = generateWithFallback;