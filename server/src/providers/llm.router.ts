import { LLMProvider } from "./types/provider.types.js";
import { groqProvider } from "./groq.provider.js";
import { geminiProvider } from "./gemini.provider.js";
import { deepseekProvider } from "./deepseek.provider.js";
import { bytezProvider } from "./bytez.provider.js";
import { openaiProvider } from "./openai.provider.js";

/**
 * 🧱 PROVIDER REGISTRY
 * Priority-ordered list of LLM providers.
 * High speed (Groq) first, reliable (Gemini) second, others as fallbacks.
 */
const providers: LLMProvider[] = [
  groqProvider,
  geminiProvider,
  deepseekProvider,
  bytezProvider,
  openaiProvider,
];

/**
 * @server\src\providers\llm.router.ts generateWithFallback
 * @description Attempts to generate a response using a list of providers in order.
 * If one fails, it automatically tries the next one.
 * @access internal
 */
export const generateWithFallback = async (fullPrompt: string): Promise<string> => {
  for (const provider of providers) {
    try {
      // console.log(`[LLM Router] Trying ${provider.name}...`);
      const result = await provider.generate(fullPrompt);
      
      if (result && result.trim().length > 0) {
        return result;
      }
    } catch (err: any) {
      console.error(`[LLM Router] ${provider.name} failed:`, err.message || err);
      // Continue to next provider...
    }
  }

  // 🚨 FINAL FALLBACK
  return "I'm sorry, I'm currently unable to process this request due to technical difficulties. Please try a simpler query or try again in a few minutes.";
};

// Aliases for compatibility with different modules
export const generateFromLLM = generateWithFallback;
export const generateQuestionsWithFallback = generateWithFallback;