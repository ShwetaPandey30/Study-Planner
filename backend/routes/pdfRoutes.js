import express from "express";
import upload from "../middleware/uploadMiddleware.js";

import {
  uploadPdf,
  generateFromPdf,
} from "../controllers/pdfController.js";

const router = express.Router();

// Upload PDF
router.post(
  "/upload",
  upload.single("pdf"),
  uploadPdf
);

// Generate AI content
router.post(
  "/generate",
  generateFromPdf
);

export default router;