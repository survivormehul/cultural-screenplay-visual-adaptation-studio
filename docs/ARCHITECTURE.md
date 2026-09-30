# Cultural Screenplay & Visual Adaptation Studio — Architecture

This document describes the software architecture, domain model, and pipeline lifecycle of the **Cultural Screenplay & Visual Adaptation Studio**.

---

## 1. System Overview & Architecture Flow

The studio is designed as an enterprise-grade AI-assisted screenplay adaptation environment. Its core purpose is to adapt scripts into specific Indian cultural contexts, dialects, and visual settings while maintaining:
- **Narrative Integrity:** Preserving core character arcs, scene pacing, and thematic stakes.
- **Canonical Traceability:** Using immutable canonical identifiers across scenes (`SCN-XXX`), characters (`CHR-XXX`), locations (`LOC-XXX`), props (`PROP-XXX`), and adaptations (`ADP-XXX`).
- **Human-in-the-Loop Governance:** Requiring editorial approval before dialect adjustments are materialized into the adapted screenplay.
- **Visual & Continuity Synthesis:** Generating structured visual framing packages and verifying narrative continuity.

### Architecture Dataflow

```
User
  ↓
Next.js UI
  ↓
Workflow State
  ↓
Screenplay Parser
  ↓
Canonical Domain Model
  ↓
Cultural Adaptation Provider
  ↓
Human Approval Gate
  ↓
Adapted Screenplay
  ↓
Visual Prompt Provider
  ↓
Continuity Engine
  ↓
Export Service
```

---

## 2. Canonical Identity Model

Entity identification strictly forbids using transient strings or character names as keys. The canonical schema uses stable, zero-padded identifiers:

| Entity Type | Canonical ID Pattern | Example | Description |
|---|---|---|---|
| **Scene** | `SCN-{number}` | `SCN-001` | Sequential scene container with location, time, dialogues |
| **Character** | `CHR-{number}` | `CHR-001` | Normalized dramatis personae with scene binding & dialogue count |
| **Location** | `LOC-{number}` | `LOC-001` | Spatial setting bound to interior/exterior classifications |
| **Prop** | `PROP-{number}` | `PROP-001` | Key physical objects and environmental props |
| **Costume** | `COST-{number}` | `COST-001` | Character attire and wardrobe specifications |
| **Adaptation** | `ADP-{number}` | `ADP-001` | Discrete cultural translation suggestion with category and status |
| **Visual Package** | `VIS-{entityId}` | `VIS-SCN-001` | Framed prompt package with cultural and continuity constraints |
| **Continuity Check**| `CON-{number}` | `CON-001` | Automated audit rule execution with PASS/WARNING/ERROR |

---

## 3. Core Modules & Directory Layout

```
src/
├── app/
│   ├── layout.tsx                # App root layout with typography and metadata
│   ├── page.tsx                  # Main orchestration controller & state manager
│   └── globals.css               # Tailwind CSS v4 design tokens
├── components/
│   ├── Header.tsx                # Top navigation, target badge, Demo & Reset triggers
│   ├── CultureSettingsCard.tsx   # Active Marwari (Rural Jodhpur, Devanagari) matrix
│   ├── WorkflowSteps.tsx         # Interactive 8-stage pipeline navigation
│   ├── ScreenplayInputSection.tsx# Script ingestion, file reader, line/word counters
│   ├── StructureReview.tsx       # Extracted scenes, characters, props, locations
│   ├── AdaptationPlan.tsx        # Categorized suggestions, diff inspector, review actions
│   ├── ApprovalPanel.tsx         # Human approval gate preventing unauthorized changes
│   ├── AdaptedScreenplayView.tsx # Side-by-side & scene inspector with Devanagari output
│   ├── VisualConceptBoard.tsx    # Scene and character prompt packages with copy actions
│   ├── ContinuityReportView.tsx  # Audit metrics, grouped findings, human review section
│   ├── ExportPanel.tsx           # Direct browser downloads (.txt, .json, full project)
│   └── WorkspacePreview.tsx      # Dual-pane preview during Stage 1
├── data/
│   └── sampleScreenplay.ts       # Built-in Thar desert drama excerpt & cultural profile
├── lib/
│   ├── parser/                   # Deterministic screenplay parser
│   ├── adaptation/               # DemoAdaptationProvider & adaptScreenplay transformer
│   ├── visuals/                  # DemoImageGenerationProvider
│   ├── continuity/               # Deterministic continuity validation engine
│   └── export/                   # Browser download formatting and export service
└── types/
    ├── domain.ts                 # Canonical domain models and pipeline state
    └── adaptation.ts             # Profile and configuration interfaces
```

---

## 4. Pipeline Stages & Execution Flow

1. **Stage 1 (Screenplay Input):** Ingests raw text or `.txt` file via HTML5 `FileReader`. PDF metadata is captured with an explicit notice that binary parsing is scheduled for future milestones.
2. **Stage 2 (Structure Extraction):** Regular expression-based deterministic parser extracts scene headings (`INT.`, `EXT.`), character cues, dialogues, action lines, props, and locations.
3. **Stage 3 (Cultural Adaptation Plan):** `DemoAdaptationProvider` generates suggestions across 8 discrete categories: Dialogue/Register, Greeting/Address, Environment, Costume, Props, Food, Social Context, and Local Terminology.
4. **Stage 4 (Human Approval Gate):** Enforces editorial review. Suggestions marked `pending` or `rejected` are strictly omitted from output generation.
5. **Stage 5 (Adapted Screenplay):** `adaptScreenplay` transforms dialogues and headings into Marwari with Devanagari script, preserving scene numbering and character IDs.
6. **Stage 6 (Visual Generation Planning):** Generates structured visual concept packages detailing camera angle, lighting (`गोधूलि वेला`), costume, architecture, and continuity constraints without calling external image APIs.
7. **Stage 7 (Continuity Report):** Executes automated verification rules across 7 categories and highlights items requiring human/native-speaker review.
8. **Stage 8 (Export):** Triggers client-side browser downloads for adapted scripts, translation dictionaries, audit certificates, and full project archives.

---

## 5. Where Real AI Providers Can Be Inserted

The studio is designed around provider abstractions that decouple UI and domain orchestration from intelligence backends:

```typescript
// Screenplay Adaptation Interface
export interface TextAdaptationProvider {
  providerId: string;
  name: string;
  generatePlan(screenplay: Screenplay, profile: CulturalProfile): Promise<AdaptationPlan>;
  generateAdaptation(screenplay: Screenplay, plan: AdaptationPlan, decisions: Record<string, AdaptationDecision>): Promise<AdaptedScreenplay>;
}

// Visual Generation Interface
export interface ImageGenerationProvider {
  providerId: string;
  name: string;
  generateScenePrompt(scene: AdaptedScene, originalScene?: Scene): Promise<SceneVisualPromptPackage>;
  generateCharacterPrompt(character: Character, scene: AdaptedScene): Promise<CharacterVisualPromptPackage>;
  generateAll(adaptedScreenplay: AdaptedScreenplay, originalScreenplay: Screenplay): Promise<VisualPackages>;
}
```

### Future Insertion Points:

1. **Screenplay Parser (`src/lib/parser`):**
   - *Current:* Deterministic regex state machine.
   - *Future Insertion:* Multimodal Document AI (e.g. Gemini 1.5 Pro) for parsing complex binary PDFs and non-standard industry formats.
2. **Cultural Adaptation Engine (`src/lib/adaptation`):**
   - *Current:* `DemoAdaptationProvider` implementing curated Marwari rules.
   - *Future Insertion:* Fine-tuned LLM provider (`GeminiAdaptationProvider` / `ClaudeAdaptationProvider`) trained on regional dialect corpora, with native speaker validation in the prompt loop.
3. **Visual Generation Engine (`src/lib/visuals`):**
   - *Current:* `DemoImageGenerationProvider` structuring 35mm prompt packages.
   - *Future Insertion:* Diffusion API connectors (`FluxImageProvider`, `MidjourneyProvider`, `StableDiffusionProvider`) that take prompt packages and generate concept frames.
4. **Continuity Engine (`src/lib/continuity`):**
   - *Current:* Deterministic rule engine verifying canonical ID presence and order.
   - *Future Insertion:* Multimodal continuity reasoning comparing visual character vectors and subtle narrative subtext across scenes.
