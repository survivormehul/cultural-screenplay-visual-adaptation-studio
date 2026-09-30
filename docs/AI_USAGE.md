# AI Usage & Provider Architecture

This document explicitly details how intelligence and automation are modeled in the **Cultural Screenplay & Visual Adaptation Studio**, clearly distinguishing between **Deterministic Local Logic** and **Future AI Provider Integrations**.

---

## 1. Core Principle: Zero Mock Deception

In this prototype milestone:
- **No external AI APIs (OpenAI, Anthropic, Gemini, Midjourney, Stable Diffusion, FLUX) are invoked.**
- **No paid services, network endpoints, or API keys are required or configured.**
- **The system does NOT pretend mock outputs are live neural generation.**
- All workflow stages operate via **deterministic local providers** implementing formal provider interfaces.
- The product is 100% usable offline and in local development environments.

---

## 2. Where AI Would Be Useful in Production

In a full-scale enterprise production environment, generative AI and foundation models would provide immense value across five key areas:

### 1. Screenplay Understanding
- **Multimodal Document AI / Vision LLMs:** Ingesting complex Final Draft (`.fdx`), Fountain, or scanned PDF screenplays with irregular margins, dual-column dialogue, and non-standard sluglines.
- **Narrative Arc Extraction:** Inferring subtext, emotional tension curves, and thematic stakes that standard regex parsers cannot detect.

### 2. Cultural Adaptation
- **Deep Cultural Knowledge:** Mapping regional folklore, historical caste and community nuances, local legal frameworks, and agricultural calendars.
- **Contextual Equivalence:** Suggesting cultural equivalents for idioms rather than literal translations (e.g. recognizing that an urban bank foreclosure maps to ancestral *kudak* debt obligations).

### 3. Dialogue Adaptation
- **Linguistic Prosody & Cadence:** Generating natural spoken dialogue in low-resource Indic dialects (such as Marwari, Braj, Maithili, Awadhi) that preserves the speaker's age, social status, and emotional state.
- **Phonetic & Dialect Nuances:** Accounting for vocal inflections and regional colloquialisms that are difficult to encode purely in hand-written rule sets.

### 4. Visual Prompt Generation
- **Cinematic Vision Models:** Translating narrative scene descriptions into highly specific camera packages (lens focal length, anamorphic bokeh, lighting angles, color temperatures) optimized for diffusion models.
- **Style Coherence:** Ensuring that generated concept art reflects accurate period-specific architecture (e.g. Jodhpur yellow sandstone carved arches) and authentic attire.

### 5. Continuity Reasoning
- **Cross-Scene Semantic Auditing:** Tracking subtle narrative states (injuries, emotional baggage, costume changes between scenes separated by time jumps) across 120-page screenplays.
- **Multimodal Consistency:** Auditing visual frames to ensure character facial likeness and spatial geography remain identical from scene to scene.

---

## 3. What Is Deterministic in the Current Prototype

Every capability in the current studio milestone is implemented using **robust, deterministic local logic**:

1. **Screenplay Parsing:** State-machine parser in `src/lib/parser/screenplayParser.ts` using regular expressions to segment scene headings, character cues, dialogues, parentheticals, and action lines.
2. **Canonical Identifiers:** Deterministic generator assigning stable, zero-padded IDs (`SCN-001`, `CHR-001`, `LOC-001`, `PROP-001`, `ADP-001`, `VIS-001`, `CON-001`) guaranteeing multi-pass stability.
3. **Approval Filtering:** Pure boolean logic filtering in `ApprovalPanel.tsx` and `adaptScreenplay.ts` that strictly excludes unapproved or rejected suggestions from downstream generation.
4. **Continuity Verification:** Rule engine in `src/lib/continuity/continuityChecker.ts` running 10+ programmatic assertions covering entity presence, prop persistence, and chronological ordering.
5. **Production Exports:** Pure client-side formatting and file generation in `src/lib/export/exportService.ts` creating `.txt` and `.json` artifacts without external dependencies.
6. **Demo Adaptation Provider:** `DemoAdaptationProvider.ts` applying 14 curated Marwari transformation rules across all 8 cultural dimensions.
7. **Demo Visual Provider:** `DemoImageGenerationProvider.ts` generating structured 35mm prompt strings and cinematic parameters through template synthesis.

---

## 4. Why Provider Abstraction Exists

The studio architecture enforces strict separation of concerns through TypeScript interfaces:

```typescript
// src/lib/adaptation/types.ts
export interface TextAdaptationProvider {
  providerId: string;
  name: string;
  generatePlan(screenplay: Screenplay, profile: CulturalProfile): Promise<AdaptationPlan>;
  generateAdaptation(
    screenplay: Screenplay,
    plan: AdaptationPlan,
    decisions: Record<string, AdaptationDecision>
  ): Promise<AdaptedScreenplay>;
}

// src/lib/visuals/types.ts
export interface ImageGenerationProvider {
  providerId: string;
  name: string;
  generateScenePrompt(scene: AdaptedScene, originalScene?: Scene): Promise<SceneVisualPromptPackage>;
  generateCharacterPrompt(character: Character, scene: AdaptedScene): Promise<CharacterVisualPromptPackage>;
  generateAll(adaptedScreenplay: AdaptedScreenplay, originalScreenplay: Screenplay): Promise<VisualPackages>;
}
```

### Benefits of This Architecture:
- **Pluggability:** Teams can swap the local `DemoAdaptationProvider` for a cloud-hosted `GeminiAdaptationProvider` or `ClaudeAdaptationProvider` simply by passing a different instance into the orchestration controller.
- **Zero Frontend Disruption:** The Next.js UI, approval panels, diff viewers, and export services remain completely unchanged when switching between demo and neural backends.
- **Testability:** Unit tests run in milliseconds using the deterministic provider without making costly or flaky network calls.

---

## 5. Human-in-the-Loop Validation

Even when real AI models are introduced, **cultural adaptation cannot be completely automated**:
- Regional dialects and cultural customs have deep community sensitivities.
- AI models are susceptible to regional stereotyping or archaic caricature.
- The studio enforces a **Strict Human Approval Gate**:
  - AI suggestions are treated as *proposals*, not final text.
  - Showrunners and native-speaker dialectologists can approve, reject, or rewrite suggestions.
  - The pipeline pauses execution until all pending decisions are reviewed.
  - Production scripts reflect only verified human editorial decisions.
