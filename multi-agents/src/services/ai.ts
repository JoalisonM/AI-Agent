import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

export const ai = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_GEN_AI_API_KEY,
});
