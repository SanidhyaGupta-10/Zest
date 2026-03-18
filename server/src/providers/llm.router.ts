import { geminiProvider } from "./gemini.provider";
import { groqProvider } from "./groq.provider";
import { openaiProvider } from "./openai.provider";

export const generateQuestionsWithFallback = async (topic: string) => {
  // 1️⃣ will GROQ 
  // if it fails then it go to OpenAI
  try {
    console.log("Using Groq...");
    return await groqProvider.generateQuestions(topic);
  } catch (err) {
    console.error("Groq failed:", err);
  }

  // 2️⃣ Fallback Option is → OpenAI
  try {
    console.log("Using OpenAI...");
    return await openaiProvider.generateQuestions(topic);
  } catch (err) {
    console.error("OpenAI failed:", err);
  }

  // 3️⃣ Again Fallback Option is → Gemini
  try {
    console.log("Using Gemini...");
    return await geminiProvider.generateQuestions(topic);
  } catch (err) {
    console.error("Gemini failed:", err);
  }

  // 3️⃣ Final fallback
  return [
    `What is ${topic}?`,
    `Explain ${topic}.`,
  ];
};