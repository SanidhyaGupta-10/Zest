import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined");
}

export const genAI = new GoogleGenerativeAI(apiKey);

export const geminiProvider = {
  generate: async (fullPrompt: string) => {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" // Best for low-latency tasks
    });

    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  },
};
