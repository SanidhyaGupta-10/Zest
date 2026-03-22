"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingestDocument = void 0;
const vector_store_1 = require("../store/vector.store");
const chunker_1 = require("./chunker");
const embedder_1 = require("./embedder");
// What it is doing?
// => It is ingesting the document into the database.
// => It is chunking the document into smaller chunks.
// => It is generating embeddings for each chunk.
// => It is storing the embeddings in the database.
const ingestDocument = async ({ userId, content, }) => {
    // 1. chunk
    const chunks = (0, chunker_1.chunkText)(content);
    console.log("Chunks:", chunks.length);
    // 2. process each chunk
    for (const chunk of chunks) {
        const embedding = await (0, embedder_1.generateEmbedding)(chunk);
        await (0, vector_store_1.storeEmbedding)({
            userId,
            content: chunk,
            embedding,
        });
    }
    return { success: true, chunks: chunks.length };
};
exports.ingestDocument = ingestDocument;
