# Evaluator Demo Walkthrough Script (3–5 Minutes)

This script is structured for a 3 to 5-minute recorded video walkthrough or live evaluation of the **Cultural Screenplay & Visual Adaptation Studio**.

---

## Walkthrough Timeline

### 0:00 – 0:20 | Product Introduction
- **What to click:** View the application dashboard landing page at `http://localhost:3000`. Point mouse at the title header and the active culture badge (*Marwari · Rural Jodhpur · देवनागरी*).
- **What to show:** The clean, studio-grade layout, the 8-stage interactive workflow progress bar, and the active cultural profile card.
- **What to say:**
  > *"Welcome to the Cultural Screenplay & Visual Adaptation Studio. This is an AI-assisted engineering workbench designed to adapt narrative screenplays into specific Indian cultural contexts and dialects while strictly preserving story arcs, character motivations, and narrative continuity.*
  > *Today, our active target profile is rural Jodhpur Marwari rendered in authentic Devanagari script. The prototype is running entirely locally in a deterministic demo mode—no API keys or external paid services required, with zero mock deception."*

---

### 0:20 – 0:45 | Load Demo Screenplay & Target Culture
- **What to click:** Click **"⚡ Load Demo Project"** in the top-right header (or click **"Load Sample Scene"** in the Input section).
- **What to show:** The screenplay input editor populating with the original 3-scene drama (*EXT. ANCESTRAL HOMESTEAD - DUSK*, *INT. HAVELI VERANDA - NIGHT*, *EXT. STEPWELL PERIMETER - DAWN*). Point out the disclaimer banner: *"Original demo screenplay created for this prototype. Not supplied by STAGE."* Point out the line, word, and character counters.
- **What to say:**
  > *"To demonstrate the complete lifecycle, I'll load our built-in original demo screenplay—a dramatic three-scene confrontation between an aging patriarch and his city-educated son over water rights and ancestral soil in the Thar desert.*
  > *Notice the explicit disclaimer: this is original content written specifically for this evaluation. Our active cultural profile locks in key architectural anchors like yellow sandstone havelis and stepwells, customary filial protocols, and traditional attire."*

---

### 0:45 – 1:20 | Structure Extraction
- **What to click:** Click **Stage 2: "Structure Extraction"** in the top workflow bar (or click "Start Adaptation Workflow" / "Approve Structure").
- **What to show:** The extracted structure review dashboard with metric cards: **3 Scenes**, **2 Characters**, **6 Props**, **3 Locations**, and **0 Unresolved items**. Toggle between the tabs:
  - **Scenes Tab:** `SCN-001` (Dusk), `SCN-002` (Night), `SCN-003` (Dawn).
  - **Characters Tab:** `CHR-001` (Vikram) and `CHR-002` (Thakur Bhawani Singh) with canonical IDs and dialogue counts.
  - **Props Tab:** `PROP-001` (Weathered stone well), `PROP-002` (Vintage motorcycle), `PROP-003` (Brass lota of fresh water).
- **What to say:**
  > *"In Stage 2, our deterministic screenplay parser breaks the raw script down into a canonical domain model. Every scene receives a stable zero-padded identifier—like SCN-001 and SCN-002. Characters and key props are indexed with persistent IDs. This ensures full traceability across every subsequent transformation—we never rely on fragile string matching."*

---

### 1:20 – 2:00 | Cultural Adaptation Plan
- **What to click:** Click **Stage 3: "Cultural Adaptation Plan"**.
- **What to show:** The 14 categorized cultural adaptation suggestions. Click category filter pills:
  - **Greeting/Address:** Shows `ADP-001` (*Father* → *बाबोसा / Babosa*) and `ADP-002` (*Vikram* → *विक्रम सा*).
  - **Dialogue/Register:** Shows `ADP-003` (*Because there's nothing left in it, Father* → *काईं कोनी बच्यो इणमें, बाबोसा।*).
  - **Environment:** Shows haveli parapet and stepwell transformation.
  - **Costume & Props:** Shows handspun Angarkha, saffron safa, silver murki, and dust-caked Enfield with protective moli thread.
  - Demonstrate inline editing: Click **"✎ Edit"** on any suggestion, tweak the text, and click **"Save"**.
- **What to say:**
  > *"In Stage 3, the adaptation engine proposes 14 distinct cultural adjustments across eight dimensions—including filial greetings, regional idioms, architecture, costumes, and socio-economic customs like 'kudak' debt foreclosure.*
  > *Each suggestion shows the original English phrase, the proposed Marwari idiom, the Devanagari orthography, a confidence score, and a clear linguistic rationale. Reviewers can approve, reject, or directly edit suggestions inline."*

---

### 2:00 – 2:30 | Human Approval Gate
- **What to click:** Click **Stage 4: "Human Approval"** (or click "Go to Human Approval Gate").
- **What to show:** The Human Approval Gate dashboard. Point out the counter bar: **6 Approved**, **2 Edited**, **2 Pending**, **0 Rejected**.
  - Show the prominent warning banner: *"2 cultural decisions still require review. The adaptation pipeline is paused at this gate."*
  - Show that the main action button is disabled: *"Review Required: 2 Cultural Decisions Pending"*.
  - Click **"✓ Approve Remaining (2)"** to resolve the gate.
  - Show the status switch to green: *"All Decisions Reviewed & Signed Off"*.
  - Show the button now enabled: *"Generate Adapted Screenplay (10 Adaptations)"*.
- **What to say:**
  > *"This brings us to one of our core architectural pillars: the Human Approval Gate. Notice that loading the demo project did not silently bypass human governance.*
  > *The system explicitly halts here because two cultural decisions are still pending review. The generate button is strictly disabled. This guarantees unverified AI assumptions never contaminate production scripts. I'll click 'Approve Remaining', the gate clears, and we can now generate the adapted screenplay."*

---

### 2:30 – 3:10 | Adapted Screenplay
- **What to click:** Click **"Generate Adapted Screenplay"** (transitions to Stage 5).
- **What to show:** The Adapted Screenplay View.
  - Toggle between **Side-by-Side Comparison** and **Scene Inspector**.
  - In Scene 1, show the English dialogue on the left and the authentic Marwari Devanagari dialogue on the right:
    - *BHAWANI:* *"You haven't looked into that well since your mother passed, Vikram."* → *"थाऱी माँ रे जाबा पछे तूं इण बावड़ी में कदे नीं झांक्यो, विक्रम सा।"*
    - *VIKRAM:* *"Because there's nothing left in it, Father."* → *"काईं कोनी बच्यो इणमें, बाबोसा।"*
  - Point out that scene numbering and canonical IDs remain perfectly preserved.
- **What to say:**
  > *"Stage 5 outputs the fully adapted screenplay in authentic Devanagari script. Notice how our approved adjustments have been woven directly into the dialogue while preserving the exact emotional beats, parentheticals, and dramatic tension.*
  > *The side-by-side view allows dialect supervisors to audit line-by-line fidelity between the English source and the Marwari adaptation."*

---

### 3:10 – 3:40 | Visual Prompt Generation
- **What to click:** Click **"Proceed to Visual Concept Board"** (transitions to Stage 6).
- **What to show:** The Visual Concept Board.
  - Point out the disclaimer: *"Image provider not connected — prompt package generated in Demo Mode."*
  - Toggle between **Scene Concept Prompts** (`VIS-SCN-001`, `VIS-SCN-002`, `VIS-SCN-003`) and **Character Concept Prompts** (`VIS-CHR-001`, `VIS-CHR-002`).
  - Point out the rich 35mm cinematic parameters: camera lenses (anamorphic primes, 50mm, 28mm), golden hour dusk lighting (*गोधूलि वेला*), amber lantern glow, and cultural constraints.
  - Click **"Copy Prompt"** on `VIS-SCN-001` and show the *"Copied!"* confirmation state.
- **What to say:**
  > *"Stage 6 synthesizes production-ready visual prompt packages for cinematographers and concept artists. We don't pretend to run fake diffusion models here; instead, our engine structures professional camera specs, anamorphic framing, lighting atmosphere, and costume constraints.*
  > *Clicking 'Copy Prompt' gives creators an immediately usable prompt string optimized for Midjourney, FLUX, or Stable Diffusion."*

---

### 3:40 – 4:20 | Continuity Report
- **What to click:** Click **"Proceed to Continuity Report"** (transitions to Stage 7).
- **What to show:** The Continuity & Narrative Verification Report.
  - Point out the metrics: **Total Checks: 10**, **Passed: 9**, **Warnings: 1**, **Errors: 0**.
  - Show the integrity banner: *"Integrity Verified: No unresolved continuity errors detected."*
  - Filter by category pills: *Character continuity*, *Costume continuity*, *Prop continuity*, *Location continuity*, *Scene ordering*.
  - Show the **"Unresolved / Requires Human Review"** section highlighting nuanced cultural sign-offs (e.g. verifying village council protocol and dialect register with native elders).
- **What to say:**
  > *"Stage 7 runs our automated continuity engine. It verifies seven distinct integrity categories—confirming that all characters appear in proper sequence, props like the brass lota persist logically from the outdoor well into the night veranda, and rejected adaptations were never leaked.*
  > *Crucially, we separate automated structural checks from nuanced cultural verification: the 'Requires Human Review' section explicitly surfaces dialect items that need native-speaker editorial sign-off."*

---

### 4:20 – 4:45 | Export & Wrap-up
- **What to click:** Click **"Proceed to Export"** (transitions to Stage 8).
- **What to show:** The Export dashboard with 4 download cards:
  1. Click **"Download cultural-adapted-screenplay.txt"** → Browser downloads file.
  2. Click **"Download cultural-adaptation-plan.json"** → Browser downloads file.
  3. Click **"Download continuity-report.txt"** → Browser downloads file.
  4. Click **"Download cultural-screenplay-project.json"** → Browser downloads file.
  - Show the green confirmation toasts appearing.
- **What to say:**
  > *"Finally, Stage 8 allows production teams to export all deliverables in clean, standard formats: the complete Devanagari script, the structured adaptation dictionary in JSON, the continuity certificate, and the full studio project bundle for archival.*
  > *The entire studio runs in under five minutes, completely locally, with full unit test coverage and zero API keys. Thank you for your time!"*
