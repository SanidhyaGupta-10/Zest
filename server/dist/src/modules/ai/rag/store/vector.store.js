"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSimilar = exports.storeEmbedding = void 0;
const db_1 = require("../../../../config/db");
// 🔥 Store embedding
// What it is doing?
// => It is storing the embedding in the database.
// => The embedding is a vector of numbers that represents the content.
// => The embedding is stored in the database as a vector.
// => The vector is stored in the database as a vector.
const storeEmbedding = async ({ userId, content, embedding, }) => {
    const vector = `[${embedding.join(",")}]`;
    await db_1.prisma.$executeRawUnsafe(`
    INSERT INTO "Document" (id, "userId", content, embedding, "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), $1, $2, $3::vector, NOW(), NOW())
    `, userId, content, vector);
};
exports.storeEmbedding = storeEmbedding;
// 🔥 Search similar
// 1 - (embedding <=> $1::vector)
// What is this doing?
// => It is calculating the cosine similarity between the two vectors.
// => The cosine similarity is a measure of the similarity between two vectors.
// => The cosine similarity is a value between -1 and 1.
// => The cosine similarity is 1 when the two vectors are identical.
// => The cosine similarity is -1 when the two vectors are opposite.
// => The cosine similarity is 0 when the two vectors are orthogonal.
const searchSimilar = async ({ userId, embedding, limit = 5, }) => {
    const vector = `[${embedding.join(",")}]`;
    const results = await db_1.prisma.$queryRawUnsafe(`
    SELECT id, content,
    1 - (embedding <=> $1::vector) AS similarity
    FROM "Document"
    WHERE "userId" = $2
    ORDER BY embedding <=> $1::vector
    LIMIT $3
    `, vector, userId, limit);
    return results;
};
exports.searchSimilar = searchSimilar;
