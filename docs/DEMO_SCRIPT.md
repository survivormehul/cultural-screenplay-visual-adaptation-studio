# Evaluator Demo Walkthrough Script (3–5 Minutes)

This script is structured for a 3 to 5-minute recorded video walkthrough or live evaluation of the **Cultural Screenplay & Visual Adaptation Studio**, showcasing the live Google Gemini AI integration (`gemini-2.5-flash` and `gemini-3.1-flash-image`) and the deterministic fallback mode.

---

## Walkthrough Timeline & Steps

### Step 1: Load Screenplay (0:00 – 0:30)
- **What to click:** 
  1. Open [http://localhost:3000](http://localhost:3000).
  2. Point to the top navigation header displaying the connection status badge: **"LIVE AI (Gemini Connected)"** (or "Deterministic Demo Mode" if operating without an API key).
  3. Click **"⚡ Load Demo Project"** in the header (or paste screenplay text / upload `.txt`).
- **What to show:**
  - The screenplay text editor populating with the original 3-scene rural Thar drama (*EXT. ANCESTRAL HOMESTEAD - DUSK*, *INT. HAVELI VERANDA - NIGHT*, *EXT. STEPWELL PERIMETER - DAWN*).
  - The live word, line, and character count counters in the input dashboard.
  - The sample disclaimer confirming this is original demo content.
- **What to say:**
  > *"Welcome to the Cultural Screenplay & Visual Adaptation Studio. In this walkthrough, we will adapt an original narrative screenplay into regional Marwari set in rural Jodhpur, Rajasthan, and generate an AI-powered visual production pack using Google Gemini.*
  > *Notice our header status badge: the server is connected to live Gemini models via the official `@google/genai` SDK, with a deterministic local engine available as fallback."*

---

### Step 2: Extract Structure & Stage 2 Transition (0:30 – 0:50)
- **What to click:** Click **"Start Adaptation Workflow"** (or click **Stage 2: "Structure Extraction"**).
- **What to show:**
  - Real-time extraction summary: 3 scenes, 2 characters, 6 props, 3 locations.
  - Automatic navigation to Stage 2: Structure Extraction.
- **What to say:**
  > *"Stage 2 invokes our deterministic screenplay state machine. The parser scans the script boundaries, identifies sluglines, character names, parentheticals, and action lines, generating structured production entities."*

---

### Step 3: Review Canonical Entities (0:50 – 1:15)
- **What to click:** Toggle through the review tabs: **Scenes**, **Characters**, **Props**, **Locations**.
- **What to show:**
  - Canonical identifiers: `SCN-001`, `SCN-002`, `SCN-003`.
  - Characters `CHR-001` (Vikram) and `CHR-002` (Thakur Bhawani Singh) with tracked dialogue counts.
  - Props `PROP-001` (Ancestral stone stepwell), `PROP-002` (Vintage motorcycle), `PROP-003` (Brass lota).
- **What to say:**
  > *"Notice that every entity is assigned an immutable canonical ID—such as SCN-001, CHR-001, and PROP-001. We never rely on volatile string matching or ungrounded model assumptions. This canonical identity graph forms the foundation for all subsequent adaptation and visual generation."*

---

### Step 4: Confirm Cultural Profile & Settings (1:15 – 1:30)
- **What to click:** Point to the **Active Cultural Profile Card** in the main interface.
- **What to show:**
  - Target Culture: **Rajasthani (Marwar)**
  - Target Region: **Rural Jodhpur, Thar Desert fringe**
  - Target Script: **Devanagari (देवनागरी)**
  - Dialect markers (*काईं*, *कोनी*, *-सा*, *बाबोसा*) and architectural context (yellow sandstone haveli, dry baoris).
- **What to say:**
  > *"Our active cultural matrix targets rural Jodhpur Marwari in Devanagari script. We lock in regional architectural conventions, water scarcity protocols, and socio-economic customs before triggering generation."*

---

### Step 5: Generate Cultural Adaptation Plan with Gemini (1:30 – 2:05)
- **What to click:** Click **"Approve Structure & Generate Cultural Plan"**.
- **What to show:**
  - Loading banner: *"⚡ Gemini AI is synthesizing cultural adaptation suggestions across all 8 dimensions..."*
  - The generated **Cultural Adaptation Plan** populated with 8–18 categorized suggestions.
  - Category filter pills: *Dialogue/Register*, *Greeting/Address*, *Environment*, *Costume*, *Props*, *Social context*.
  - Individual suggestion cards showing: original English phrase, proposed regional idiom, authentic Devanagari script, confidence score, and cultural rationale.
- **What to say:**
  > *"Clicking approve sends the canonical screenplay graph to Gemini 2.5 Flash via our server-side API. Gemini analyzes the dramatic beats across all eight cultural dimensions.*
  > *For example, in Scene 1, it identifies the address 'Father' and proposes the respectful Marwari title 'बाबोसा' (Babosa), shifts standard English dialogue to 'काईं कोनी बच्यो इणमें, बाबोसा', and maps the generic homestead into a sandstone haveli courtyard (पोल) and stepwell (बावड़ी)."*

---

### Step 6: Review & Approve Human Decisions (Approval Gate) (2:05 – 2:40)
- **What to click:**
  1. Click **"✎ Edit"** on any suggestion, adjust the text, and click **"Save"**.
  2. Click **"Proceed to Human Approval Gate"** (Stage 4).
  3. Point to the decision counters: Approved, Edited, Pending, Rejected.
  4. Point to the active warning banner: *"Review required before adaptation: Pending decisions require review."*
  5. Show that the execution button is disabled.
  6. Click **"✓ Approve Remaining Pending"**.
- **What to show:**
  - The status switching to green: *"✓ All Decisions Reviewed & Signed Off"*.
  - The action button unlocking: *"Generate Adapted Screenplay with Gemini"*.
- **What to say:**
  > *"Here we arrive at the core governance pillar: the Human Approval Gate. Notice that adaptation generation is strictly blocked while any suggestions remain pending.*
  > *Both the client interface and the server API enforce this check. Once I approve the remaining suggestions, the gate unlocks, guaranteeing that no unverified AI hallucinations make their way into production."*

---

### Step 7: Generate Adapted Screenplay with Gemini (2:40 – 3:15)
- **What to click:** Click **"Generate Adapted Screenplay"** (Stage 5).
- **What to show:**
  - Status banner confirming Gemini synthesis in Devanagari script.
  - Side-by-side view showing English on the left and authentic Marwari Devanagari dialogue on the right:
    - *BHAWANI:* *"थाऱी माँ रे जाबा पछे तूं इण बावड़ी में कदे नीं झांक्यो, विक्रम सा।"*
    - *VIKRAM:* *"काईं कोनी बच्यो इणमें, बाबोसा।"*
  - Toggle to **Scene Inspector** showing canonical ID preservation.
- **What to say:**
  > *"In Stage 5, Gemini synthesizes the final adapted screenplay using only our approved human decisions. Notice the dual-column view: dramaturgs can audit line-by-line fidelity. Scene headings, action descriptions, and character designations are fully grounded in Marwari setting while emotional arcs and scene IDs remain identical."*

---

### Step 8: Generate Visual Production Pack with Gemini (3:15 – 3:55)
- **What to click:** Click **"Proceed to Visual Concept Board"** (Stage 6).
- **What to show:**
  - The Visual Concept Board populated with Scene Concept Prompts (`VIS-SCN-001`, `VIS-SCN-002`) and Character Concept Prompts (`VIS-CHR-001`, `VIS-CHR-002`).
  - 35mm cinematic parameters: camera lenses (anamorphic primes), lighting (*गोधूलि वेला*), golden hour dust particles, and continuity constraints.
  - Click **"Generate All AI Visuals (Gemini)"** (or click **"✨ Generate with Gemini"** on a card).
  - Watch the live progress indicator: `Generating Visual 1 of 5...`, `Generating Visual 2 of 5...`
  - Real generated images appearing directly in the visual concept artboard frames.
  - Click **"🔍 Expand"** to show full-screen cinematic modal view.
- **What to say:**
  > *"In Stage 6, approved production data is converted into 35mm concept prompt packages and sent to Gemini's image model (`gemini-3.1-flash-image`).*
  > *Notice that prompts are not vague script snippets: they explicitly encode character IDs, saffron safa turban styles, yellow sandstone textures, and 35mm anamorphic camera framing. The generated image appears directly in our gallery, with live progress tracking across scene looks and character portraits."*
  > *(Note for evaluators: Live image generation requires an active Google AI Studio billing/quota tier. On free-tier accounts, Google returns 429 RESOURCE_EXHAUSTED (limit: 0); the UI displays complete 35mm prompt packages with inline retry controls and graceful status reporting).*

---

### Step 9: Review Continuity Report (3:55 – 4:30)
- **What to click:** Click **"Proceed to Continuity Report"** (Stage 7).
- **What to show:**
  - Automated 10-point audit summary: **10 Checks Executed**, **Passed: 9**, **Warnings: 1**, **Errors: 0**.
  - Integrity status banner: *"Integrity Verified: No unresolved continuity errors detected."*
  - Category filters: Character, Costume, Prop, Location, Scene ordering.
  - The explicit *"Unresolved / Requires Human Review"* section highlighting native elder sign-off.
- **What to say:**
  > *"Stage 7 executes our automated continuity audit engine. It programmatically asserts character retention, prop persistence—like the brass lota remaining on the stepwell parapet—and scene chronology.*
  > *Notice the explicit 'Requires Human Review' section, directing showrunners to items that demand native-speaker cultural sign-off."*

---

### Step 10: Export Deliverables (4:30 – 5:00)
- **What to click:** Click **"Proceed to Export"** (Stage 8).
- **What to show:**
  - The 4 production export packages with download buttons:
    1. **Adapted Screenplay Script (`.txt`)**
    2. **Cultural Adaptation Plan & Matrix (`.json`)**
    3. **Continuity Verification Audit Report (`.txt`)**
    4. **Complete Project Archive Bundle (`.json`)**
  - Click **"Download"** on Adapted Screenplay and open the downloaded file to show formatted Devanagari text.
- **What to say:**
  > *"Finally, Stage 8 provides immediate client-side downloads of all production deliverables—from the adapted script to the full JSON project archive.*
  > *This concludes our demonstration of the Cultural Screenplay & Visual Adaptation Studio: an end-to-end, AI-native system that unites foundation models with strict human governance and regional cultural authenticity."*
