import { NextRequest, NextResponse } from "next/server";
import { isGeminiConfigured } from "@/lib/gemini/client";
import { GeminiAdaptationProvider } from "@/lib/adaptation/GeminiAdaptationProvider";
import { CulturalProfile } from "@/types/adaptation";
import { Screenplay } from "@/types/domain";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.screenplay || !body.profile) {
      return NextResponse.json(
        { error: "Invalid request payload. 'screenplay' and 'profile' objects are required." },
        { status: 400 }
      );
    }

    const screenplay = body.screenplay as Screenplay;
    const profile = body.profile as CulturalProfile;

    if (!Array.isArray(screenplay.scenes) || screenplay.scenes.length === 0) {
      return NextResponse.json(
        { error: "Screenplay contains no structured scenes. Please parse screenplay first." },
        { status: 400 }
      );
    }

    if (!isGeminiConfigured()) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY in your .env.local file to use live Gemini adaptation, or switch to Deterministic Demo Mode.",
          code: "MISSING_API_KEY",
        },
        { status: 503 }
      );
    }

    const provider = new GeminiAdaptationProvider();
    const plan = await provider.generatePlan(screenplay, profile);

    return NextResponse.json(plan);
  } catch (err: unknown) {
    console.error("Error in /api/adapt/plan:", err);
    const message = err instanceof Error ? err.message : "Failed to generate adaptation plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
