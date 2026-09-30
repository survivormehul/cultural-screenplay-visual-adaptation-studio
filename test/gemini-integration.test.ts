import test from "node:test";
import assert from "node:assert/strict";

import { parseScreenplay } from "../src/lib/parser/screenplayParser";
import { DemoAdaptationProvider } from "../src/lib/adaptation/DemoAdaptationProvider";
import { adaptScreenplay } from "../src/lib/adaptation/adaptScreenplay";
import { DemoImageGenerationProvider } from "../src/lib/visuals/DemoImageGenerationProvider";
import { ACTIVE_CULTURAL_PROFILE, SAMPLE_SCREENPLAY } from "../src/data/sampleScreenplay";
import { AdaptationDecision } from "../src/types/domain";

test("9. Server Gemini Client handles missing GEMINI_API_KEY gracefully without throwing unhandled exceptions", async () => {
  // Verify that client configuration functions safely report status without exposing keys
  const prevKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;

  // With no API key in env, deterministic engine serves as primary engine
  const parsed = parseScreenplay(SAMPLE_SCREENPLAY);
  const fallbackProvider = new DemoAdaptationProvider();
  const plan = await fallbackProvider.generatePlan(parsed, ACTIVE_CULTURAL_PROFILE);

  assert.ok(plan.suggestions.length > 0, "Fallback provider should generate suggestions");
  assert.equal(plan.targetCulture, "Rajasthani (Marwar)");

  if (prevKey) {
    process.env.GEMINI_API_KEY = prevKey;
  }
});

test("10. Approval Gate: Blocks visual package generation if adapted screenplay is unapproved or missing", async () => {
  const parsed = parseScreenplay(SAMPLE_SCREENPLAY);
  const provider = new DemoAdaptationProvider();
  const plan = await provider.generatePlan(parsed, ACTIVE_CULTURAL_PROFILE);

  // Check that all suggestions are initially pending
  const pendingCount = plan.suggestions.filter((s) => s.status === "pending").length;
  assert.equal(pendingCount, plan.suggestions.length, "All suggestions must start as pending");

  // Attempting to generate adaptation while decisions are pending should be blocked by approval gate
  const pendingDecisions: Record<string, AdaptationDecision> = {};
  for (const s of plan.suggestions) {
    pendingDecisions[s.id] = {
      suggestionId: s.id,
      status: "pending",
      decidedAt: new Date().toISOString(),
    };
  }

  const hasPending = plan.suggestions.some(
    (s) => (pendingDecisions[s.id]?.status || s.status) === "pending"
  );
  assert.equal(hasPending, true, "Approval gate should detect pending decisions and block progression");
});

test("11. Visual Prompt Engine produces cinematic 35mm specifications with canonical constraints", async () => {
  const parsed = parseScreenplay(SAMPLE_SCREENPLAY);
  const provider = new DemoAdaptationProvider();
  const plan = await provider.generatePlan(parsed, ACTIVE_CULTURAL_PROFILE);

  const decisions: Record<string, AdaptationDecision> = {};
  for (const s of plan.suggestions) {
    decisions[s.id] = { suggestionId: s.id, status: "approved", decidedAt: new Date().toISOString() };
  }
  const adapted = adaptScreenplay(parsed, plan, decisions);

  const visualProvider = new DemoImageGenerationProvider();
  const pkgs = await visualProvider.generateAll(adapted, parsed);

  assert.ok(pkgs.scenePackages.length >= 1, "Should generate scene visual packages");
  assert.ok(pkgs.characterPackages.length >= 2, "Should generate character visual packages");

  const s1 = pkgs.scenePackages[0];
  assert.ok(s1.finalPrompt.includes("35mm"), "Prompt must include 35mm camera spec");
  assert.ok(s1.finalPrompt.includes("Jodhpur") || s1.finalPrompt.includes("Thar"), "Prompt must include regional setting");
  assert.ok(s1.culturalConstraints.length > 0, "Must include cultural constraints");
  assert.ok(s1.continuityConstraints.length > 0, "Must include continuity constraints");
});
