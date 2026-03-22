"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuestions = void 0;
const llm_router_1 = require("../../../providers/llm.router");
const question_prompt_1 = require("../prompts/question.prompt");
const generateQuestions = async (topic) => {
    const prompt = (0, question_prompt_1.questionPrompt)(topic);
    const result = await (0, llm_router_1.generateFromLLM)(prompt);
    try {
        return JSON.parse(result);
    }
    catch {
        return [result]; // fallback safety
    }
};
exports.generateQuestions = generateQuestions;
