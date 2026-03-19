import { generateFromLLM } from "../../../providers/llm.router";
import { questionPrompt } from "../prompts/question.prompt";

export const generateQuestions = async (topic: string) => {
  const prompt = questionPrompt(topic);

  const result = await generateFromLLM(prompt);

  try {
    return JSON.parse(result);
  } catch {
    return [result]; // fallback safety
  }
};