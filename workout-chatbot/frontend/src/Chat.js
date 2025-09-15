import { useState } from "react";
import axios from "axios";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages([...messages, userMsg]);
    setInput("");

    const BACKEND_URL =
      window.location.hostname.includes("github.dev")
      ? `https://${window.location.hostname.split("-3000")[0]}-8000.preview.app.github.dev`
      : "http://127.0.0.1:8000";

    const res = await axios.post(`${BACKEND_URL}/chat`, { message: input });
    const botMsg = { role: "bot", text: res.data.reply };
    setMessages((msgs) => [...msgs, botMsg]);
  }

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <b>{m.role === "user" ? "You" : "Bot"}:</b> {m.text}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
