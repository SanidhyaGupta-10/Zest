"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveContext = void 0;
const embedder_1 = require("../ingestion/embedder");
const vector_store_1 = require("../store/vector.store");
const retrieveContext = async ({ userId, query, limit = 5, }) => {
    // 1. Convert query → embedding
    const embedding = await (0, embedder_1.generateEmbedding)(query);
    // 2. Search similar chunks
    const results = await (0, vector_store_1.searchSimilar)({
        userId,
        embedding,
        limit,
    });
    // 3. Extract only content
    const context = results.map((r) => r.content);
    return context;
};
exports.retrieveContext = retrieveContext;
