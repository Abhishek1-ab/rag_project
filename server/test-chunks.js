import { loadChunks } from "./rag.js";

const chunks = loadChunks();
console.log("Total chunks:", chunks.length);
console.log(chunks);