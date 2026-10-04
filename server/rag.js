import fs from 'fs';

export function chunkText(text, size = 300, overlap = 50) {
  const chunks = [];
  let start = 0;

  if (!text) return chunks;
  if (size <= overlap) {
    const trimmed = text.trim();
    return trimmed ? [trimmed] : [];
  }

  while (start < text.length) {
    const end = Math.min(start + size, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk) chunks.push(chunk);
    start += size - overlap;
  }

  return chunks;
}

export function loadChunks() {
  const text = fs.readFileSync(new URL('./docs.txt', import.meta.url), 'utf-8');
  return chunkText(text);
}