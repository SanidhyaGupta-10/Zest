import { generateFromLLM } from "../../../providers/llm.router.js";
import { summaryPrompt } from "../prompts/summary.prompt.js";
export const generateSummary = async (content) => {
    const prompt = summaryPrompt(content);
    const result = await generateFromLLM(prompt);
    return typeof result === "string"
        ? result
        : JSON.stringify(result);
};
