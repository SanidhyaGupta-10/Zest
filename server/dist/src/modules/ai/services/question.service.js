import { generateFromLLM } from "../../../providers/llm.router.js";
import { questionPrompt } from "../prompts/question.prompt.js";
export const generateQuestions = async (topic) => {
    const prompt = questionPrompt(topic);
    const result = await generateFromLLM(prompt);
    try {
        return JSON.parse(result);
    }
    catch {
        return [result]; // fallback safety
    }
};
