import { buildStore, search } from "./embed.js";

await buildStore();
const result = await search("what is rag");
console.log("Search result:", result);