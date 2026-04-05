import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("🚀 Server file started...");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Check API key
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in .env file");
  process.exit(1);
}

// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

// ✅ Chat route
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest"
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const reply = response.text();

    res.json({ reply });
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});