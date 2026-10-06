import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
      setTyping(false);
    });

    socket.on("user_typing", () => {
      setTyping(true);

      setTimeout(() => {
        setTyping(false);
      }, 1000);
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
    };
  }, []);

  const joinChat = () => {
    if (name.trim()) {
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", {
        name,
        message,
        time: new Date().toLocaleTimeString(),
      });

      setMessage("");
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing");
  };

  if (!joined) {
    return (
      <div className="login">
        <h1> Real-Time Chat</h1>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={joinChat}>Join Chat</button>
      </div>
    );
  }

  return (
    <div className="chat">
      <div className="header">
        <h2>Chat App</h2>
        <span> {name}</span>
      </div>

      <div className="messages">
        {messages.map((msg, index) => (
          <div className="message" key={index}>
            <b>{msg.name}</b>
            <p>{msg.message}</p>
            <small>{msg.time}</small>
          </div>
        ))}

        {typing && <p>Someone is typing...</p>}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={handleTyping}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;