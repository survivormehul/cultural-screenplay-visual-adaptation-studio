# AI Usage, Model Integration & Security Architecture

This document details the AI architecture, model selection, prompt engineering, structured validation, and security protocols in the **Cultural Screenplay & Visual Adaptation Studio**.

---

## 1. Overview & Dual-Engine Architecture

The studio implements a **Dual-Engine Architecture** that pairs live Google Gemini foundation models with a 100% deterministic local fallback engine:

1. **Live Gemini Engine (`@google/genai`):** Activated automatically whenever `GEMINI_API_KEY` is present in the server environment. Provides LLM-powered cultural adaptation and 35mm cinematic concept image synthesis.
2. **Deterministic Fallback Engine:** Operates when `GEMINI_API_KEY` is omitted or when an evaluator desires an offline, zero-network, 100% deterministic walkthrough.

Both engines implement the identical domain contracts (`TextAdaptationProvider` and visual generation specifications), ensuring zero frontend disruption and strict behavioral parity.

---

## 2. Models Used

| Capability | Model | Provider | Role |
|---|---|---|---|
| **Cultural Adaptation Plan** | `gemini-2.5-flash` (configurable via `GEMINI_TEXT_MODEL`) | Google Gemini API via `@google/genai` | Ingests parsed screenplay entities and generates structured adaptation suggestions across 8 cultural dimensions. |
| **Adapted Screenplay Synthesis** | `gemini-2.5-flash` (configurable via `GEMINI_TEXT_MODEL`) | Google Gemini API via `@google/genai` | Applies approved cultural decisions to synthesize authentic Marwari dialogue in Devanagari script side-by-side with original text. |
| **Visual Production Pack** | `gemini-3.1-flash-image` (configurable via `GEMINI_IMAGE_MODEL`) | Google Gemini API via `@google/genai` | Synthesizes photorealistic 35mm anamorphic scene looks and character portraits from approved canonical production metadata. |

---

## 3. Deterministic vs. Generative Components

| Pipeline Component | Mechanism | Rationale |
|---|---|---|
| **Screenplay Parser** | **Deterministic** (Regex & State Machine) | Screenplay syntax (sluglines, character names, parentheticals) requires deterministic boundary parsing with guaranteed zero hallucination. |
| **Canonical Identity Mapping** | **Deterministic** (`SCN-xxx`, `CHR-xxx`, `PROP-xxx`) | Identifiers must remain immutable across multi-pass parsing, script edits, and downstream exports. |
| **Cultural Adaptation Plan** | **Generative** (`gemini-2.5-flash`) | Contextual cultural nuance (metaphors, caste/familial hierarchies, dialect markers) benefits from expansive linguistic pretraining. |
| **Approval Filtering** | **Deterministic** (Boolean Gate) | Human decisions are strictly authoritative. AI cannot override or un-reject human editorial decisions. |
| **Adapted Screenplay** | **Generative** (`gemini-2.5-flash`) | Re-articulates emotional cadence and spoken Marwari in Devanagari while adhering strictly to approved suggestions. |
| **Visual Prompt Engineering** | **Deterministic Template Synthesis** | 35mm camera, lens, lighting, and continuity constraints are programmatically assembled from canonical scene/character data. |
| **Image Generation** | **Generative** (`gemini-3.1-flash-image`) | Diffusion/multimodal image synthesis materializes visual concept art directly into the workspace. |
| **Continuity Verification** | **Deterministic** (Rule Engine) | Consistency checks (character retention, costume consistency, prop persistence) require verifiable boolean assertions. |
| **Export Packaging** | **Deterministic** (Client-side formatters) | Production scripts, JSON archives, and audit text files must be reproducible and bit-perfect. |

---

## 4. Cultural Adaptation Generation

The cultural adaptation engine receives:
- Canonical screenplay entities (scenes, characters, dialogue blocks, locations, props, costumes)
- Selected Cultural Profile (target culture, dialect, script, geographic region, socio-cultural notes)
- Assignment constraints:
  - Preserve central dramatic conflict, emotional stakes, and scene intent.
  - Never alter character relationships or delete scenes.
  - Cover all 8 canonical dimensions:
    1. *Dialogue/Register*
    2. *Greeting/Address*
    3. *Environment*
    4. *Costume*
    5. *Props*
    6. *Food*
    7. *Social context*
    8. *Local terminology*

### Structured Output & Validation
The engine requests `application/json` output and rigorously validates the returned structure:
- Every suggestion is mapped to a sequential canonical ID (`ADP-001`, `ADP-002`, ...).
- Category strings are validated against the 8 known dimensions.
- Target scene IDs (`SCN-xxx`) are validated against parsed scenes.
- Devanagari output (`devanagariProposed`) is verified for non-empty content.
- If Gemini returns malformed data, an informative error is returned to the user without corrupting workspace state, enabling instant retry.

---

## 5. Visual Generation & Prompt Construction

To avoid vague or ungrounded image prompts, the studio constructs prompts directly from approved canonical production records:
- **Character Concept Portraits:** Prompt combines character canonical ID, age descriptor, physical description, costume specifications, setting context, 35mm lens package, and lighting notes.
- **Scene Concept Art:** Prompt combines scene heading (`adaptedHeading`), location architecture (yellow sandstone haveli, dry baori), character placement, costume descriptions, atmospheric lighting (*गोधूलि वेला* / dusk light), and continuity constraints.

### Response Handling & Session Storage
- Image data is returned from the server as Base64 Data URLs (`data:image/jpeg;base64,...`).
- Images are held in the client React state session, preventing disk clutter and avoiding unnecessary server-side storage bloat.
- The UI exposes both batch generation ("Generate All AI Visuals") with live progress indicators (`Generating 1 of N`) and individual on-demand generation ("Generate with Gemini" / "Regenerate") on each concept card.

---

## 6. Strict Human Approval Gate

Visual generation and final screenplay synthesis **CANNOT** be triggered until the human approval gate is satisfied:
1. **Client-Side Enforcement:** The UI disables generation buttons and displays an active warning banner if any cultural suggestions remain in `"pending"` status.
2. **Server-Side API Boundary Enforcement:**
   - `/api/adapt/screenplay` inspects the request payload and rejects with HTTP `400 Bad Request` (`APPROVAL_GATE_LOCKED`) if pending suggestions exist.
   - `/api/visuals/packages` rejects with HTTP `400 Bad Request` (`APPROVAL_GATE_REQUIRED`) if called without an authentic, approved adapted screenplay. In turn, `/api/visuals/generate-image` executes on-demand synthesis for prompt packages produced downstream by the approval-gated package engine.

---

## 7. API Key Security & Server-Only Abstraction

- **Zero Client Exposure:** The client bundle contains **NO** API keys. `NEXT_PUBLIC_GEMINI_API_KEY` is deliberately avoided.
- **`server-only` Protection:** The Gemini client (`src/lib/gemini/client.ts`), adaptation provider (`GeminiAdaptationProvider.ts`), and image provider (`GeminiImageGenerationProvider.ts`) are protected with:
  ```typescript
  import "server-only";
  ```
  Any accidental attempt to import these files into client components will fail at compile time.
- **API Boundary Sanitization:** Server API routes catch upstream Gemini exceptions and return sanitized messages, preventing stack traces, environment variables, or API keys from ever leaking to the browser.
- **Git Protection:** `.gitignore` excludes `.env*` files with an explicit exception only for `.env.example`.

---

## 8. Failure Handling & Resilience

1. **Missing API Key:** When `GEMINI_API_KEY` is not present, `/api/status` reports `configured: false`, the header displays a clear "Deterministic Demo Mode" badge, and the application seamlessly routes through local deterministic providers.
2. **Rate Limits & Quota Exhaustion:** If an individual image or dialogue call encounters a Gemini rate limit, the API returns a descriptive error message. For images, the prompt card remains fully intact and displays an inline retry button, allowing single-item recovery without failing the entire visual board.
3. **Screenplay Adaptation Fallback:** If the LLM generates an unparseable response for adapted screenplay text, `GeminiAdaptationProvider` falls back gracefully to `adaptScreenplay.ts`, guaranteeing that the user's workflow is never permanently blocked.

---

## 9. Known AI Limitations

1. **Regional Nuance Sensitivity:** Marwari has multiple regional dialects (Jodhpuri, Shekhawati, Bikaneri, Thali). While Gemini 2.5 Flash produces strong Devanagari Marwari, native-speaker review remains essential for nuanced community dialogue.
2. **Multi-Turn Visual Consistency:** Zero-shot image models cannot guarantee 100% pixel-perfect facial geometry across multiple scene angles without LoRA training or image-to-image reference conditioning.
3. **In-Memory State Scope:** Generated images and plans persist within the current browser session. Refreshing the browser resets the workspace unless the user re-loads the project bundle.
