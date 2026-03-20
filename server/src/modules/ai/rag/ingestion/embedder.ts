export const generateEmbedding = async (text: string): Promise<number[]> => {
  if (!text) return Array(1536).fill(0);
  // deterministic fake embedding (important)
  const vector = Array.from({ length: 1536 }, (_, i) => {
    const charCode = text.charCodeAt(i % text.length) || 0;
    return (charCode % 100) / 100; // normalize
  });

  return vector;
};