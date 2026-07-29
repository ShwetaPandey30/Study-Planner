import api from "./api";

export async function sendChatMessage(messages, signal) {
  const response = await api.post("/api/chat", {
    messages,
  }, { signal });

  return response.data.reply;
}