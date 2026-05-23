import OpenAI from "openai";
const key = process.env.DEEPSEEK_API_KEY;
/**
 * @server\src\providers\deepseek.provider.ts
 * @description DeepSeek Provider (V3)
 */
export const deepseekProvider = {
    name: "DeepSeek",
    generate: async (fullPrompt) => {
        if (!key)
            throw new Error("DEEPSEEK_API_KEY missing");
        const deepseek = new OpenAI({
            baseURL: 'https://api.deepseek.com',
            apiKey: key,
        });
        const response = await deepseek.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: fullPrompt }
            ],
        });
        return response.choices[0]?.message?.content || "";
    },
};
