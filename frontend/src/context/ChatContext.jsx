import { createContext, useState, useEffect, useRef } from "react";
import { sendChatMessage } from "../services/chatService";

export const ChatContext = createContext();

function ChatProvider({ children }) {
  // Initial welcome message
  const initialMessage = {
    id: 1,
    sender: "ai",
    text: "Hello 👋 I'm your AI Study Assistant.",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  // Load messages from localStorage
  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = localStorage.getItem("chatMessages");
      return savedMessages ? JSON.parse(savedMessages) : [initialMessage];
    } catch (error) {
      console.error("Failed to parse saved messages:", error);
      return [initialMessage];
    }
  });

  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  // Save chat to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Send message
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Abort active request if user sends another one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      // Send full conversation to backend
      const reply = await sendChatMessage([
        ...messages,
        userMessage,
      ], controller.signal);

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: reply,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      if (error.name === "CanceledError" || error.name === "AbortError") {
        return; // Ignore cancelled requests
      }
      console.error(error);

      const errorMessage = {
        id: Date.now() + 2,
        sender: "ai",
        text: "⚠️ Sorry, something went wrong. Please try again.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  };

  // Clear chat
  const clearChat = () => {
    setMessages([initialMessage]);
    localStorage.removeItem("chatMessages");
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        loading,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export default ChatProvider;