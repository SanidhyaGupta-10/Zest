"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuestionsWithFallback = exports.generateFromLLM = exports.generateWithFallback = void 0;
const groq_provider_1 = require("./groq.provider");
// Multi-provider fallback ensures responses are under 2-3 seconds by prioritizing fast models (Groq)
const generateWithFallback = async (fullPrompt) => {
    // 1️⃣ HIGH SPEED: Groq (Llama 3.3 70B)
    try {
        return await groq_provider_1.groqProvider.generate(fullPrompt);
    }
    catch (err) {
        throw new Error("Groq provider failed");
    }
};
exports.generateWithFallback = generateWithFallback;
// Aliases for compatibility with different modules
exports.generateFromLLM = exports.generateWithFallback;
exports.generateQuestionsWithFallback = exports.generateWithFallback;
