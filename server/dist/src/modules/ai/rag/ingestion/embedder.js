"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbedding = void 0;
const gemini_provider_1 = require("../../../../providers/gemini.provider");
const generateEmbedding = async (text) => {
    const DIMENSIONS = 1536;
    if (!text || text.trim().length === 0)
        return Array(DIMENSIONS).fill(0);
    try {
        // Use the correct embedContent API for @google/genai
        const result = await gemini_provider_1.genAI.models.embedContent({
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
    }
    catch (error) {
        console.error("Error generating embedding:", error);
        return Array(DIMENSIONS).fill(0);
    }
};
exports.generateEmbedding = generateEmbedding;
