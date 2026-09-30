# Cultural Screenplay & Visual Adaptation Studio

> AI-powered narrative workspace adapting screenplays to regional Indian cultures with consistent visual production packs and strict human editorial governance.

---

## Short Overview

The **Cultural Screenplay & Visual Adaptation Studio** transforms standard narrative screenplays into culturally grounded, production-ready regional adaptations. Built with Next.js, Google Gemini (`@google/genai`), and TypeScript, the studio preserves central dramatic purpose, emotional arcs, and character relationships while localizing dialogue, social behavior, material culture, and environment.

The current production profile is targeted for:
- **Culture:** Rajasthani (Marwar)
- **Region:** Rural Jodhpur, Rajasthan
- **Dialect:** Marwari (मारवाड़ी)
- **Script:** Devanagari (देवनागरी)

---

## What It Does

1. **Screenplay Ingestion & Structured Parsing:** Ingests raw text or `.txt` scripts and extracts canonical entities (`SCN-xxx`, `CHR-xxx`, `LOC-xxx`, `PROP-xxx`, `COST-xxx`).
2. **Cultural Adaptation Planning (Gemini 2.5 Flash):** Analyzes narrative context across 8 dimensions (Dialogue, Greetings, Environment, Costume, Props, Food, Social Context, Local Terminology).
3. **Strict Human Approval Gate:** Blocks screenplay and visual generation until human dramaturgs review, approve, edit, or reject all pending suggestions.
4. **Devanagari Screenplay Generation (Gemini 2.5 Flash):** Synthesizes authentic Marwari dialogue in Devanagari script side-by-side with original text.
5. **Visual Production Pack (Gemini 3.1 Flash Image):** Constructs 35mm anamorphic camera and lighting prompts and generates Scene Looks, Character Bibles, and Costume visuals.
6. **Automated Continuity Verification:** Audits character retention, costume persistence, prop consistency, and scene chronology across PASS/WARNING/ERROR checks.
7. **Production Deliverables Export:** Exports screenplay scripts (`.txt`), cultural adaptation dictionaries (`.json`), continuity reports (`.txt`), and full archive packages (`.json`).

---

## Workflow

```text
Screenplay Input (.txt / paste)
      ↓
Structure Extraction (Canonical SCN / CHR / LOC / PROP / COST)
      ↓
Structure Review & Confirmation
      ↓
Cultural Adaptation Plan (Gemini 2.5 Flash / 8 Dimensions)
      ↓
Human Editorial Decisions (Approve / Edit / Reject)
      ↓
[ HARD HUMAN APPROVAL GATE ] (Blocks unreviewed changes)
      ↓
Culturally Adapted Screenplay (Marwari Devanagari)
      ↓
Visual Production Pack (Gemini 3.1 Flash Image · 35mm Anamorphic)
      ↓
Automated Continuity Audit (10+ Rule Engine)
      ↓
Production Package Export (JSON & Text Bundles)
```

---

## AI Architecture

```text
Browser Client (Next.js UI · React 19)
      │
      │  (Zero client-side API keys)
      ▼
Next.js Server API Routes (/api/adapt/*, /api/visuals/*)
      │
      ├── Server-Only Security Boundary (`import "server-only"`)
      ├── Canonical Payload Validation
      └── Human Approval Gate Verification
      │
      ▼
Google Gemini SDK (`@google/genai`)
      │
      ├── Text Model: `gemini-2.5-flash` (Cultural plan & adapted screenplay)
      └── Image Model: `gemini-3.1-flash-image` (Scene looks & character portraits)
      │
      ▼
Deterministic Fallback Engine (Local offline mode if API key is absent)
```

---

## Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Core Runtime:** React 19, TypeScript 5
- **AI SDK:** [@google/genai](https://www.npmjs.com/package/@google/genai) (Official Google Gemini JavaScript SDK)
- **Styling:** Vanilla Tailwind CSS v4
- **Testing:** Node.js native test runner (`tsx --test`)
- **Execution:** Zero client-side key leakage; deterministic offline fallback built-in

---

## Project Structure

```text
.
├── src/
│   ├── app/                    # Next.js App Router pages & API routes
│   │   ├── api/
│   │   │   ├── adapt/plan/     # Cultural adaptation plan endpoint (Gemini)
│   │   │   ├── adapt/screenplay/# Adapted script endpoint (Approval-gated)
│   │   │   ├── visuals/packages/# Visual prompt packages endpoint
│   │   │   ├── visuals/generate-image/ # Gemini image generation endpoint
│   │   │   └── status/         # Server Gemini status check
│   │   ├── globals.css         # Base styling
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main 8-stage interactive studio pipeline
│   ├── components/             # Modular React UI components
│   │   ├── Header.tsx          # Studio header with live AI connection status
│   │   ├── StructureReview.tsx # Canonical scene & character review
│   │   ├── AdaptationPlan.tsx  # 8-category cultural matrix view
│   │   ├── ApprovalPanel.tsx   # Human approval gate with counters
│   │   ├── AdaptedScreenplayView.tsx # Dual English / Devanagari script
│   │   ├── VisualConceptBoard.tsx    # 35mm prompt cards & Gemini image gallery
│   │   ├── ContinuityReportView.tsx  # Automated audit report view
│   │   └── ExportPanel.tsx     # Deliverables download manager
│   ├── data/                   # Sample 3-scene rural Thar drama screenplay
│   ├── lib/                    # Core business logic & AI providers
│   │   ├── adaptation/         # Gemini & demo adaptation providers
│   │   ├── continuity/         # Multi-category continuity checker
│   │   ├── export/             # Text & JSON export formatters
│   │   ├── gemini/             # Server-only Gemini client abstraction
│   │   ├── parser/             # Deterministic screenplay parser
│   │   └── visuals/            # Gemini & demo image generation engines
│   └── types/                  # Canonical domain types & interfaces
├── docs/                       # Comprehensive documentation suite
│   ├── AI_USAGE.md             # AI integration, models, and security
│   ├── ARCHITECTURE.md         # Detailed pipeline & boundary architecture
│   ├── ASSIGNMENT_AUDIT.md     # Rigorous requirement compliance audit
│   ├── DEMO_SCRIPT.md          # Second-by-second walkthrough demo script
│   ├── LIMITATIONS.md          # Known scope boundaries and limitations
│   └── SAMPLE_OUTPUT.md        # Static samples of generated artifacts
├── test/                       # Automated unit & integration tests
├── .env.example                # Template for environment configuration
└── package.json
```

---

## Setup Instructions

### Prerequisites
- Node.js 20.x or higher
- npm 9.x or higher
- A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone & Install
```bash
git clone <repo-url>
cd "Cultural Screenplay Visual Adaptation Studio"
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Gemini API key in `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_TEXT_MODEL=gemini-2.5-flash
GEMINI_IMAGE_MODEL=gemini-3.1-flash-image
```

> **Note:** If `GEMINI_API_KEY` is omitted, the application operates in 100% deterministic local demo mode with zero external network dependencies.

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Description | Default | Required |
|---|---|---|---|
| `GEMINI_API_KEY` | Server-side Google Gemini API key | None | Yes for Live AI |
| `GEMINI_TEXT_MODEL` | Gemini model for cultural plan and script adaptation | `gemini-2.5-flash` | No |
| `GEMINI_IMAGE_MODEL` | Gemini model for 35mm cinematic visual generation | `gemini-3.1-flash-image` | No |

---

## Testing Commands

```bash
# Run unit & integration test suites
npm test

# Run ESLint validation
npm run lint

# Build production bundle
npm run build
```

---

## Demo Information

The studio includes a 3-scene original screenplay fixture (*EXT. ANCESTRAL HOMESTEAD - DUSK*, *INT. HAVELI VERANDA - NIGHT*, *EXT. STEPWELL PERIMETER - DAWN*) set in rural Jodhpur.

To experience a rapid 3–5 minute evaluation:
1. Click **"⚡ Load Demo Project"** in the top navigation.
2. Advance through Structure Extraction, Cultural Plan, and the Human Approval Gate.
3. Observe how unapproved changes are strictly barred from the adapted script.
4. Review Devanagari output and generate 35mm concept visuals with Gemini.
5. Inspect the 10-point continuity audit report and download production files.

*(For the complete second-by-second evaluator walkthrough, see [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md).)*

---

## Current Limitations & Verification Status

- **Gemini Text Generation (Verified):** Live text adaptation planning and Devanagari screenplay synthesis are fully operational and verified end-to-end via Gemini Flash models.
- **Gemini Image Generation (Implemented, Quota-Dependent):** Image generation is fully implemented using `@google/genai` targeting `gemini-3.1-flash-image`. Live image synthesis is dependent on Google account quota and billing availability. In testing on Google AI Studio free tier, requests encountered Google's `429 RESOURCE_EXHAUSTED` (allocation limit: 0 for image models). The studio handles this cleanly by surfacing the complete 35mm prompt specifications and an inline retry control. *(See [`docs/LIMITATIONS.md`](docs/LIMITATIONS.md) for details.)*
- **Human-in-the-Loop Dependency:** Regional dialect nuances, honorific registers, and community protocols require review by native speakers.
- **In-Memory Session State:** Workspaces reside in browser state; persistence across browser sessions requires re-ingesting or loading exported project bundles.
- **PDF Extraction:** PDF upload validates document metadata; text ingestion currently utilizes `.txt` files or direct text pasting.

---

## Detailed Documentation

- [AI Integration & Security (`docs/AI_USAGE.md`)](docs/AI_USAGE.md)
- [System Architecture (`docs/ARCHITECTURE.md`)](docs/ARCHITECTURE.md)
- [Assignment Compliance Audit (`docs/ASSIGNMENT_AUDIT.md`)](docs/ASSIGNMENT_AUDIT.md)
- [Evaluator Demo Script (`docs/DEMO_SCRIPT.md`)](docs/DEMO_SCRIPT.md)
- [Limitations & Scope Boundaries (`docs/LIMITATIONS.md`)](docs/LIMITATIONS.md)
- [Sample Production Outputs (`docs/SAMPLE_OUTPUT.md`)](docs/SAMPLE_OUTPUT.md)

---

## Author

**STAGE Junior AI-Native Engineer Assignment Submission**  
Built by Mehul.
