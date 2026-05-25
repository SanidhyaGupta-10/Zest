"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbedding = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const key = process.env.GROQ_API_KEY;
const groq = new groq_sdk_1.default({ apiKey: key });
const generateEmbedding = async (text) => {
    const DIMENSIONS = 768; // nomic-embed-text-v1.5 uses 768 dimensions
    if (!text || text.trim().length === 0)
        return Array(DIMENSIONS).fill(0);
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
        return values;
    }
    catch (error) {
        console.error("Error generating embedding via Groq:", error);
        return Array(DIMENSIONS).fill(0);
    }
};
exports.generateEmbedding = generateEmbedding;
