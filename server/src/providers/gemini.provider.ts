import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;

const genAI = new GoogleGenerativeAI(apiKey);

export const geminiProvider = {
  generateQuestions: async (topic: string) => {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
    You are a strict JSON generator.
    Generate exactly 5 study questions about: ${topic}.
    Rules:
    - Return ONLY valid JSON
    - Format: ["q1", "q2", "q3", "q4", "q5"]
    - No explanation, no markdown`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    try {
      return JSON.parse(response);
    } catch {
      return [response];
    }
  },
};