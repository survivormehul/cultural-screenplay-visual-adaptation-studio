import "server-only";
import { GoogleGenAI } from "@google/genai";

/**
 * Server-only Gemini Client configuration & instantiation.
 * Protects GEMINI_API_KEY from accidental browser bundle exposure.
 */

export function getGeminiApiKey(): string | null {
  const key = process.env.GEMINI_API_KEY?.trim();
  return key && key.length > 0 ? key : null;
}

export function isGeminiConfigured(): boolean {
  return getGeminiApiKey() !== null;
}

export function getGeminiTextModel(): string {
  return process.env.GEMINI_TEXT_MODEL?.trim() || "gemini-2.5-flash";
}

export function getGeminiImageModel(): string {
  return process.env.GEMINI_IMAGE_MODEL?.trim() || "gemini-3.1-flash-image";
}

let cachedClient: GoogleGenAI | null = null;
let lastKeyUsed: string | null = null;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in server environment. Please set GEMINI_API_KEY in your .env.local file."
    );
  }

  if (!cachedClient || lastKeyUsed !== apiKey) {
    cachedClient = new GoogleGenAI({ apiKey });
    lastKeyUsed = apiKey;
  }

  return cachedClient;
}
