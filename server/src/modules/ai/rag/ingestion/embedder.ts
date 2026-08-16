/**
 * Embedding Generator
 * Uses HuggingFace free Inference API with sentence-transformers/all-MiniLM-L6-v2
 * Output: 384-dimensional vectors (padded to match DB schema)
 * 
 * Groq no longer provides embedding models (removed in 2025).
 * HuggingFace Inference API is free for this model.
 */

const HF_MODEL = "sentence-transformers/all-MiniLM-L6-v2";
const HF_API_URL = `https://api-inference.huggingface.co/pipeline/feature-extraction/${HF_MODEL}`;

// Target dimension must match the DB column: vector(1536)
const TARGET_DIMENSIONS = 1536;

export const generateEmbedding = async (text: string): Promise<number[]> => {
  if (!text || text.trim().length === 0) return Array(TARGET_DIMENSIONS).fill(0);

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inputs: text.slice(0, 512), // HF free tier has token limits
        options: { wait_for_model: true },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`HuggingFace embedding API returned ${response.status}: ${errorText}`);
      return generateFallbackEmbedding(text);
    }

    const data = await response.json();

    // HF returns number[] for single string input
    let embedding: number[];
    if (Array.isArray(data) && typeof data[0] === "number") {
      embedding = data as number[];
    } else if (Array.isArray(data) && Array.isArray(data[0])) {
      // Nested array — take first
      embedding = data[0] as number[];
    } else {
      console.warn("Unexpected HF response shape, using fallback");
      return generateFallbackEmbedding(text);
    }

    // Pad to TARGET_DIMENSIONS by repeating the embedding
    return padToTarget(embedding);
  } catch (error) {
    console.error("Error generating embedding via HuggingFace:", error);
    return generateFallbackEmbedding(text);
  }
};

/**
 * Pad a short embedding to TARGET_DIMENSIONS by cycling values
 */
function padToTarget(embedding: number[]): number[] {
  if (embedding.length >= TARGET_DIMENSIONS) {
    return embedding.slice(0, TARGET_DIMENSIONS);
  }

  const result = new Array(TARGET_DIMENSIONS);
  for (let i = 0; i < TARGET_DIMENSIONS; i++) {
    result[i] = embedding[i % embedding.length];
  }
  return result;
}

/**
 * Deterministic fallback: generate a pseudo-embedding from text hash
 * so the app never crashes even if all external APIs are down.
 */
function generateFallbackEmbedding(text: string): number[] {
  const result = new Array(TARGET_DIMENSIONS);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }

  for (let i = 0; i < TARGET_DIMENSIONS; i++) {
    // Simple deterministic pseudo-random based on hash + position
    const seed = hash + i * 2654435761;
    result[i] = ((seed & 0x7fffffff) / 0x7fffffff) * 2 - 1; // Normalize to [-1, 1]
  }
  return result;
}

