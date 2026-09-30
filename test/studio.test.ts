import test from "node:test";
import assert from "node:assert/strict";

import { parseScreenplay } from "../src/lib/parser/screenplayParser";
import { DemoAdaptationProvider } from "../src/lib/adaptation/DemoAdaptationProvider";
import { adaptScreenplay } from "../src/lib/adaptation/adaptScreenplay";
import { runContinuityChecks } from "../src/lib/continuity/continuityChecker";
import { DemoImageGenerationProvider } from "../src/lib/visuals/DemoImageGenerationProvider";
import { formatAdaptedScreenplayAsTxt, formatContinuityReportAsTxt } from "../src/lib/export/exportService";
import { ACTIVE_CULTURAL_PROFILE, SAMPLE_SCREENPLAY } from "../src/data/sampleScreenplay";
import { AdaptationDecision, Screenplay } from "../src/types/domain";

test("1. Parser extracts scenes, characters, and dialogue correctly", () => {
  const parsed = parseScreenplay(SAMPLE_SCREENPLAY, "Sample Test Screenplay");

  assert.ok(parsed.scenes.length >= 1, "Should detect at least 1 scene");
  const firstScene = parsed.scenes[0];
  assert.equal(firstScene.id, "SCN-001");
  assert.equal(firstScene.interiorExterior, "EXT.");
  assert.equal(firstScene.timeOfDay, "DUSK");
  assert.ok(firstScene.dialogue.length >= 4, "Should extract dialogues");

  const characters = parsed.characters;
  assert.ok(characters.some((c) => c.name.includes("VIKRAM")), "VIKRAM should be detected");
  assert.ok(characters.some((c) => c.name.includes("BHAWANI")), "BHAWANI should be detected");
});

test("2. Canonical IDs remain stable across multiple parse passes", () => {
  const pass1 = parseScreenplay(SAMPLE_SCREENPLAY, "Pass 1");
  const pass2 = parseScreenplay(SAMPLE_SCREENPLAY, "Pass 2");

  assert.equal(pass1.scenes[0].id, "SCN-001");
  assert.equal(pass2.scenes[0].id, "SCN-001");

  assert.equal(pass1.characters[0].id, pass2.characters[0].id);
  assert.equal(pass1.locations[0].id, pass2.locations[0].id);
});

test("3. Adaptation plan generation produces categorized suggestions with canonical IDs", async () => {
  const parsed = parseScreenplay(SAMPLE_SCREENPLAY);
  const provider = new DemoAdaptationProvider();
  const plan = await provider.generatePlan(parsed, ACTIVE_CULTURAL_PROFILE);

  assert.ok(plan.suggestions.length >= 8, "Should have at least 8 suggestions");
  assert.equal(plan.targetCulture, "Rajasthani (Marwar)");
  assert.equal(plan.script, "Devanagari (देवनागरी)");

  // Check categories represented
  const categories = new Set(plan.suggestions.map((s) => s.category));
  assert.ok(categories.has("Greeting/Address"));
  assert.ok(categories.has("Dialogue/Register"));
  assert.ok(categories.has("Environment"));
  assert.ok(categories.has("Costume"));

  // Verify canonical IDs
  for (const s of plan.suggestions) {
    assert.match(s.id, /^ADP-\d{3}$/);
    assert.match(s.sceneId, /^SCN-\d{3}$/);
  }
});

test("4. Rejected suggestions are not applied in adapted screenplay", async () => {
  const parsed = parseScreenplay(SAMPLE_SCREENPLAY);
  const provider = new DemoAdaptationProvider();
  const plan = await provider.generatePlan(parsed, ACTIVE_CULTURAL_PROFILE);

  // Reject ADP-001 (Father -> Babosa)
  const decisions: Record<string, AdaptationDecision> = {
    "ADP-001": { suggestionId: "ADP-001", status: "rejected", decidedAt: new Date().toISOString() },
  };

  const adapted = adaptScreenplay(parsed, plan, decisions);
  const diaWithFather = adapted.scenes[0].dialogues.find((d) => d.originalText.includes("Father"));

  assert.ok(diaWithFather, "Dialogue containing 'Father' should exist");
  assert.ok(diaWithFather.adaptedText.includes("Father"), "Rejected change must NOT be applied to adapted text");
  assert.ok(!diaWithFather.devanagariText.includes("बाबोसा"), "Rejected Devanagari replacement must NOT appear");
});

test("5. Approved suggestions are applied in adapted screenplay with Devanagari output", async () => {
  const parsed = parseScreenplay(SAMPLE_SCREENPLAY);
  const provider = new DemoAdaptationProvider();
  const plan = await provider.generatePlan(parsed, ACTIVE_CULTURAL_PROFILE);

  // Approve ADP-001 (Father -> Babosa) and ADP-008 (sacred well oath)
  const decisions: Record<string, AdaptationDecision> = {
    "ADP-001": { suggestionId: "ADP-001", status: "approved", decidedAt: new Date().toISOString() },
    "ADP-008": { suggestionId: "ADP-008", status: "approved", decidedAt: new Date().toISOString() },
  };

  const adapted = adaptScreenplay(parsed, plan, decisions);

  // Check ADP-001
  const dia1 = adapted.scenes[0].dialogues.find((d) => d.originalText.includes("Father"));
  assert.ok(dia1, "Dialogue should exist");
  assert.ok(dia1.devanagariText.includes("बाबोसा"), "Approved Devanagari term must appear in output");

  // Check ADP-008
  const dia2 = adapted.scenes[0].dialogues.find((d) => d.originalText.includes("dried well is still a temple"));
  assert.ok(dia2, "Dialogue 2 should exist");
  assert.ok(dia2.devanagariText.includes("धोरों री धरती"), "Approved Marwari dune metaphor must appear");
});

test("6. Adapted screenplay preserves scene ordering and canonical IDs", async () => {
  const parsed = parseScreenplay(SAMPLE_SCREENPLAY);
  const provider = new DemoAdaptationProvider();
  const plan = await provider.generatePlan(parsed, ACTIVE_CULTURAL_PROFILE);

  const decisions: Record<string, AdaptationDecision> = {};
  for (const s of plan.suggestions) {
    decisions[s.id] = { suggestionId: s.id, status: "approved", decidedAt: new Date().toISOString() };
  }

  const adapted = adaptScreenplay(parsed, plan, decisions);

  assert.equal(adapted.scenes.length, parsed.scenes.length);
  for (let i = 0; i < parsed.scenes.length; i++) {
    assert.equal(adapted.scenes[i].sceneId, parsed.scenes[i].id);
    assert.equal(adapted.scenes[i].sceneNumber, parsed.scenes[i].sceneNumber);
  }
});

test("7. Continuity checker detects a deliberate inconsistency", async () => {
  const parsed = parseScreenplay(SAMPLE_SCREENPLAY);
  const provider = new DemoAdaptationProvider();
  const plan = await provider.generatePlan(parsed, ACTIVE_CULTURAL_PROFILE);

  // Normal run
  const cleanDecisions: Record<string, AdaptationDecision> = {
    "ADP-001": { suggestionId: "ADP-001", status: "approved", decidedAt: new Date().toISOString() },
  };
  const adapted = adaptScreenplay(parsed, plan, cleanDecisions);

  const cleanReport = runContinuityChecks(parsed, adapted, plan, cleanDecisions);
  assert.equal(cleanReport.errors, 0, "Clean run should have 0 errors");

  // Deliberate inconsistency: create a broken adapted screenplay where character is removed and scene ordering is corrupt
  const brokenScreenplay: Screenplay = {
    ...parsed,
    characters: [
      ...parsed.characters,
      { id: "CHR-999", name: "GHOST_CHARACTER", description: "Missing in adaptation", dialogueCount: 1, sceneIds: ["SCN-001"] },
    ],
  };

  const brokenReport = runContinuityChecks(brokenScreenplay, adapted, plan, cleanDecisions);
  assert.ok(brokenReport.errors >= 1, "Should flag ERROR for missing character CHR-999");
  const missingCharCheck = brokenReport.checks.find((c) => c.sceneOrEntityId === "CHR-999");
  assert.ok(missingCharCheck, "Should have a check for CHR-999");
  assert.equal(missingCharCheck.severity, "ERROR");
});

test("8. Export payload contains all required sections and formatting", async () => {
  const parsed = parseScreenplay(SAMPLE_SCREENPLAY);
  const provider = new DemoAdaptationProvider();
  const plan = await provider.generatePlan(parsed, ACTIVE_CULTURAL_PROFILE);
  const decisions: Record<string, AdaptationDecision> = {
    "ADP-001": { suggestionId: "ADP-001", status: "approved", decidedAt: new Date().toISOString() },
  };
  const adapted = adaptScreenplay(parsed, plan, decisions);

  const visualProvider = new DemoImageGenerationProvider();
  const visualPkgs = await visualProvider.generateAll(adapted, parsed);

  const continuityReport = runContinuityChecks(parsed, adapted, plan, decisions, visualPkgs);

  // 1. Text screenplay format
  const scriptText = formatAdaptedScreenplayAsTxt(adapted);
  assert.ok(scriptText.includes("ADAPTED SCREENPLAY"), "Must contain header");
  assert.ok(scriptText.includes("बाबोसा"), "Must contain Devanagari text");

  // 2. Continuity report text
  const reportText = formatContinuityReportAsTxt(continuityReport);
  assert.ok(reportText.includes("CONTINUITY & ACCURACY AUDIT REPORT"));
  assert.ok(reportText.includes("UNRESOLVED / REQUIRES HUMAN REVIEW"));

  // 3. Full project JSON payload validation
  const fullPayload = {
    projectTitle: "Cultural Adaptation Studio Export",
    screenplay: parsed,
    structure: parsed,
    cultureProfile: ACTIVE_CULTURAL_PROFILE,
    adaptationPlan: plan,
    decisions,
    adaptedScreenplay: adapted,
    visualPromptPackages: visualPkgs,
    continuityReport,
  };

  const jsonString = JSON.stringify(fullPayload);
  const parsedBack = JSON.parse(jsonString);

  assert.ok(parsedBack.screenplay, "Must have screenplay");
  assert.ok(parsedBack.structure, "Must have structure");
  assert.ok(parsedBack.cultureProfile, "Must have cultureProfile");
  assert.ok(parsedBack.adaptationPlan, "Must have adaptationPlan");
  assert.ok(parsedBack.decisions, "Must have decisions");
  assert.ok(parsedBack.adaptedScreenplay, "Must have adaptedScreenplay");
  assert.ok(parsedBack.visualPromptPackages, "Must have visualPromptPackages");
  assert.ok(parsedBack.continuityReport, "Must have continuityReport");
});
