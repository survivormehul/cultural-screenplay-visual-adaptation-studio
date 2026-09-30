import { NextRequest, NextResponse } from "next/server";
import { isGeminiConfigured } from "@/lib/gemini/client";
import { GeminiImageGenerationProvider } from "@/lib/visuals/GeminiImageGenerationProvider";
import { DemoImageGenerationProvider } from "@/lib/visuals/DemoImageGenerationProvider";
import { AdaptedScreenplay, Screenplay } from "@/types/domain";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.adaptedScreenplay || !body.originalScreenplay) {
      return NextResponse.json(
        {
          error:
            "Invalid request payload. 'adaptedScreenplay' and 'originalScreenplay' are required.",
        },
        { status: 400 }
      );
    }

    const adaptedScreenplay = body.adaptedScreenplay as AdaptedScreenplay;
    const originalScreenplay = body.originalScreenplay as Screenplay;

    // APPROVAL GATE ENFORCEMENT AT API BOUNDARY
    if (!adaptedScreenplay.screenplayId || !Array.isArray(adaptedScreenplay.scenes) || adaptedScreenplay.scenes.length === 0) {
      return NextResponse.json(
        {
          error:
            "Approval requirements not satisfied: Visual generation requires an authentic adapted screenplay generated from approved cultural decisions.",
          code: "APPROVAL_GATE_REQUIRED",
        },
        { status: 400 }
      );
    }

    const generateImagesImmediately = Boolean(body.generateImagesImmediately);

    if (isGeminiConfigured()) {
      const provider = new GeminiImageGenerationProvider();
      const packages = await provider.generateAll(
        adaptedScreenplay,
        originalScreenplay,
        { generateImagesImmediately }
      );
      return NextResponse.json(packages);
    } else {
      // Deterministic prompt package engine fallback
      const demoProvider = new DemoImageGenerationProvider();
      const packages = await demoProvider.generateAll(
        adaptedScreenplay,
        originalScreenplay
      );
      return NextResponse.json({
        ...packages,
        isLiveAiGenerated: false,
      });
    }
  } catch (err: unknown) {
    console.error("Error in /api/visuals/packages:", err);
    const message =
      err instanceof Error ? err.message : "Failed to generate visual packages";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
