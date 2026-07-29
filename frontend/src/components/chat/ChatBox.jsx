import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../../context/ChatContext";
import "../../styles/chat.css";

import Message from "./Message";
import InputBox from "./InputBox";

function ChatBox() {
  const { messages, sendMessage,loading } = useContext(ChatContext);

  // Ref for the last message
  const messagesEndRef = useRef(null);

  // Auto-scroll whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.length === 1 && (
          <div className="welcome-screen">
            <h2>Welcome to AI Study Assistant 👋</h2>
            <p>Ask me anything about your studies.</p>
          </div>
        )}

        {messages.map((msg) => (
          <Message
            key={msg.id}
            sender={msg.sender}
            text={msg.text}
            time={msg.time}
          />
        ))}
        {loading && (
    <Message
        sender="ai"
        text="🤖 AI is thinking..."
        time=""
    />
)}

        <div ref={messagesEndRef}></div>
      </div>

      <InputBox onSend={sendMessage} />
    </div>
  );
}

export default ChatBox;
