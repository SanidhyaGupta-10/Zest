import { GoogleGenAI } from "@google/genai";
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY missing");
}
/**
 * @server\src\providers\gemini.provider.ts
 * @description Gemini AI initialization (Shared for generation and embedding)
 */
export const genAI = new GoogleGenAI({ apiKey });
/**
 * @server\src\providers\gemini.provider.ts
 * @description Gemini AI Provider (Reliable fallback)
 */
export const geminiProvider = {
    name: "Gemini",
    generate: async (fullPrompt) => {
        const result = await genAI.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ role: "user", parts: [{ text: fullPrompt }] }]
        });
        return result?.text || "";
    },
};
