"use strict";
// What it is doing?
// => It is chunking the text into smaller chunks.
// => The chunks are of size 500 characters.
// => The overlap between chunks is 100 characters.
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkText = void 0;
const chunkText = (text, chunkSize = 300, overlap = 80) => {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        const end = start + chunkSize;
        chunks.push(text.slice(start, end));
        start += chunkSize - overlap;
    }
    return chunks;
};
exports.chunkText = chunkText;
