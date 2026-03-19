import { generateFromLLM } from "../../../providers/llm.router";
import { summaryPrompt } from "../prompts/summary.prompt";

export const generateSummary = async (content: string) => {
  const prompt = summaryPrompt(content);

  const result = await generateFromLLM(prompt);

  return typeof result === "string"
    ? result
    : JSON.stringify(result);
};