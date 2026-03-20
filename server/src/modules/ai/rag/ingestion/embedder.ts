import { genAI } from "../../../../providers/gemini.provider";

const model = genAI.getGenerativeModel({ model: "text-embedding-004" }); // or gemini-embedding-001

export const generateEmbedding = async (text: string): Promise<number[]> => {
  if (!text) return Array(1536).fill(0);

  const result = await model.embedContent(text);
  return result.embedding.values; // Returns the actual semantic vector
};
