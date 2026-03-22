"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openaiProvider = exports.openai = void 0;
const openai_1 = __importDefault(require("openai"));
exports.openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
exports.openaiProvider = {
    generate: async (fullPrompt) => {
        const response = await exports.openai.chat.completions.create({
            model: "gpt-4o-mini", // Optimized for speed and cost
            messages: [{ role: "user", content: fullPrompt }],
            response_format: { type: "json_object" },
        });
        return response.choices[0]?.message?.content || "";
    },
};
