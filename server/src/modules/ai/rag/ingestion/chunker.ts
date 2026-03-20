// What it is doing?
// => It is chunking the text into smaller chunks.
// => The chunks are of size 500 characters.
// => The overlap between chunks is 100 characters.

export const chunkText = (
  text: string,
  chunkSize = 300,
  overlap = 80
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