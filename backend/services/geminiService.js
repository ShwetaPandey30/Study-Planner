import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const quizSchema = {
  type: "OBJECT",
  properties: {
    questions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          question: { type: "STRING" },
          options: {
            type: "ARRAY",
            items: { type: "STRING" }
          },
          correctOption: { type: "INTEGER" },
          explanation: { type: "STRING" }
        },
        required: ["question", "options", "correctOption", "explanation"]
      }
    }
  },
  required: ["questions"]
};

const flashcardSchema = {
  type: "OBJECT",
  properties: {
    flashcards: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          front: { type: "STRING" },
          back: { type: "STRING" }
        },
        required: ["front", "back"]
      }
    }
  },
  required: ["flashcards"]
};

export async function generateResponse(messages, type = null) {
  try {
    const systemPrompt = `
You are an AI Study Assistant.

Your role:
- Help students understand concepts clearly.
- Always answer using Markdown.
- Use headings (#, ##, ###).
- Use bullet points whenever appropriate.
- Use numbered steps for procedures.
- If code is required, always return properly formatted fenced code blocks with the language specified.
- Explain every code example.
- Start with an easy explanation, then provide technical details.
- If comparing concepts, use tables.
- Keep answers clean, structured, and easy to read.
`;

    // Convert chat history into a conversation
    const conversation = messages
      .map((msg) => {
        const role = msg.sender === "user" ? "User" : "Assistant";
        return `${role}: ${msg.text}`;
      })
      .join("\n\n");

    const finalPrompt = `
${systemPrompt}

Conversation:

${conversation}

Continue the conversation naturally.
`;

    const apiOptions = {
      model: "gemini-3.5-flash",
      contents: finalPrompt,
    };

    if (type === "quiz") {
      apiOptions.config = {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      };
    } else if (type === "flashcards") {
      apiOptions.config = {
        responseMimeType: "application/json",
        responseSchema: flashcardSchema,
      };
    }

    const response = await ai.models.generateContent(apiOptions);

    return response.text;
  } catch (error) {
    console.error(error);
    if (type === "quiz" || type === "flashcards") {
      throw error;
    }
    return "Sorry, I couldn't generate a response.";
  }
}