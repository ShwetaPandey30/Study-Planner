import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import plannerRoutes from "./routes/plannerRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api/chat", chatRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/planner", plannerRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "AI Study Assistant Backend Running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});