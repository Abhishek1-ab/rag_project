import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { buildStore, search } from "./embed.js";

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
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("rag server running");
});

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "question is required" });
    }

    const results = await search(question, 3);
    const context = results.join("\n\n");

    const prompt = `
You are a helpful assistant. Answer in Hindi when possible. If you do not know the answer, say "mujhe iske bare me jankari nahi hai".
Use the context below.

Context:
${context}

Question: ${question}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const answer =
      response?.text ||
      response?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("") ||
      "mujhe iske bare me jankari nahi hai";

    res.json({
      answer,
      sources: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

await buildStore();
app.listen(5000, () => {
  console.log("server running on http://localhost:5000");
});