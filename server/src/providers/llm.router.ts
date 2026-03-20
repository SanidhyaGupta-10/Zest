import { bytezProvider } from "./bytez.provider";
import { deepseekProvider } from "./deepseek.provider";
import { geminiProvider } from "./gemini.provider";
import { groqProvider } from "./groq.provider";
import { openaiProvider } from "./openai.provider";

export const generateFromLLM = async (topic: string) => {
  // 1️⃣ will GROQ
  // if it fails then it go to OpenAI
  try {
    console.log("Using Groq...");
    return await groqProvider.generate(topic);
  } catch (err) {
    console.error("Groq failed:", err);
  }

  // 2️⃣ Again Fallback Option is → Gemini
  try {
    console.log("Using Gemini...");
    return await geminiProvider.generate(topic);
  } catch (err) {
    console.error("Gemini failed:", err);
  }

  // 3️⃣ Again Fallback Option is → DeepSeek
  try{
    console.log('Using DeepSeek..');
    return await deepseekProvider.generate(topic);
  } catch (err) {
    console.error('DeepSeek failed:', err);
  }

  // 4️⃣ Again Fallback Option is → Bytez
  try {
    console.log('Using Bytez....');
    return await bytezProvider.generate(topic);
  } catch (error) {
    console.error('Bytez failed:', error);
  }
  
  // Final fallback
  try {
    console.log("Using OpenAI...");
    return await openaiProvider.generate(topic);
  } catch (err) {
    console.error("OpenAI failed:", err);
  }
  // 5️⃣ Final fallback
  return [
    `What is ${topic}?`,
    `Explain ${topic}.`,
  ];
};