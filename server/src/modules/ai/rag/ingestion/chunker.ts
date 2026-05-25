// What it is doing?
// => It is chunking the text into smaller chunks.
// => The chunks are of size 2000 characters by default (DEFAULT_CHUNK_SIZE = 2000).
// => The overlap between chunks is 200 characters by default (DEFAULT_CHUNK_OVERLAP = 200).

export const chunkText = (
  text: string,
  chunkSize = 2000,
  overlap = 200
): string[] => {
  const chunks: string[] = [];

  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;

    chunks.push(text.slice(start, end));

    start += chunkSize - overlap;
  }

  return chunks;
};