import Groq from "groq-sdk";
const key = process.env.GROQ_API_KEY;
/**
 * @server\src\providers\groq.provider.ts
 * @description Groq Provider (High speed Llama 3.3)
 */
export const groqProvider = {
    name: "Groq",
    generate: async (fullPrompt) => {
        if (!key)
            throw new Error("GROQ_API_KEY missing");
        const groq = new Groq({ apiKey: key });
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: fullPrompt }
            ],
        });
        return response.choices[0]?.message?.content || "";
    },
};
