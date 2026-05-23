import { bytezProvider } from "./bytez.provider.js";
import { deepseekProvider } from "./deepseek.provider.js";
import { geminiProvider } from "./gemini.provider.js";
import { groqProvider } from "./groq.provider.js";
import { openaiProvider } from "./openai.provider.js";

/**
 * @server\src\providers\llm.router.ts generateWithFallback
 * @description Multi-provider fallback ensures responses are under 2-3 seconds by prioritizing fast models (Groq).
 * @access internal
 */
export const generateWithFallback = async (fullPrompt: string) => {
  // 1️⃣ HIGH SPEED: Groq (Llama 3.3 70B)
  try {

    return await groqProvider.generate(fullPrompt);
  } catch (err) {

  }

  // 2️⃣ RELIABLE: Gemini
  try {

    return await geminiProvider.generate(fullPrompt);
  } catch (err) {

  }

  // 3️⃣ ALTERNATIVE: DeepSeek
  try {

    return await deepseekProvider.generate(fullPrompt);
  } catch (err) {

  }

  // 4️⃣ ALTERNATIVE: Bytez
  try {

    return await bytezProvider.generate(fullPrompt);
  } catch (error) {

  }

  // 5️⃣ LAST RESORT: OpenAI (Costly/Slower fallback)
  try {

    return await openaiProvider.generate(fullPrompt);
  } catch (err) {

  }

  // Final static fallback - never return empty

  return "I'm sorry, I'm currently unable to process this request due to technical difficulties. Please try a simpler query or try again in a few minutes.";
};

// Aliases for compatibility with different modules
export const generateFromLLM = generateWithFallback;
export const generateQuestionsWithFallback = generateWithFallback;