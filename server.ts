import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize Gemini client to prevent startup crashes if key is omitted
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not configured or uses a placeholder. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST route to generate custom quiz questions dynamically via Gemini
app.post("/api/quiz/generate", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      res.status(400).json({ error: "A valid topic is required to generate a quiz." });
      return;
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are an expert academic educator and trivia host.
Your goal is to generate an engaging, highly accurate multiple choice quiz containing exactly 5 questions on the user's requested topic: "${topic}".
Each question must contain exactly 4 unique choices. Only one choice can be the correct one.
Ensure you provide a thorough, helpful "explanation" parameter explaining why the correct choice is true, and why other options are incorrect.
Write in clear, friendly, and accurate language. Do not output markdown wrappers inside your key values.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate a 5-question multiple choice quiz about: ${topic}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "A short, engaging title for this custom quiz, e.g., 'Volcanology Masterclass'.",
            },
            description: {
              type: Type.STRING,
              description: "A friendly, one-sentence description summarizing this custom quiz content.",
            },
            questions: {
              type: Type.ARRAY,
              description: "An array of exactly 5 multiple choice questions.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Unique string id, e.g., 'custom-q-1'." },
                  question: { type: Type.STRING, description: "The quiz question text." },
                  options: {
                    type: Type.ARRAY,
                    description: "Exactly 4 options to choose from.",
                    items: { type: Type.STRING },
                  },
                  correctIndex: {
                    type: Type.INTEGER,
                    description: "The 0-based index of the correct answer within the options array (0 to 3).",
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "An educational explanation of why the correct answer is correct and details explaining the science/history behind it.",
                  },
                },
                required: ["id", "question", "options", "correctIndex", "explanation"],
              },
            },
          },
          required: ["name", "description", "questions"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Received an empty response from the AI model.");
    }

    const quizData = JSON.parse(text);
    res.json({ success: true, quiz: quizData });
  } catch (error: any) {
    console.error("AI Quiz generation failure:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An unexpected error occurred during quiz generation.",
    });
  }
});

// Configure Vite or Static Files Middleware
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express full-stack server running on http://localhost:${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error("Server initialization error:", err);
});
