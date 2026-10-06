import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (name.trim() && message.trim()) {
      socket.emit("send_message", {
        name: name,
        message: message,
      });

      setMessage("");
    }
  };

  return (
    <div>
      <h1>Real-Time Chat App</h1>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Enter message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>

      <h2>Messages</h2>

      {messages.map((msg, index) => (
        <p key={index}>
          <b>{msg.name}:</b> {msg.message}
        </p>
      ))}
    </div>
  );
}

export default App;