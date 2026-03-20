import OpenAI from "openai";

const key = process.env.DEEPSEEK_API_KEY!;

// Pointing to DeepSeek's endpoint
export const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: key,
});

export const deepseekProvider = {
  generate: async (fullPrompt: string) => {
    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat", // DeepSeek-V3
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: fullPrompt }
      ],
      // DeepSeek supports json_object too
      response_format: { type: "json_object" }, 
    });

    return response.choices[0]?.message?.content || "";
  },
};
