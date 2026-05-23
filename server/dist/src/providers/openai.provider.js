import OpenAI from "openai";
const key = process.env.OPENAI_API_KEY;
/**
 * @server\src\providers\openai.provider.ts
 * @description OpenAI Provider (Last resort fallback)
 */
export const openaiProvider = {
    name: "OpenAI",
    generate: async (fullPrompt) => {
        if (!key)
            throw new Error("OPENAI_API_KEY missing");
        const openai = new OpenAI({ apiKey: key });
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: fullPrompt }],
            // response_format: { type: "json_object" }, // Only if needed
        });
        return response.choices[0]?.message?.content || "";
    },
};
