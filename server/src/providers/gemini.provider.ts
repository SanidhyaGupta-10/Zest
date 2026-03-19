import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiProvider = {
  generate: async (fullPrompt: string) => {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" // Best for low-latency tasks
    });

    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  },
};
