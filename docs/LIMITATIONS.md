# Known Limitations, Operational Scope & Boundaries

This document records the architectural boundaries, API dependencies, and operational limitations of the **Cultural Screenplay & Visual Adaptation Studio**.

---

## 1. External AI API Dependency & Quota Constraints

- **Gemini API Dependency:** Live cultural adaptation planning and real image synthesis require connectivity to Google Gemini's API servers. If the host machine is offline or if network access is restricted, the studio automatically relies on the deterministic local fallback engine.
- **API Quotas & Rate Limits:** Free-tier or standard Google AI Studio Gemini API keys enforce queries-per-minute (QPM) and daily token quotas. If rate limits are exceeded during rapid multi-image generation, the API returns descriptive error notices, and single-card retry controls allow regenerating individual items once quotas reset.
- **Model Availability Lifecycle:** Google updates and deprecates model names over time. While the current defaults (`gemini-2.5-flash` and `gemini-3.1-flash-image`) represent current stable production models, environment variables (`GEMINI_TEXT_MODEL` and `GEMINI_IMAGE_MODEL`) allow studio administrators to update model IDs without modifying application source code.

---

## 2. Cultural & Dialect Precision Requires Native-Speaker Review

- **Linguistic Nuances:** Marwari is a rich language with regional and community sub-dialects (e.g. Jodhpur city dialect vs. rural Thar desert Thali). While Gemini 2.5 Flash produces strong, grammatically sound Devanagari text, regional idioms and sacred oath formulas require native-speaker sign-off before production audio dubbing or dialect coaching.
- **Social Context & Sensitivity:** Honorific registers, caste dynamics, and marital kinship terms (such as *हुकम*, *बाबोसा*, *बन्ना*, *सा*) carry nuanced social significance. The studio's **Human Approval Gate** is an intentional architectural necessity rather than an optional step—AI suggestions must be reviewed by human dramaturgs.

---

## 3. Visual Asset Generation & Consistency Limitations

- **Cross-Image Facial Likeness:** In zero-shot text-to-image synthesis, generating the identical face across multiple angles without LoRA fine-tuning, IP-Adapter, or ControlNet reference conditioning has inherent variance.
- **Text Rendering in Visuals:** Image diffusion models may struggle to render complex signage or specific Devanagari calligraphy accurately inside visual frames.
- **Aspect Ratio & Framing:** Visual concept frames default to standard 16:9 cinematic landscape or 3:4 portrait ratios. Advanced shot matching for custom anamorphic sensor gate dimensions requires post-production framing adjustments.

---

## 4. State Persistence & Storage Scope

- **In-Memory Session Lifecycle:** Active screenplay parsing, adaptation decisions, generated images, and continuity checks are stored in client-side React session state. Refreshing the browser window clears the current in-memory workspace.
- **Serialization & Archival:** To preserve work across sessions, users must download the **Complete Project Bundle (.json)** via the Export stage, which serializes all canonical entities, adaptation plans, human decisions, and continuity findings.
- **Zero Heavy Disk Storage on Server:** Generated image Data URLs are held directly in the client workspace, avoiding massive server storage bloat or database overhead in local deployments.

---

## 5. Screenplay Ingestion & PDF Handling

- **PDF Ingestion Scope:** The file upload interface detects `.pdf` files, reads document metadata (filename, byte size, timestamp), and prompts the user to paste or supply `.txt` text. Server-side binary PDF rasterization and OCR are not included in this release.
- **Formatting Conventions:** The deterministic parser assumes standard industry sluglines (`INT.`, `EXT.`, `INT./EXT.`), uppercase character cues, and standard dialogue blocks. Irregularly formatted stage plays or unindented transcripts are routed to `unresolvedItems` for human resolution.
