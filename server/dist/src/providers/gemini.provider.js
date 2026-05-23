import { GoogleGenAI } from "@google/genai";
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
}
export const genAI = new GoogleGenAI({ apiKey });
export const geminiProvider = {
    generate: async (fullPrompt) => {
        const result = await genAI.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ role: "user", parts: [{ text: fullPrompt }] }]
        });
        return result?.text;
    },
};
