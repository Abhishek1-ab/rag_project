import { useState } from "react";
import "./App.css";

export default function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    const q = question.trim();
    if (!q || loading) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "bot", text: data.answer || data.error || "Kuch galat hua" },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "bot", text: "Server se connect nahi hua" }]);
    }
    setLoading(false);
  }

  return (
    <div className="chat">
      <h2>RAG Chat</h2>
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={"msg " + m.role}>
            {m.text}
          </div>
        ))}
        {loading && <div className="msg bot">Soch raha hoon...</div>}
      </div>
      <div className="inputRow">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Apna sawal likho..."
        />
        <button onClick={send}>Bhejo</button>
      </div>
    </div>
  );
}