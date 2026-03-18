import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
});

export const openaiProvider = {
  generateQuestions: async (topic: string) => {
  const prompt = `Generate 5 study questions about ${topic}. Return JSON array.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.choices[0]?.message?.content || "[]";

  try {
    return JSON.parse(content);
  } catch {
    return [content];
  }
 }
};