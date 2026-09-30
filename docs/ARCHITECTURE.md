# Cultural Screenplay & Visual Adaptation Studio — System Architecture

This document details the multi-tier system architecture, network boundaries, canonical data models, pipeline state machine, and provider abstraction layers of the **Cultural Screenplay & Visual Adaptation Studio**.

---

## 1. System Architecture & Network Boundaries

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          BROWSER CLIENT TIER                           │
│                                                                        │
│  Next.js 16 UI (React 19 / TypeScript / Tailwind CSS v4)               │
│  ├── 8-Stage Interactive Workflow Controller                           │
│  ├── In-Memory Project State Management                                │
│  ├── Side-by-Side Dual English / Devanagari Viewport                   │
│  ├── Human Approval Governance Panel                                   │
│  └── Visual Concept Board & Image Gallery                              │
│                                                                        │
│  * ZERO client-side API keys · ZERO client-side model imports *        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP JSON Requests (Secure Boundary)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     SERVER-SIDE API ROUTE TIER                         │
│                                                                        │
│  Next.js App Router Route Handlers                                     │
│  ├── GET  /api/status               (Reports AI config & model names)  │
│  ├── POST /api/adapt/plan           (Cultural Plan Generation)         │
│  ├── POST /api/adapt/screenplay     (Approval-gated Script Synthesis)  │
│  ├── POST /api/visuals/packages     (Canonical 35mm Prompt Packages)   │
│  └── POST /api/visuals/generate-image (Single & Batch Gemini Images)   │
│                                                                        │
│  Enforcements:                                                         │
│  • Request Schema Validation                                           │
│  • Server-Side Approval Gate Checking (`APPROVAL_GATE_LOCKED`)          │
│  • Sanitized Error Boundaries (Never exposes internal keys)            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Server-Only Internal Call
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   SERVER-ONLY PROVIDER ABSTRACTIONS                    │
│                                                                        │
│  `import "server-only";`                                               │
│  ├── Gemini Client (`src/lib/gemini/client.ts`)                        │
│  ├── GeminiAdaptationProvider (`src/lib/adaptation/`)                  │
│  ├── GeminiImageGenerationProvider (`src/lib/visuals/`)                │
│  └── Deterministic Fallback Providers (DemoAdaptation & DemoVisual)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS (API Key Authenticated)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL FOUNDATION MODELS                        │
│                                                                        │
│  Google Gemini API (`@google/genai`)                                   │
│  ├── Text Model: `gemini-2.5-flash`   (Cultural Plan & Devanagari)     │
│  └── Image Model: `gemini-3.1-flash-image` (35mm Photorealistic Visuals)│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. End-to-End Pipeline Lifecycle

The dataflow transitions through 8 strictly sequential stages:

```text
Screenplay Input (.txt / pasted string)
   │
   ▼
1. Deterministic Parser (`src/lib/parser/screenplayParser.ts`)
   │
   ▼
2. Canonical Entities (`SCN-xxx`, `CHR-xxx`, `LOC-xxx`, `PROP-xxx`, `COST-xxx`)
   │
   ▼
3. Cultural Adaptation Engine (`/api/adapt/plan` · Gemini 2.5 Flash)
   │  - Analyzes dialogue, attire, architecture, customs across 8 dimensions
   │  - Outputs `ADP-xxx` suggestions with authentic Devanagari regional phrasing
   │
   ▼
4. Human Decisions & Approval Gate (`src/components/ApprovalPanel.tsx`)
   │  - Human reviews every suggestion: Approved, Edited, or Rejected
   │  - HARD EXECUTION GATE: Screenplay generation blocked if any item is pending
   │
   ▼
5. Adapted Screenplay Engine (`/api/adapt/screenplay` · Gemini 2.5 Flash)
   │  - Synthesizes authentic Marwari Devanagari dialogue & adapted action lines
   │  - Preserves exact scene numbers, canonical IDs, and dramatic intent
   │
   ▼
6. Visual Production Pack (`/api/visuals/*` · Gemini 3.1 Flash Image)
   │  - Programmatically constructs 35mm anamorphic camera and lighting prompts
   │  - Generates photorealistic Scene Looks and Character Bible portraits
   │
   ▼
7. Automated Continuity Engine (`src/lib/continuity/continuityChecker.ts`)
   │  - 10+ programmatic assertions checking character, costume, and prop continuity
   │  - Flags items requiring explicit native-speaker sign-off
   │
   ▼
8. Export Engine (`src/lib/export/exportService.ts`)
   │  - Generates 4 production files: Screenplay (.txt), Plan (.json), Report (.txt), Full Archive (.json)
```

---

## 3. Canonical Identity Model

Entity identification strictly forbids using transient strings, line numbers, or actor names as keys. The canonical schema uses stable, zero-padded identifiers that remain invariant across parsing and transformations:

| Entity Type | Canonical ID Pattern | Example | Description |
|---|---|---|---|
| **Scene** | `SCN-{number}` | `SCN-001` | Sequential scene container with location, time, dialogues, and actions |
| **Character** | `CHR-{number}` | `CHR-001` | Normalized dramatis personae with scene bindings & dialogue counts |
| **Location** | `LOC-{number}` | `LOC-001` | Spatial setting bound to interior/exterior classifications |
| **Prop** | `PROP-{number}` | `PROP-001` | Key physical objects and environmental props |
| **Costume** | `COST-{number}` | `COST-001` | Character attire and wardrobe specifications |
| **Adaptation** | `ADP-{number}` | `ADP-001` | Discrete cultural translation suggestion with category and status |
| **Visual Package** | `VIS-{entityId}` | `VIS-SCN-001` | Framed prompt package with cultural and continuity constraints |
| **Continuity Check**| `CON-{number}` | `CON-001` | Automated audit rule execution with PASS/WARNING/ERROR |

---

## 4. Provider Interfaces & Pluggability

To support seamless transitions between live neural models and deterministic local engines, the codebase enforces strict TypeScript interfaces:

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

### Registered Providers:
- `GeminiAdaptationProvider`: Calls Gemini 2.5 Flash via `@google/genai` with low-temperature structured JSON prompting.
- `DemoAdaptationProvider`: 100% deterministic local provider with 14 curated Marwari transformation rules.
- `GeminiImageGenerationProvider`: Generates 35mm concept frames and character portraits via `gemini-3.1-flash-image`.
- `DemoImageGenerationProvider`: Deterministic prompt engine synthesizing 35mm camera and lighting specifications.

---

## 5. Security & Boundary Enforcement

1. **Server-Only Isolation:** All code handling `GEMINI_API_KEY` or calling `@google/genai` imports `server-only`. Any accidental client-side import is blocked at compile time.
2. **Strict Approval Gate Enforcement:** The approval gate is enforced both in the UI state machine and at the Next.js API boundary. The server rejects unapproved requests with HTTP `400 Bad Request`.
3. **Session-Scoped Visuals:** Images are delivered as Base64 Data URLs and kept in React workspace state, eliminating server storage risks and filesystem leaks.
