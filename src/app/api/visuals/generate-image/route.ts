import { NextRequest, NextResponse } from "next/server";
import { isGeminiConfigured, getGeminiImageModel } from "@/lib/gemini/client";
import { GeminiImageGenerationProvider } from "@/lib/visuals/GeminiImageGenerationProvider";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.prompt || typeof body.prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid request payload. 'prompt' string is required." },
        { status: 400 }
      );
    }

    const prompt = body.prompt.trim();
    const visualId = typeof body.visualId === "string" ? body.visualId : "VIS-CUSTOM";

    if (!isGeminiConfigured()) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is not configured on the server. Please add your GEMINI_API_KEY to .env.local to enable live image generation.",
          code: "MISSING_API_KEY",
        },
        { status: 503 }
      );
    }

    const provider = new GeminiImageGenerationProvider();
    const imageUrl = await provider.generateImageForPrompt(prompt);

    return NextResponse.json({
      visualId,
      imageUrl,
      generatedAt: new Date().toISOString(),
      model: getGeminiImageModel(),
      isLiveAiGenerated: true,
    });
  } catch (err: unknown) {
    console.error("Error in /api/visuals/generate-image:", err);
    const message =
      err instanceof Error ? err.message : "Image generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
