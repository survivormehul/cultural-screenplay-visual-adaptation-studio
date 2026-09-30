# Cultural Screenplay & Visual Adaptation Studio

> AI-assisted screenplay adaptation studio preserving story, characters, and continuity across regional Indian cultural contexts.  
> **Target Profile:** Marwari (मारवाड़ी), Rural Jodhpur, Devanagari (देवनागरी) script.

---

## Overview

The **Cultural Screenplay & Visual Adaptation Studio** is a specialized narrative engineering suite that adapts screenplays to specific Indian cultural traditions, regional dialects, and visual aesthetics without compromising plot arcs, character motivations, or narrative continuity.

Built for production studios, showrunners, and regional content creators, the platform combines deterministic domain parsing with cultural transformation models and human-in-the-loop governance.

---

## Problem

Adapting a screenplay to a regional Indian setting (such as rural Western Rajasthan) is rarely a matter of direct machine translation:
1. **Linguistic Nuance:** Generic LLMs often produce flat Hindi or Bollywood caricatures rather than authentic regional dialects (e.g. Marwari spoken in rural Jodhpur).
2. **Contextual Incongruity:** Props, architecture, costume, and socio-economic customs (e.g. water scarcity protocols, ancestral stepwells, honorific suffixes like `-सा` or `बाबोसा`) must be deeply integrated rather than superficially swapped.
3. **Continuity Breakage:** Ad-hoc dialogue or setting changes frequently break character relationships, prop persistence, and spatial logic across scenes.
4. **Lack of Editorial Governance:** Purely automated AI systems risk hallucinating inauthentic cultural practices without editorial sign-off gates.

---

## Solution

The studio provides an end-to-end, multi-stage adaptation pipeline:
- **Canonical Traceability:** Every scene, character, prop, and cultural suggestion is indexed with immutable canonical IDs (`SCN-001`, `CHR-001`, `PROP-001`, `ADP-001`).
- **Structured Cultural Adaptation Matrix:** Categorizes dialect and cultural shifts across 8 distinct dimensions.
- **Strict Human Approval Gate:** Blocks screenplay generation until every pending suggestion is reviewed, approved, edited, or rejected by human dialectologists.
- **Devanagari Screenplay Generation:** Materializes authentic Marwari dialogue in Devanagari script side-by-side with original text.
- **Cinematic Visual Prompt Synthesis:** Generates professional 35mm anamorphic camera and lighting prompt packages with cultural and continuity constraints.
- **Automated Continuity Engine:** Audits character preservation, prop retention, and chronological scene progression.
- **Production Export Suite:** Downloads scripts, JSON translation dictionaries, continuity audit logs, and complete archive bundles.

---

## Key Features

1. **Deterministic Screenplay Parser:** Extracts scene headings (`INT./EXT.`), character cues, dialogues, parentheticals, locations, and props with zero external dependencies.
2. **8-Category Cultural Matrix:** Covers Greetings/Address, Dialogue/Register, Environment, Costume, Key Props, Food/Hospitality, Social Context, and Local Terminology.
3. **Interactive Human Approval Gate:** Real-time counters (Approved, Edited, Pending, Rejected), pending decision warnings, inline editing, and hard execution enforcement.
4. **Devanagari Adapted Screenplay:** Side-by-side comparison view and scene inspector rendering authentic Marwari orthography.
5. **Cinematic Visual Concept Board:** 35mm prompt engineering exposing camera lenses, lighting (*गोधूलि वेला*), architecture, costume, and one-click copy buttons.
6. **Multi-Category Continuity Engine:** Automated verification rules with PASS/WARNING/ERROR severity and an explicit "Requires Human Review" section.
7. **Production Export Suite:** Client-side downloads for adapted scripts (`.txt`), cultural plans (`.json`), continuity reports (`.txt`), and full project JSON packages.

---

## Demo Workflow

The primary 3–5 minute evaluator walkthrough follows 12 distinct steps:

1. **Load Demo Project:** Click **"⚡ Load Demo Project"** to populate the original Thar drama screenplay (*EXT. ANCESTRAL HOMESTEAD - DUSK*).
2. **Start / Run Structure Extraction:** Inspect the parser extracting scenes, characters, and props.
3. **Review Extracted Structure:** Review canonical scene hierarchy and character cues.
4. **Approve Structure:** Sign off on extracted scenes to generate the cultural plan.
5. **Review Cultural Adaptation Plan:** Inspect 14 categorized suggestions across 8 dimensions.
6. **Approve / Reject / Edit Suggestions:** Test inline editing and individual decision buttons.
7. **Pass the Human Approval Gate:** Observe the pending decision warning banner; approve remaining decisions to unlock generation.
8. **Generate Adapted Screenplay:** Produce the Marwari Devanagari script and inspect side-by-side.
9. **Generate Visual Prompt Packages:** Synthesize 35mm anamorphic scene and character prompt packages.
10. **Run Continuity Check:** Execute the 10-point automated audit engine.
11. **Review Report:** Review check statuses and flagged native-speaker review items.
12. **Export:** Download all production deliverables.

*(For a detailed second-by-second walkthrough script, see [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md).)*

---

## Architecture

```
User (Browser)
      │
      ▼
Next.js App Router UI (TypeScript + Tailwind CSS)
      │
      ▼
Pipeline State Controller (React Lifecycle)
      │
      ▼
Deterministic Screenplay Parser (State Machine + Regex)
      │
      ▼
Canonical Domain Model (SCN, CHR, LOC, PROP, COST)
      │
      ▼
Cultural Adaptation Provider Interface (DemoAdaptationProvider)
      │
      ▼
Human Approval Gate (Editorial Policy Filter)
      │
      ▼
Adapted Screenplay Transformer (adaptScreenplay)
      │
      ▼
Visual Prompt Generation Provider (DemoImageGenerationProvider)
      │
      ▼
Continuity & Diagnostic Engine (continuityChecker)
      │
      ▼
Production Export Service (exportService)
```

*(For detailed architectural specifications and directory layouts, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).)*

---

## Canonical ID Strategy

The studio strictly forbids using transient strings or character names as keys. The canonical schema uses stable, zero-padded identifiers:

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

## Human-in-the-Loop Adaptation

Cultural authenticity cannot be fully delegated to automated algorithms. The studio implements a **Strict Human Approval Gate**:
- Suggestions start in a `pending` state.
- Reviewers can mark suggestions as `approved`, `rejected`, or `edited`.
- **Adapted screenplay generation is strictly blocked** while any suggestion remains `pending`.
- Rejected suggestions are **strictly excluded** from the final adapted text.
- User-edited phrases take precedence over automated suggestions.
- The UI displays explicit counter metrics: *Total, Approved, Edited, Pending, Rejected*.

---

## Demo Mode

To allow complete, frictionless review without paid API keys or external network dependencies, this milestone operates 100% in **Deterministic Demo Mode**:
- **Zero Mock Deception:** The application explicitly labels demo providers and states that real external AI endpoints are not connected.
- **Zero API Keys Required:** No OpenAI, Anthropic, Gemini, Midjourney, or Replicate credentials are required.
- **Deterministic Transformation:** Screenplay parsing, adaptation suggestion generation, prompt synthesis, and continuity checks execute instantly on the client.

---

## Visual Generation

Visual concept planning produces production-grade prompt packages without calling live diffusion models:
- **Scene Packages:** Scene ID, subject framing, environment, architecture, costumes, key props, camera specs (e.g. Arri Alexa LF with Cooke Anamorphic lenses), lighting (*गोधूलि वेला*), cultural constraints, continuity rules, and engineered prompt string.
- **Character Packages:** Character ID, portrait specifications, age descriptor, costume, environment context, continuity requirements, and character prompt string.
- **Copy to Clipboard:** One-click prompt copying with instant visual confirmation.
- **Prominent Label:** Displays *"Image provider not connected — prompt package generated in Demo Mode."*

---

## Continuity

The continuity engine executes automated rule checks across 7 categories:
1. **Character Continuity:** Verifies that all characters from original scenes appear in adapted scenes.
2. **Costume Continuity:** Verifies that attire modifications remain consistent across sequential scenes.
3. **Prop Persistence:** Tracks physical props (e.g. the brass lota carried from the outdoor well into the indoor veranda).
4. **Location Consistency:** Validates spatial logic and environmental descriptions.
5. **Scene Ordering:** Verifies chronological scene sequence and time-of-day progression.
6. **Exclusion Validation:** Guarantees that rejected cultural suggestions do not appear in the adapted screenplay.
7. **Human Review Escalation:** Surfaces nuanced cultural and administrative questions (e.g. village panchayat protocols) requiring native elder sign-off.

---

## Export

The studio provides direct client-side downloads using standard canonical filenames:
- `cultural-adapted-screenplay.txt`: Production script formatted with scene headers, action lines, dual Devanagari/English dialogues, and applied adaptation metadata.
- `cultural-adaptation-plan.json`: Complete translation ledger with linguistic rationales, confidence scores, and approved editorial decisions.
- `continuity-report.txt`: Full continuity audit certificate with check findings and human sign-off list.
- `cultural-screenplay-project.json`: Complete serialized studio state for archiving and session replay.

---

## Testing

The studio features an automated unit test suite using the Node.js native test runner (`tsx --test`):
- **Test 1:** Screenplay parser extraction (scenes, characters, dialogues).
- **Test 2:** Canonical ID stability across multi-pass parsing.
- **Test 3:** Categorized adaptation plan generation with canonical IDs.
- **Test 4:** Rejection filtering (rejected items strictly omitted).
- **Test 5:** Approved adaptations applied with Devanagari script output.
- **Test 6:** Scene ordering and canonical ID preservation.
- **Test 7:** Continuity error detection for missing entities.
- **Test 8:** Export payload validation and formatting.

Run tests:
```bash
npm test
```

---

## Setup

### Prerequisites
- Node.js `v20+` or `v22+`
- npm `10+`

### Installation
```bash
npm install
```

### Run Unit Tests
```bash
npm test
```

### Run Linter
```bash
npm run lint
```

### Production Build
```bash
npm run build
```

### Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Limitations

1. **PDF Parsing:** The file input captures PDF metadata but guides users to paste text directly; binary PDF extraction via server libraries is not connected in this client-side demo milestone.
2. **Curated Demo Lexicon:** The `DemoAdaptationProvider` covers 14 high-impact dialect transformation rules across 8 cultural dimensions. It does not provide arbitrary machine translation.
3. **Single Active Cultural Profile:** Currently targets Marwari (Rural Jodhpur, Devanagari). Additional dialect profiles (Braj Bhasha, Maithili, Awadhi) are architectural stubs for future milestones.
4. **Prompt Synthesis Only:** Visual packages engineer photorealistic prompt strings; live diffusion rendering via external GPU APIs is not connected.
5. **Session State:** State is maintained in React application memory; cross-session persistence is achieved via the Complete Project JSON export.

*(For full details, see [docs/LIMITATIONS.md](docs/LIMITATIONS.md).)*

---

## Future AI Integration

The studio is architected with clean provider interfaces (`TextAdaptationProvider`, `ImageGenerationProvider`) allowing seamless connection of neural AI models:
- **Screenplay Understanding:** Multimodal Document AI (Gemini 1.5 Pro) for extracting non-standard Final Draft and PDF screenplays.
- **Cultural & Dialect Adaptation:** Fine-tuned Indic LLMs (Gemini / Claude) trained on regional dialect corpora with native linguistic validation.
- **Visual Rendering:** Direct integration with FLUX.1 Pro, Stable Diffusion 3.5, or Midjourney APIs.
- **Multimodal Continuity:** Cross-scene visual embedding checks for actor likeness and spatial haveli layout consistency.

*(For detailed integration architecture, see [docs/AI_USAGE.md](docs/AI_USAGE.md).)*
