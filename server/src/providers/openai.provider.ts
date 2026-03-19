import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const openaiProvider = {
  generate: async (fullPrompt: string) => {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Optimized for speed and cost
      messages: [{ role: "user", content: fullPrompt }],
      response_format: { type: "json_object" },
    });

    return response.choices[0]?.message?.content || "";
  },
};
