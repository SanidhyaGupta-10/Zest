"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuestionsWithFallback = exports.generateFromLLM = exports.generateWithFallback = void 0;
const bytez_provider_1 = require("./bytez.provider");
const deepseek_provider_1 = require("./deepseek.provider");
const gemini_provider_1 = require("./gemini.provider");
const groq_provider_1 = require("./groq.provider");
const openai_provider_1 = require("./openai.provider");
// Multi-provider fallback ensures responses are under 2-3 seconds by prioritizing fast models (Groq)
const generateWithFallback = async (fullPrompt) => {
    // 1️⃣ HIGH SPEED: Groq (Llama 3.3 70B)
    try {
        console.log("Using Groq (Llama 3.3)...");
        return await groq_provider_1.groqProvider.generate(fullPrompt);
    }
    catch (err) {
        console.error("Groq failed:", err);
    }
    // 2️⃣ RELIABLE: Gemini
    try {
        console.log("Using Gemini...");
        return await gemini_provider_1.geminiProvider.generate(fullPrompt);
    }
    catch (err) {
        console.error("Gemini failed:", err);
    }
    // 3️⃣ ALTERNATIVE: DeepSeek
    try {
        console.log('Using DeepSeek...');
        return await deepseek_provider_1.deepseekProvider.generate(fullPrompt);
    }
    catch (err) {
        console.error('DeepSeek failed:', err);
    }
    // 4️⃣ ALTERNATIVE: Bytez
    try {
        console.log('Using Bytez...');
        return await bytez_provider_1.bytezProvider.generate(fullPrompt);
    }
    catch (error) {
        console.error('Bytez failed:', error);
    }
    // 5️⃣ LAST RESORT: OpenAI (Costly/Slower fallback)
    try {
        console.log("Using OpenAI...");
        return await openai_provider_1.openaiProvider.generate(fullPrompt);
    }
    catch (err) {
        console.error("OpenAI failed:", err);
    }
    // Final static fallback - never return empty
    console.warn("All LLM providers failed. Using static fallback.");
    return "I'm sorry, I'm currently unable to process this request due to technical difficulties. Please try a simpler query or try again in a few minutes.";
};
exports.generateWithFallback = generateWithFallback;
// Aliases for compatibility with different modules
exports.generateFromLLM = exports.generateWithFallback;
exports.generateQuestionsWithFallback = exports.generateWithFallback;
