# Known Limitations & Reviewer Considerations

This document records the intentional boundaries and known limitations of the **Cultural Screenplay & Visual Adaptation Studio** demo milestone.

---

## 1. Script Parsing Boundaries
- **Supported Formats:** Plain text (`.txt`) and direct editor pasting.
- **PDF Handling:** The file upload control captures PDF file metadata (filename, byte size, timestamp) and guides the user to paste script text. Binary PDF parsing via server-side libraries (e.g., `pdf-parse`) is not integrated in this client-side demo milestone.
- **Formatting Expectations:** The parser relies on standard screenplay formatting conventions:
  - Scene headings prefixed by `INT.`, `EXT.`, `INT./EXT.`, or `I/E.`
  - Character cues formatted in uppercase lines followed by dialogue blocks.
  - Non-standard formatting (e.g. stage plays with character names followed by colons on the same line) is categorized into the `unresolvedItems` collection for editorial review.

---

## 2. Dialect & Linguistic Coverage
- **Controlled Demo Lexicon:** The `DemoAdaptationProvider` uses a curated set of 14 high-impact cultural adaptation rules covering all 8 required categories (Greetings, Dialogue, Environment, Costume, Props, Food, Social Context, Local Terminology). It does not claim comprehensive translation of arbitrary text.
- **Devanagari Orthography Notice:** While output dialogues are rendered in authentic Devanagari script (e.g., *बाबोसा*, *खम्मा घणी*, *धोरों री धरती*, *बावड़ी री साख*), native-speaker phonetic sign-off is required before using text for dialogue coaching or vocal dubbing.
- **Single Active Profile:** The current milestone targets **Marwari (Rural Jodhpur)**. Additional dialect packs (Braj Bhasha, Maithili, Awadhi, Bhojpuri) are architectural stubs for future milestones.

---

## 3. Visual & Diffusion Pipeline
- **Prompt Generation Only:** Visual packages produce comprehensive prompt specifications (subject, environment, lighting, camera angles, 35mm anamorphic framing, cultural constraints, continuity rules) with a one-click copy button.
- **No Live Diffusion Calls:** To avoid requiring external API credentials or paid GPU endpoints, image generation is not executed live. The concept artboard displays an aesthetic framed placeholder.

---

## 4. State Persistence
- **In-Memory Session State:** State is maintained within the React application lifecycle.
- **Reset & Replay:** The application provides a **"Load Demo Project"** accelerator to pre-populate all 8 stages instantly, and a **"Reset Project"** button to restart the workflow from a clean state.
- **Exported Archives:** Persistence across sessions is achieved through the **Complete Project Bundle (.json)** export feature, which serializes the entire studio state.
