import { genAI } from "../../../../providers/gemini.provider";

export const generateEmbedding = async (text: string): Promise<number[]> => {
  // Set to 1536 to match your requirement (standard for many vector DBs)
  const DIMENSIONS = 1536; 

  if (!text || text.trim().length === 0) return Array(DIMENSIONS).fill(0);

  try {
    const result = await genAI.models.embedContent({
      model: "gemini-embedding-001",
      contents: [{ parts: [{ text }] }],
      config: { 
        // This tells Gemini to truncate the 3072 vector to exactly 1536
        outputDimensionality: DIMENSIONS 
      },
    });

    const values = result.embeddings?.[0]?.values;
    
    if (!values) {
      throw new Error("No embedding values returned from Gemini API");
    }

    return values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    // Return a zero-vector of the correct size to prevent DB schema errors
    return Array(DIMENSIONS).fill(0);
  }
};
