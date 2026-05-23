import { generateFromLLM } from "../../../providers/llm.router.js";
import { notesPrompt } from "../prompts/notes.prompt.js";
export const generateNotes = async (topic) => {
    const prompt = notesPrompt(topic);
    const result = await generateFromLLM(prompt);
    return typeof result === "string" ? result : JSON.stringify(result);
};
