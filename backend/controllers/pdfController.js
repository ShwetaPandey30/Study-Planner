import fs from "fs";
import { extractPdfText } from "../services/pdfService.js";
import { generateResponse } from "../services/geminiService.js";
import { buildPrompt } from "../services/promptService.js";

/**
 * Upload PDF and extract text only
 */
export async function uploadPdf(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "No PDF uploaded.",
    });
  }

  try {
    const text = await extractPdfText(req.file.path);

    res.json({
      success: true,
      text,
    });

  } catch (error) {
    console.error("PDF Extraction Error:", error);

    res.status(500).json({
      success: false,
      error: error.message || "Failed to extract PDF.",
    });
  } finally {
    try {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (err) {
      console.error("Failed to delete temp upload file:", err);
    }
  }
}

/**
 * Generate AI output from extracted text
 */
export async function generateFromPdf(req, res) {
  try {
    const { text, type } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: "No study material found.",
      });
    }

    const prompt = buildPrompt(type, text);

    const result = await generateResponse([
      {
        sender: "user",
        text: prompt,
      },
    ], type);

    res.json({
      success: true,
      result,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to generate content.",
    });
  }
}