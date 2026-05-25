import Groq from "groq-sdk";

const key = process.env.GROQ_API_KEY!;
const groq = new Groq({ apiKey: key });

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const DIMENSIONS = 768; // nomic-embed-text-v1.5 uses 768 dimensions

  if (!text || text.trim().length === 0) return Array(DIMENSIONS).fill(0);

  try {
    const response = await groq.embeddings.create({
      model: "nomic-embed-text-v1.5",
      input: text,
    });

    const values = response.data[0]?.embedding;

    if (!values || !Array.isArray(values)) {
      console.warn("No embedding values returned, returning zero vector");
      return Array(DIMENSIONS).fill(0);
    }

    return values as number[];
  } catch (error) {
    console.error("Error generating embedding via Groq:", error);
    return Array(DIMENSIONS).fill(0);
  }
};
