"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groqProvider = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const key = process.env.GROQ_API_KEY;
const groq = new groq_sdk_1.default({ apiKey: key });
exports.groqProvider = {
    generate: async (fullPrompt) => {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Fixed: Uses current high-speed model
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: fullPrompt }
            ],
            // Use json_object only if your prompt explicitly asks for JSON
            // response_format: { type: "json_object" },
        });
        return response.choices[0]?.message?.content || "";
    },
};
