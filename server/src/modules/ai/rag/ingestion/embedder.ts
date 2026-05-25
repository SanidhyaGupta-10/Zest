import { genAI } from "../../../../providers/not-working-providers/gemini.provider";

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const DIMENSIONS = 1536;

  if (!text || text.trim().length === 0) return Array(DIMENSIONS).fill(0);

  try {
    // Use the correct embedContent API for @google/genai
    const result = await genAI.models.embedContent({
      model: "text-embedding-004",
      contents: text, // Pass string directly, not array
      config: {
        outputDimensionality: DIMENSIONS,
      },
    });

    const values = result.embeddings?.[0]?.values;

    if (!values || values.length === 0) {
      console.warn("No embedding values returned, returning zero vector");
      return Array(DIMENSIONS).fill(0);
    }

    return values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return Array(DIMENSIONS).fill(0);
  }
};
