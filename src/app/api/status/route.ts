import { NextResponse } from "next/server";
import {
  isGeminiConfigured,
  getGeminiTextModel,
  getGeminiImageModel,
} from "@/lib/gemini/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const configured = isGeminiConfigured();
    return NextResponse.json({
      configured,
      provider: configured ? "Gemini Live AI" : "Deterministic Fallback",
      textModel: getGeminiTextModel(),
      imageModel: getGeminiImageModel(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal status check failure";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
