"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSummary = void 0;
const llm_router_1 = require("../../../providers/llm.router");
const summary_prompt_1 = require("../prompts/summary.prompt");
const generateSummary = async (content) => {
    const prompt = (0, summary_prompt_1.summaryPrompt)(content);
    const result = await (0, llm_router_1.generateFromLLM)(prompt);
    return typeof result === "string"
        ? result
        : JSON.stringify(result);
};
exports.generateSummary = generateSummary;
