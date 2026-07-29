import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";

function InputBox() {
  const { sendMessage, loading } = useContext(ChatContext);

  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    sendMessage(message);

    setMessage("");
  };

  return (
    <div className="input-box">
      <input
        disabled={loading}
        type="text"
        placeholder="Ask anything..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
      />

      <button onClick={handleSend} disabled={loading}>
        {loading ? "Generating..." : "Send"}
      </button>
    </div>
  );
}

export default InputBox;