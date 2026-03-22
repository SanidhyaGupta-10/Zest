"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiProvider = exports.genAI = void 0;
const genai_1 = require("@google/genai");
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
}
exports.genAI = new genai_1.GoogleGenAI({ apiKey });
exports.geminiProvider = {
    generate: async (fullPrompt) => {
        const result = await exports.genAI.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ role: "user", parts: [{ text: fullPrompt }] }]
        });
        return result?.text;
    },
};
