import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey || apiKey.trim() === "") {
  throw new Error("GROQ_API_KEY must be set");
}

const groq = new Groq({ apiKey });

export const generateEmbedding = async (text: string): Promise<number[]> => {
  let defaultDimensions = 768; // nomic-embed-text-v1.5 default dimensions

  if (!text || text.trim().length === 0) return Array(defaultDimensions).fill(0);

  try {
    const response = await groq.embeddings.create({
      model: "nomic-embed-text-v1.5",
      input: text,
    });

    const values = response.data[0]?.embedding;

    if (!values || !Array.isArray(values) || values.length === 0) {
      console.warn("No embedding values returned, returning zero vector");
      return Array(defaultDimensions).fill(0);
    }

    // Dynamically derive and validate embedding values
    const validEmbeddings = values.filter((val): val is number => typeof val === "number");
    if (validEmbeddings.length !== values.length) {
      console.warn("Invalid non-number values in embedding, returning zero vector");
      return Array(defaultDimensions).fill(0);
    }

    return validEmbeddings;
  } catch (error) {
    console.error("Error generating embedding via Groq:", error);
    return Array(defaultDimensions).fill(0);
  }
};
