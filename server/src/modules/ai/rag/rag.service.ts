import { generateFromLLM } from "../../../providers/llm.router";
import { retrieveContext } from "./retrieval/retrieval.service";


export const generateRAGResponse = async ({
  userId,
  query,
}: {
  userId: string;
  query: string;
}) => {
  // 1. Retrieve relevant chunks
  const context = await retrieveContext({ userId, query });
  const contextText = context
    .map((c, i) => `Chunk ${i + 1}: ${c}`)
    .join("\n\n");

  const prompt = `
You are an expert AI assistant.

STRICT RULES:
- Answer ONLY from the context
- Do NOT add external knowledge
- If missing info → say "Not found in context"

STYLE:
- Be concise
- Use bullet points if needed
- Compare when asked

CONTEXT:
${contextText}

QUESTION:
${query}

ANSWER:
`;

  // 3. Call LLM
  const response = await generateFromLLM(prompt);

  return {
    answer: response,
    context, // optional (for debugging)
  };
};