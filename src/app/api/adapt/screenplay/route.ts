import { NextRequest, NextResponse } from "next/server";
import { isGeminiConfigured } from "@/lib/gemini/client";
import { GeminiAdaptationProvider } from "@/lib/adaptation/GeminiAdaptationProvider";
import { AdaptationDecision, AdaptationPlan, Screenplay } from "@/types/domain";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.screenplay || !body.plan || !body.decisions) {
      return NextResponse.json(
        {
          error:
            "Invalid request payload. 'screenplay', 'plan', and 'decisions' are required.",
        },
        { status: 400 }
      );
    }

    const screenplay = body.screenplay as Screenplay;
    const plan = body.plan as AdaptationPlan;
    const decisions = body.decisions as Record<string, AdaptationDecision>;

    // APPROVAL GATE ENFORCEMENT AT API BOUNDARY
    const pendingItems = plan.suggestions.filter(
      (s) => (decisions[s.id]?.status || s.status) === "pending"
    );

    if (pendingItems.length > 0) {
      return NextResponse.json(
        {
          error: `Approval Gate Incomplete: ${pendingItems.length} cultural adaptation decision(s) remain pending. All items must be reviewed before generating the adapted screenplay.`,
          code: "APPROVAL_GATE_LOCKED",
          pendingCount: pendingItems.length,
          pendingIds: pendingItems.map((p) => p.id),
        },
        { status: 400 }
      );
    }

    if (!isGeminiConfigured()) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY in your .env.local file to use live Gemini screenplay adaptation.",
          code: "MISSING_API_KEY",
        },
        { status: 503 }
      );
    }

    const provider = new GeminiAdaptationProvider();
    const adaptedScreenplay = await provider.generateAdaptation(
      screenplay,
      plan,
      decisions
    );

    return NextResponse.json(adaptedScreenplay);
  } catch (err: unknown) {
    console.error("Error in /api/adapt/screenplay:", err);
    const message =
      err instanceof Error ? err.message : "Failed to generate adapted screenplay";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
