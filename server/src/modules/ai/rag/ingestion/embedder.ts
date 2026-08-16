import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey || apiKey.trim() === "") {
  throw new Error("GROQ_API_KEY must be set");
}

const groq = new Groq({ apiKey });

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const targetDimensions = 1536; // DB vector(1536) schema dimensions

  if (!text || text.trim().length === 0) return Array(targetDimensions).fill(0);

  try {
    const response = await groq.embeddings.create({
      model: "nomic-embed-text-v1.5",
      input: text,
    });

    const values = response.data[0]?.embedding;

    if (!values || !Array.isArray(values) || values.length === 0) {
      console.warn("No embedding values returned, returning zero vector");
      return Array(targetDimensions).fill(0);
    }

    // Validate embedding values
    const validEmbeddings = values.filter((val): val is number => typeof val === "number");
    if (validEmbeddings.length === 0) {
      console.warn("Invalid embedding values, returning zero vector");
      return Array(targetDimensions).fill(0);
    }

    // If embedding is 768 dimensions (from nomic-embed-text-v1.5), duplicate to 1536 to match DB schema
    if (validEmbeddings.length === 768) {
      return [...validEmbeddings, ...validEmbeddings];
    }

    // Pad or trim to targetDimensions (1536) if different
    if (validEmbeddings.length < targetDimensions) {
      const padding = Array(targetDimensions - validEmbeddings.length).fill(0);
      return [...validEmbeddings, ...padding];
    }

    return validEmbeddings.slice(0, targetDimensions);
  } catch (error) {
    console.error("Error generating embedding via Groq:", error);
    return Array(targetDimensions).fill(0);
  }
};

