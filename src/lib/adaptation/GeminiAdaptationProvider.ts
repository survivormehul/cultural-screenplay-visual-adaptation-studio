import "server-only";

import {
  AdaptationCategory,
  AdaptationDecision,
  AdaptationPlan,
  AdaptationSuggestion,
  AdaptedDialogue,
  AdaptedScene,
  AdaptedScreenplay,
  Screenplay,
} from "@/types/domain";
import { CulturalProfile } from "@/types/adaptation";
import { TextAdaptationProvider } from "./types";
import { getGeminiClient, getGeminiTextModel } from "../gemini/client";
import { adaptScreenplay as deterministicAdaptScreenplay } from "./adaptScreenplay";

export class GeminiAdaptationProvider implements TextAdaptationProvider {
  public providerId = "gemini-cultural-adaptation-v1";
  public name = "Gemini Live Cultural Adaptation Engine (Rural Marwar / Jodhpur)";

  /**
   * Generates a structured cultural adaptation plan using Gemini LLM.
   */
  public async generatePlan(
    screenplay: Screenplay,
    profile: CulturalProfile
  ): Promise<AdaptationPlan> {
    const ai = getGeminiClient();
    const primaryModel = getGeminiTextModel();
    const candidateModels = [primaryModel, "gemini-3.5-flash", "gemini-3.8-flash", "gemini-flash-latest"].filter(
      (m, i, arr) => arr.indexOf(m) === i
    );

    // Construct detailed prompt with screenplay entities & cultural constraints
    const prompt = this.buildAdaptationPlanPrompt(screenplay, profile);

    let response = null;
    let lastErr: unknown = null;
    let successfulModel = primaryModel;

    for (const model of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.2, // Low temperature for high cultural precision and canonical stability
            responseMimeType: "application/json",
          },
        });
        successfulModel = model;
        break;
      } catch (err: unknown) {
        lastErr = err;
        console.warn(`Text model '${model}' attempt encountered an issue, trying next candidate...`);
      }
    }

    if (!response) {
      const message = lastErr instanceof Error ? lastErr.message : String(lastErr);
      throw new Error(`Gemini Cultural Adaptation Plan generation failed: ${message}`);
    }

    const responseText = response.text?.trim() || "";
    if (!responseText) {
      throw new Error("Empty response received from Gemini text model.");
    }

    const planData = this.parseAndValidatePlanJson(responseText, screenplay, profile);
    return {
      ...planData,
      provider: `${this.name} (${successfulModel})`,
    };
  }

  /**
   * Generates the final adapted screenplay using Gemini based strictly on approved decisions.
   */
  public async generateAdaptation(
    screenplay: Screenplay,
    plan: AdaptationPlan,
    decisions: Record<string, AdaptationDecision>
  ): Promise<AdaptedScreenplay> {
    // 1. Strict approval gate check at provider level
    const hasPending = plan.suggestions.some(
      (s) => (decisions[s.id]?.status || s.status) === "pending"
    );
    if (hasPending) {
      throw new Error(
        "Approval Gate Incomplete: Cannot generate adapted screenplay while cultural suggestions remain in 'pending' status."
      );
    }

    // Filter approved and edited suggestions
    const approvedSuggestions = plan.suggestions.filter((s) => {
      const st = decisions[s.id]?.status || s.status;
      return st === "approved" || st === "edited";
    });

    const ai = getGeminiClient();
    const primaryModel = getGeminiTextModel();
    const candidateModels = [primaryModel, "gemini-3.5-flash", "gemini-3.8-flash", "gemini-flash-latest"].filter(
      (m, i, arr) => arr.indexOf(m) === i
    );

    const prompt = this.buildAdaptedScreenplayPrompt(
      screenplay,
      plan,
      decisions,
      approvedSuggestions
    );

    let response = null;
    let successfulModel = primaryModel;

    try {
      for (const model of candidateModels) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          });
          successfulModel = model;
          break;
        } catch {
          console.warn(`Model ${model} failed for adapted screenplay, attempting candidate fallback...`);
        }
      }

    if (!response) {
      throw new Error("All candidate text models failed to generate adapted screenplay.");
    }

    const responseText = response.text?.trim() || "";
    if (!responseText) {
      throw new Error("Empty response received from Gemini for adapted screenplay.");
    }

    const adapted = this.parseAndValidateScreenplayJson(
      responseText,
      screenplay,
      approvedSuggestions
    );
    return {
      ...adapted,
      provider: `${this.name} (${successfulModel})`,
    };
    } catch (err: unknown) {
      console.warn(
        "Gemini LLM screenplay generation encountered an issue. Falling back to deterministic script synthesizer:",
        err
      );
      // Fallback to deterministic synthesis so user workflow is never blocked
      const fallback = deterministicAdaptScreenplay(screenplay, plan, decisions);
      return {
        ...fallback,
        provider: `${this.name} [Deterministic Fallback: ${err instanceof Error ? err.message : "Error"}]`,
        isLiveAiGenerated: false,
      };
    }
  }

  // --- PROMPT BUILDERS ---

  private buildAdaptationPlanPrompt(
    screenplay: Screenplay,
    profile: CulturalProfile
  ): string {
    const canonicalEntities = {
      characters: screenplay.characters.map((c) => ({
        id: c.id,
        name: c.name,
        dialogueCount: c.dialogueCount,
      })),
      scenes: screenplay.scenes.map((s) => ({
        id: s.id,
        sceneNumber: s.sceneNumber,
        heading: s.heading,
        timeOfDay: s.timeOfDay,
        characters: s.characterIds,
        dialogues: s.dialogue.map((d) => ({
          id: d.id,
          character: d.characterName,
          text: d.text,
        })),
        actions: s.actions.map((a) => a.text),
      })),
      locations: screenplay.locations.map((l) => ({ id: l.id, name: l.name })),
      props: screenplay.props.map((p) => ({ id: p.id, name: p.name })),
      costumes: screenplay.costumes.map((c) => ({
        id: c.id,
        character: c.characterName,
        desc: c.description,
      })),
    };

    return `You are a distinguished cultural dramaturg and dialect specialist for Indian cinema, specializing in ${profile.targetCulture} (${profile.targetDialect}, ${profile.region}).

TASK:
Culturally adapt the given screenplay into authentic ${profile.targetCulture} (${profile.targetDialect}) set in ${profile.region}, writing dialogue and cultural terms in authentic ${profile.script} script alongside Romanized pronunciation.

CULTURAL PROFILE & REGIONAL GROUNDING:
- Target Culture: ${profile.targetCulture}
- Target Dialect: ${profile.targetDialect}
- Script: ${profile.script}
- Region: ${profile.region}
- Setting / Period: ${profile.periodAndSetting}
- Dialect Markers: ${profile.dialectMarkers.join(", ")}
- Architectural Context: ${profile.architecturalContext.join(", ")}
- Attire Context: ${profile.attireContext.join(", ")}
- Socio-Cultural Notes: ${profile.socioCulturalNotes}

STRICT DRAMATIC CONSTRAINTS:
1. Preserve central dramatic purpose, emotional beats, conflict stakes, and character relationships.
2. DO NOT change the core story or remove scenes.
3. Every suggestion MUST correspond to an authentic regional transformation.
4. Suggestions MUST cover the canonical dimensions:
   - "Dialogue/Register"
   - "Greeting/Address"
   - "Environment"
   - "Costume"
   - "Props"
   - "Food"
   - "Social context"
   - "Local terminology"

CANONICAL SCREENPLAY INPUT:
${JSON.stringify(canonicalEntities, null, 2)}

OUTPUT SCHEMA:
Return a JSON object with this exact structure:
{
  "suggestions": [
    {
      "id": "ADP-001",
      "sceneId": "SCN-001",
      "category": "Greeting/Address",
      "original": "Father",
      "proposed": "बाबोसा (Babosa / Revered Father)",
      "devanagariProposed": "बाबोसा",
      "rationale": "In rural Marwar, elder patriarchs are reverently addressed as Babosa.",
      "confidence": 0.98,
      "status": "pending"
    }
  ]
}

Provide between 8 and 18 comprehensive, high-fidelity cultural adaptation suggestions spanning dialogue, greetings, costumes, environment, props, and social context. Ensure each suggestion has sequential IDs starting from "ADP-001".`;
  }

  private buildAdaptedScreenplayPrompt(
    screenplay: Screenplay,
    plan: AdaptationPlan,
    decisions: Record<string, AdaptationDecision>,
    approvedSuggestions: AdaptationSuggestion[]
  ): string {
    const decisionsSummary = approvedSuggestions.map((s) => {
      const decision = decisions[s.id];
      const effectiveText =
        decision?.status === "edited" && decision.editedValue
          ? decision.editedValue
          : s.userEditedText || s.proposed;
      const effectiveDevanagari =
        decision?.status === "edited" && decision.editedValue
          ? decision.editedValue
          : s.devanagariProposed || s.proposed;
      return {
        id: s.id,
        sceneId: s.sceneId,
        category: s.category,
        original: s.original,
        effectiveText,
        effectiveDevanagari,
        rationale: s.rationale,
      };
    });

    return `You are an acclaimed screenplay adaptation director and Marwari dialogue writer.

TASK:
Produce the final culturally adapted screenplay in Marwari (${plan.script}) set in ${plan.region}.

APPROVED HUMAN CULTURAL DECISIONS (Apply ONLY these approved adaptations; do not apply rejected items):
${JSON.stringify(decisionsSummary, null, 2)}

ORIGINAL SCREENPLAY STRUCTURE:
${JSON.stringify(
  screenplay.scenes.map((s) => ({
    id: s.id,
    sceneNumber: s.sceneNumber,
    heading: s.heading,
    timeOfDay: s.timeOfDay,
    locationName: s.locationName,
    characterIds: s.characterIds,
    actions: s.actions.map((a) => a.text),
    dialogues: s.dialogue.map((d) => ({
      id: d.id,
      characterId: d.characterId,
      characterName: d.characterName,
      parenthetical: d.parenthetical || "",
      text: d.text,
    })),
  })),
  null,
  2
)}

REQUIREMENTS:
1. Preserve exact scene IDs (e.g. "SCN-001"), scene numbers, and dialogue IDs (e.g. "DIA-001").
2. For each dialogue, provide:
   - "dialogueId": string
   - "characterId": string
   - "characterName": string
   - "parenthetical": string (optional)
   - "originalText": string (exact original English text)
   - "adaptedText": string (romanized Marwari / bilingual register)
   - "devanagariText": string (authentic Marwari in Devanagari script)
   - "appliedSuggestionIds": array of ADP-xxx IDs applied
3. For each scene:
   - "sceneId": string
   - "sceneNumber": number
   - "originalHeading": string
   - "adaptedHeading": string (e.g. EXT. THAR HAVELI PARAPET & STEPWELL - DUSK)
   - "locationName": string
   - "timeOfDay": string
   - "characterIds": string[]
   - "actions": string[] (adapted action lines reflecting local environment)
   - "dialogues": [...]
   - "appliedAdaptations": array of ADP-xxx IDs applied in this scene
4. Provide a 2-sentence summary of the adaptation in "summary".

Return a valid JSON object matching this schema:
{
  "scenes": [ ... ],
  "summary": "..."
}`;
  }

  // --- VALIDATORS & PARSERS ---

  private parseAndValidatePlanJson(
    rawJson: string,
    screenplay: Screenplay,
    profile: CulturalProfile
  ): AdaptationPlan {
    // Strip markdown code fences if model wrapped in ```json
    const cleaned = rawJson
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    const rawSuggestions = Array.isArray(parsed.suggestions)
      ? parsed.suggestions
      : Array.isArray(parsed)
      ? parsed
      : [];

    if (rawSuggestions.length === 0) {
      throw new Error("Gemini returned zero adaptation suggestions in response.");
    }

    const validCategories: AdaptationCategory[] = [
      "Dialogue/Register",
      "Greeting/Address",
      "Environment",
      "Costume",
      "Props",
      "Food",
      "Social context",
      "Local terminology",
    ];

    const fallbackSceneId = screenplay.scenes[0]?.id || "SCN-001";

    const suggestions: AdaptationSuggestion[] = rawSuggestions.map(
      (item: Record<string, unknown>, index: number) => {
        const num = index + 1;
        const id = `ADP-${String(num).padStart(3, "0")}`;

        const rawCategory = String(item.category || "").trim();
        const category = (validCategories.find(
          (c) => c.toLowerCase() === rawCategory.toLowerCase()
        ) || "Dialogue/Register") as AdaptationCategory;

        const sceneId =
          typeof item.sceneId === "string" && item.sceneId.startsWith("SCN-")
            ? item.sceneId
            : fallbackSceneId;

        return {
          id,
          sceneId,
          entityId: typeof item.entityId === "string" ? item.entityId : undefined,
          category,
          original: String(item.original || "").trim() || "Dialogue segment",
          proposed: String(item.proposed || "").trim() || "Regional phrasing",
          devanagariProposed: item.devanagariProposed
            ? String(item.devanagariProposed).trim()
            : undefined,
          rationale:
            String(item.rationale || "").trim() ||
            "Contextual cultural grounding in rural Marwar.",
          confidence:
            typeof item.confidence === "number" && item.confidence >= 0 && item.confidence <= 1
              ? item.confidence
              : 0.95,
          status: "pending" as const,
        };
      }
    );

    return {
      planId: `PLAN-${Date.now().toString(36).toUpperCase()}`,
      cultureProfileId: "marwari-rural-jodhpur",
      targetCulture: profile.targetCulture,
      targetDialect: profile.targetDialect,
      script: profile.script,
      region: profile.region,
      suggestions,
      totalSuggestions: suggestions.length,
      generatedAt: new Date().toISOString(),
      provider: `${this.name} (${getGeminiTextModel()})`,
      isLiveAiGenerated: true,
    };
  }

  private parseAndValidateScreenplayJson(
    rawJson: string,
    screenplay: Screenplay,
    approvedSuggestions: AdaptationSuggestion[]
  ): AdaptedScreenplay {
    const cleaned = rawJson
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    const rawScenes = Array.isArray(parsed.scenes) ? parsed.scenes : [];

    if (rawScenes.length === 0) {
      throw new Error("Gemini returned zero scenes in adapted screenplay.");
    }

    const adaptedScenes: AdaptedScene[] = screenplay.scenes.map((origScene, idx) => {
      const generatedScene = rawScenes.find(
        (s: Record<string, unknown>) =>
          s.sceneId === origScene.id || s.sceneNumber === origScene.sceneNumber
      ) || rawScenes[idx];

      const adaptedDialogues: AdaptedDialogue[] = origScene.dialogue.map((origDia, dIdx) => {
        const genDiaList = Array.isArray(generatedScene?.dialogues)
          ? generatedScene.dialogues
          : [];
        const genDia =
          genDiaList.find(
            (d: Record<string, unknown>) =>
              d.dialogueId === origDia.id ||
              (d.characterName === origDia.characterName && d.originalText === origDia.text)
          ) || genDiaList[dIdx];

        return {
          dialogueId: origDia.id,
          characterId: origDia.characterId,
          characterName: origDia.characterName,
          parenthetical: genDia?.parenthetical || origDia.parenthetical || "",
          originalText: origDia.text,
          adaptedText:
            genDia?.adaptedText && String(genDia.adaptedText).trim()
              ? String(genDia.adaptedText).trim()
              : origDia.text,
          devanagariText:
            genDia?.devanagariText && String(genDia.devanagariText).trim()
              ? String(genDia.devanagariText).trim()
              : origDia.text,
          appliedSuggestionIds: Array.isArray(genDia?.appliedSuggestionIds)
            ? genDia.appliedSuggestionIds
            : [],
        };
      });

      const appliedAdaptations: string[] = Array.isArray(generatedScene?.appliedAdaptations)
        ? generatedScene.appliedAdaptations
        : approvedSuggestions.filter((s) => s.sceneId === origScene.id).map((s) => s.id);

      return {
        sceneId: origScene.id,
        sceneNumber: origScene.sceneNumber,
        originalHeading: origScene.heading,
        adaptedHeading:
          generatedScene?.adaptedHeading && String(generatedScene.adaptedHeading).trim()
            ? String(generatedScene.adaptedHeading).trim()
            : origScene.heading,
        locationName: origScene.locationName,
        timeOfDay: origScene.timeOfDay,
        characterIds: origScene.characterIds,
        actions:
          Array.isArray(generatedScene?.actions) && generatedScene.actions.length > 0
            ? generatedScene.actions.map(String)
            : origScene.actions.map((a) => a.text),
        dialogues: adaptedDialogues,
        appliedAdaptations,
      };
    });

    const totalApproved = approvedSuggestions.length;
    const summary =
      typeof parsed.summary === "string" && parsed.summary.trim()
        ? parsed.summary.trim()
        : `Cultural screenplay adapted for rural Marwar (Jodhpur) with ${totalApproved} approved cultural modifications in Devanagari script.`;

    return {
      screenplayId: `ADAPTED-${Date.now().toString(36).toUpperCase()}`,
      scenes: adaptedScenes,
      generatedAt: new Date().toISOString(),
      provider: `${this.name} (${getGeminiTextModel()})`,
      totalScenes: adaptedScenes.length,
      totalApprovedAdaptations: totalApproved,
      summary,
      isLiveAiGenerated: true,
    };
  }
}
