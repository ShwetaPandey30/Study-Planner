import fs from "fs";
import pdfParse from "pdf-parse";
import { GoogleGenAI } from "@google/genai";

export async function extractPdfText(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    if (!data.text || data.text.trim() === "") {
      throw new Error("No text content could be extracted by pdf-parse.");
    }
    return data.text;
  } catch (error) {
    console.warn("Local pdf-parse failed or returned empty text. Falling back to Gemini extraction...", error.message || error);
    
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      throw new Error(`Local PDF extraction failed: ${error.message}. Gemini fallback cannot run because GEMINI_API_KEY is not set.`);
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      // Upload file to Gemini Files API
      const uploadResult = await ai.files.upload({
        file: filePath,
        mimeType: "application/pdf",
      });

      // Generate content to extract text
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: "Extract and return all the text from this PDF document exactly as it is, without adding any commentary, summaries, introductory text, formatting explanations, or markdown styling." },
              {
                fileData: {
                  mimeType: uploadResult.mimeType,
                  fileUri: uploadResult.uri
                }
              }
            ]
          }
        ]
      });

      // Attempt to clean up the uploaded file from Gemini
      try {
        await ai.files.delete({ name: uploadResult.name });
      } catch (deleteError) {
        console.error("Warning: Failed to delete temporary file from Gemini:", deleteError.message || deleteError);
      }

      if (!response.text || response.text.trim() === "") {
        throw new Error("Gemini returned empty text.");
      }

      return response.text;
    } catch (geminiError) {
      console.error("Gemini fallback extraction also failed:", geminiError.message || geminiError);
      throw new Error(`Failed to extract PDF text. Local parser error: ${error.message}. Gemini fallback error: ${geminiError.message || geminiError}`);
    }
  }
}