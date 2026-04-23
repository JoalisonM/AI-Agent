import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export const gemini = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEN_AI_API_KEY,
});
