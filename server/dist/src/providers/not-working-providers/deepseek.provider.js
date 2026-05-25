"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepseekProvider = exports.deepseek = void 0;
const openai_1 = __importDefault(require("openai"));
const key = process.env.DEEPSEEK_API_KEY;
// Pointing to DeepSeek's endpoint
exports.deepseek = new openai_1.default({
    baseURL: 'https://api.deepseek.com',
    apiKey: key,
});
exports.deepseekProvider = {
    generate: async (fullPrompt) => {
        const response = await exports.deepseek.chat.completions.create({
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
