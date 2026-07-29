import { generateResponse } from "../services/geminiService.js";

export async function chat(req, res) {
  try {
    const { messages } = req.body;

const reply = await generateResponse(messages);

    res.json({
      reply,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}