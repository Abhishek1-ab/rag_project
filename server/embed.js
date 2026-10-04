import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { loadChunks } from "./rag.js";

dotenv.config();

const apiKey =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.gemiai_api_key ||
  process.env.Gemiai_api_key;

if (!apiKey) {
  throw new Error("Missing Gemini API key in environment");
}

const ai = new GoogleGenAI({ apiKey });
const embedModel = "gemini-embedding-001";

export async function embedText(text) {
  const response = await ai.models.embedContent({
    model: embedModel,
    contents: [text],
  });

  return response.embeddings[0].values;
}

function cosine(a, b) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

let store = [];

export async function buildStore() {
  const chunks = loadChunks();
  store = [];

  for (const chunk of chunks) {
    const embedding = await embedText(chunk);
    store.push({ chunk, embedding });
  }
}

export async function search(query, topK = 3) {
  const queryEmbedding = await embedText(query);
  const similarities = store.map((item) => ({
    ...item,
    similarity: cosine(queryEmbedding, item.embedding),
  }));

  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
    .map((item) => item.chunk);
}