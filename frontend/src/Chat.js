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

    const BACKEND_URL = window.location.hostname.includes("github.dev")
      ? "https://solid-space-winner-97q67vj5pr7xcxgxv-8000.app.github.dev"
      : "http://127.0.0.1:8000";

    try {
      const res = await axios.post(
        `${BACKEND_URL}/chat`,
        { message: input },
        { timeout: 60000 }
      );

      // Clean and format bot reply
      let cleanedText = res.data.reply
        .replace(/\*/g, "")        // remove asterisks
        .replace(/#+/g, "\n")      // replace # headers with newlines
        .replace(/\n\s*\n/g, "\n"); // remove extra blank lines

      const botMsg = { role: "bot", text: cleanedText.trim() };
      setMessages((msgs) => [...msgs, botMsg]);
    } catch (error) {
      console.error("Error calling backend:", error);
      const botMsg = {
        role: "bot",
        text: "Sorry, I couldn't reach the backend. Please try again."
      };
      setMessages((msgs) => [...msgs, botMsg]);
    }
  }

  return (
    <div
      className="chat-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px"
      }}
    >
      <div className="messages" style={{ width: "100%", maxWidth: "600px" }}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`msg ${m.role}`}
            style={{
              textAlign: "left",
              marginBottom: "15px",
              backgroundColor: "#fff", // simple white background
              padding: "10px 15px",
              borderRadius: "10px",
              border: "1px solid #ddd"
            }}
          >
            <b>{m.role === "user" ? "You" : "Bot"}:</b>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                margin: "5px 0",
                textAlign: "left",
                fontFamily: "inherit"
              }}
            >
              {m.text}
            </pre>
          </div>
        ))}
      </div>
      <div
        className="input-box"
        style={{ marginTop: "20px", display: "flex", gap: "10px", width: "100%", maxWidth: "600px" }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 15px",
            borderRadius: "8px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
