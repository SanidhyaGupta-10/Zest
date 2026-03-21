import { bytezProvider } from "./bytez.provider";
import { deepseekProvider } from "./deepseek.provider";
import { geminiProvider } from "./gemini.provider";
import { groqProvider } from "./groq.provider";
import { openaiProvider } from "./openai.provider";

// Multi-provider fallback ensures responses are under 2-3 seconds by prioritizing fast models (Groq)
export const generateWithFallback = async (fullPrompt: string) => {
  // 1️⃣ HIGH SPEED: Groq (Llama 3.3 70B)
  try {
    console.log("Using Groq (Llama 3.3)...");
    return await groqProvider.generate(fullPrompt);
  } catch (err) {
    console.error("Groq failed:", err);
  }

  // 2️⃣ RELIABLE: Gemini
  try {
    console.log("Using Gemini...");
    return await geminiProvider.generate(fullPrompt);
  } catch (err) {
    console.error("Gemini failed:", err);
  }

  // 3️⃣ ALTERNATIVE: DeepSeek
  try {
    console.log('Using DeepSeek...');
    return await deepseekProvider.generate(fullPrompt);
  } catch (err) {
    console.error('DeepSeek failed:', err);
  }

  // 4️⃣ ALTERNATIVE: Bytez
  try {
    console.log('Using Bytez...');
    return await bytezProvider.generate(fullPrompt);
  } catch (error) {
    console.error('Bytez failed:', error);
  }

  // 5️⃣ LAST RESORT: OpenAI (Costly/Slower fallback)
  try {
    console.log("Using OpenAI...");
    return await openaiProvider.generate(fullPrompt);
  } catch (err) {
    console.error("OpenAI failed:", err);
  }

  // Final static fallback - never return empty
  console.warn("All LLM providers failed. Using static fallback.");
  return "I'm sorry, I'm currently unable to process this request due to technical difficulties. Please try a simpler query or try again in a few minutes.";
};

// Aliases for compatibility with different modules
export const generateFromLLM = generateWithFallback;
export const generateQuestionsWithFallback = generateWithFallback;