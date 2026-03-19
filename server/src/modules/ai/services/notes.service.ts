import { generateFromLLM } from "../../../providers/llm.router";
import { notesPrompt } from "../prompts/notes.prompt";

export const generateNotes = async (topic: string) => {
  const prompt = notesPrompt(topic);

  const result = await generateFromLLM(prompt);

  return typeof result === "string" ? result : JSON.stringify(result);
};