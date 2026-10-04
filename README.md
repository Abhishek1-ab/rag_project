RAG Project
A simple RAG (Retrieval-Augmented Generation) app built with Node.js and React.
It reads a document, splits it into small chunks, turns the chunks into embeddings, and uses the best
matching chunks to answer your questions.
Tech Stack
* Frontend: React
* Backend: Node.js (Express)
Project Structure
* client/ - React frontend
* server/ - Node.js backend
- rag.js: splits text into chunks and handles the RAG logic
- embed.js: creates embeddings
- index.js: starts the server
- docs.txt: the document used as the knowledge source
Setup
1. Clone the repo:
git clone https://github.com/Abhishek1-ab/rag_project.git
cd rag_project
2. Set up the server:
cd server
npm install
3. Create a file named .env inside the server folder and add your API key:
API_KEY=My-key-here
4. Start the server (runs on http://localhost:5000):
node index.js
5. In a new terminal, set up and start the client:
cd client
npm install
npm run dev
