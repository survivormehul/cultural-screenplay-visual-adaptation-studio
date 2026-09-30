# Sample Pipeline Output Artifacts

This document provides a static, representative end-to-end trace of a scene as it moves through every stage of the **Cultural Screenplay & Visual Adaptation Studio** pipeline, clearly distinguishing between:
1. **Deterministic Structured Output** (Parser, Canonical Graph, Continuity Audit)
2. **Gemini-Generated Adaptation** (`gemini-2.5-flash` Cultural Plan & Devanagari Screenplay)
3. **Gemini-Generated Visual Assets** (`gemini-3.1-flash-image` Visual Production Pack)

---

## Complete Pipeline Trace

```text
Original Screenplay Input
      │
      ▼
1. Deterministic Structure Extraction (Regex & State Machine)
      │
      ▼
2. Gemini Cultural Adaptation Plan (Gemini 2.5 Flash)
      │
      ▼
3. Human Decision Log (Approval Gate Audit)
      │
      ▼
4. Gemini Adapted Screenplay Output (Devanagari Marwari)
      │
      ▼
5. Gemini Visual Production Pack (Gemini 3.1 Flash Image · 35mm)
      │
      ▼
6. Deterministic Continuity Verification (Rule Engine)
```

---

### 1. Original Scene Input

```screenplay
EXT. ANCESTRAL HOMESTEAD - DUSK

The low sun casts long copper shadows across the cracked earth. In the distance, dry thorny acacia trees bow to the desert wind.

A weathered stone well stands at the center of the clearing.

VIKRAM (40s, dust-stained denim shirt, tired city posture) stands by his vintage motorcycle. He stares down into the dry basin of the well.

His father, THAKUR BHAWANI SINGH (70s, crisp khadi kurta, sharp hawk-like gaze) walks out from the shaded veranda. He holds a brass lota of fresh water.

BHAWANI
You haven't looked into that well since your mother passed, Vikram.

VIKRAM
(without looking back)
Because there's nothing left in it, Father. The government geologists told you three years ago—the water table is dead.
```

---

### 2. Deterministic Structure Extraction (Canonical Domain Model)

*Engine: Deterministic State-Machine Parser (`src/lib/parser/screenplayParser.ts`)*

```json
{
  "sceneId": "SCN-001",
  "sceneNumber": 1,
  "heading": "EXT. ANCESTRAL HOMESTEAD - DUSK",
  "interiorExterior": "EXT.",
  "location": "ANCESTRAL HOMESTEAD",
  "timeOfDay": "DUSK",
  "characters": [
    {
      "id": "CHR-001",
      "name": "VIKRAM",
      "description": "40s, dust-stained denim shirt, tired city posture",
      "dialogueCount": 3
    },
    {
      "id": "CHR-002",
      "name": "THAKUR BHAWANI SINGH",
      "description": "70s, crisp khadi kurta, sharp hawk-like gaze",
      "dialogueCount": 3
    }
  ],
  "props": [
    { "id": "PROP-001", "name": "weathered stone well" },
    { "id": "PROP-002", "name": "vintage motorcycle" },
    { "id": "PROP-003", "name": "brass lota of fresh water" }
  ]
}
```

---

### 3. Gemini Cultural Adaptation Suggestions

*Engine: Generative LLM (`gemini-2.5-flash` via `@google/genai`)*

```json
[
  {
    "id": "ADP-001",
    "sceneId": "SCN-001",
    "category": "Greeting/Address",
    "original": "Father",
    "proposed": "बाबोसा (Babosa / Revered Father)",
    "devanagariProposed": "बाबोसा",
    "rationale": "In rural Marwar, elder Rajput patriarchs are reverently addressed with the familial title 'Babosa' rather than formal English 'Father'.",
    "confidence": 0.98,
    "status": "pending"
  },
  {
    "id": "ADP-002",
    "sceneId": "SCN-001",
    "category": "Greeting/Address",
    "original": "Vikram",
    "proposed": "विक्रम सा (Vikram-sa)",
    "devanagariProposed": "विक्रम सा",
    "rationale": "Honorific suffix '-सा' appended even when addressing adult sons in traditional rural family settings to maintain conversational dignity.",
    "confidence": 0.92,
    "status": "pending"
  },
  {
    "id": "ADP-003",
    "sceneId": "SCN-001",
    "category": "Dialogue/Register",
    "original": "Because there's nothing left in it, Father.",
    "proposed": "काईं कोनी बच्यो इणमें, बाबोसा।",
    "devanagariProposed": "काईं कोनी बच्यो इणमें, बाबोसा।",
    "rationale": "Shifts urban English dialogue to rural Marwari colloquial negative 'काईं कोनी बच्यो' preserving the despondent tone.",
    "confidence": 0.95,
    "status": "pending"
  },
  {
    "id": "ADP-005",
    "sceneId": "SCN-001",
    "category": "Costume",
    "original": "crisp khadi kurta",
    "proposed": "Handspun Angarkha with saffron-edged Safa (केसरिया पाग) and silver ear-studs (मुरकी)",
    "devanagariProposed": "अंगरखा, केसरिया पाग व मुरकी",
    "rationale": "Matches the traditional patriarch silhouette in rural Jodhpur where safa color indicates elder lineage authority.",
    "confidence": 0.94,
    "status": "pending"
  }
]
```

---

### 4. Human Decision Log (Approval Gate Audit)

*Engine: Editorial Governance Filter (`src/components/ApprovalPanel.tsx`)*

```json
{
  "ADP-001": {
    "suggestionId": "ADP-001",
    "status": "approved",
    "decidedAt": "2026-09-30T17:20:00.000Z",
    "note": "Approved standard Marwari filial address"
  },
  "ADP-002": {
    "suggestionId": "ADP-002",
    "status": "approved",
    "decidedAt": "2026-09-30T17:20:02.000Z",
    "note": "Approved respectful filial suffix -sa"
  },
  "ADP-003": {
    "suggestionId": "ADP-003",
    "status": "approved",
    "decidedAt": "2026-09-30T17:20:05.000Z",
    "note": "Approved colloquial negative construction"
  },
  "ADP-005": {
    "suggestionId": "ADP-005",
    "status": "edited",
    "editedValue": "अंगरखा, केसरिया पाग व मुरकी",
    "decidedAt": "2026-09-30T17:20:12.000Z",
    "note": "Verified costume anchors with production designer"
  }
}
```

---

### 5. Gemini Adapted Screenplay Output (Devanagari Marwari)

*Engine: Generative LLM (`gemini-2.5-flash` via `/api/adapt/screenplay`)*

```screenplay
--------------------------------------------------------------------------------
SCENE 1 (SCN-001)
ORIGINAL: EXT. ANCESTRAL HOMESTEAD - DUSK
ADAPTED:  EXT. थार हवेली पोल व बावड़ी - गोधूलि वेला
TIME:     DUSK | LOCATION: ANCESTRAL HOMESTEAD
APPLIED ADAPTATIONS: [ADP-001, ADP-002, ADP-003, ADP-004, ADP-005, ADP-006, ADP-007, ADP-008]
--------------------------------------------------------------------------------

[ACTION]
The low sun casts long copper shadows across the cracked earth. In the distance, dry thorny acacia trees bow to the desert wind.
A weathered stone well stands at the center of the clearing.
VIKRAM (40s, dust-stained denim shirt, tired city posture) stands by his vintage motorcycle. He stares down into the dry basin of the well.
His father, THAKUR BHAWANI SINGH (70s, अंगरखा, केसरिया पाग व मुरकी, sharp hawk-like gaze) walks out from the shaded veranda. He holds a brass lota of fresh water.

[DIALOGUE & ADAPTED REGISTER]
THAKUR BHAWANI SINGH (CHR-002):
  [Devanagari]: थाऱी माँ रे जाबा पछे तूं इण बावड़ी में कदे नीं झांक्यो, विक्रम सा।
  [English/Marwari]: You haven't looked into that well since your mother passed, Vikram-sa.
  (Applied: ADP-002)

VIKRAM (CHR-001) (without looking back):
  [Devanagari]: काईं कोनी बच्यो इणमें, बाबोसा। The government geologists told you three years ago—the water table is dead.
  [English/Marwari]: Because there's nothing left in it, Babosa. The government geologists told you three years ago—the water table is dead.
  (Applied: ADP-001, ADP-003)
```

---

### 6. Gemini Visual Production Pack & Image Asset (Sample Schema)

*Engine: Gemini Image Model (`gemini-3.1-flash-image` via `/api/visuals/*`)*  
*(Note: Visual prompt synthesis and package assembly are live. Live image generation requires an active Google AI Studio billing/quota tier; free-tier requests encounter Google's 429 RESOURCE_EXHAUSTED / limit: 0; see [`docs/LIMITATIONS.md`](LIMITATIONS.md).)*

```json
{
  "visualId": "VIS-SCN-001",
  "sceneId": "SCN-001",
  "subject": "Dramatic confrontation between elder patriarch Bhawani Singh and returning son Vikram by an ancestral stepwell",
  "environment": "Rural Thar desert fringe near Jodhpur, cracked arid clay soil, distant thorny Khejri trees",
  "architecture": "Weathered golden-yellow sandstone haveli verandah (पोल), dry subterranean baori (stepwell)",
  "costume": "Bhawani in handspun off-white Angarkha and saffron safa; Vikram in dusty denim workshirt",
  "props": "Ornate brass lota resting on parapet stone, dust-caked Royal Enfield with sacred moli thread",
  "lighting": "Dusk atmospheric light (गोधूलि वेला), low-angled copper sun rays casting elongated shadows",
  "camera": "Cinematic wide angle, 35mm anamorphic, eye-level with the stepwell parapet",
  "finalPrompt": "Cinematic film still, 35mm anamorphic. EXT. THAR DESERT STEPWELL - DUSK. In a rural Rajasthani hamlet near Jodhpur, an elderly patriarch (70s, sharp features, crisp off-white Angarkha, saffron safa turban) stands firm on a yellow sandstone stepwell parapet. Across from him, his estranged son (40s, dusty western denim, world-weary) leans against a vintage motorcycle. Low golden hour dusk sun, dust particles gleaming in warm amber light, ancient dry stone baori, deep cultural gravitas, photorealistic cinematic lighting, Arri Alexa Mini LF, 8k resolution.",
  "imageUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...",
  "imageGeneratedAt": "2026-09-30T17:21:40.000Z",
  "isLiveAiGenerated": true
}
```

---

### 7. Deterministic Continuity Verification

*Engine: Automated Rule Engine (`src/lib/continuity/continuityChecker.ts`)*

```json
{
  "reportId": "CON-REP-1727710000",
  "timestamp": "2026-09-30T17:22:00.000Z",
  "totalChecks": 10,
  "passed": 9,
  "warnings": 1,
  "errors": 0,
  "checks": [
    {
      "id": "CON-001",
      "category": "Character continuity",
      "sceneOrEntityId": "CHR-001",
      "status": "PASSED",
      "severity": "PASS",
      "message": "Character VIKRAM (CHR-001) successfully preserved across all adapted scenes."
    },
    {
      "id": "CON-002",
      "category": "Character continuity",
      "sceneOrEntityId": "CHR-002",
      "status": "PASSED",
      "severity": "PASS",
      "message": "Character THAKUR BHAWANI SINGH (CHR-002) successfully preserved across all adapted scenes."
    },
    {
      "id": "CON-003",
      "category": "Prop continuity",
      "sceneOrEntityId": "PROP-003",
      "status": "PASSED",
      "severity": "PASS",
      "message": "Key prop 'brass lota' persists from SCN-001 (exterior stepwell) into SCN-002 (interior veranda takhat)."
    },
    {
      "id": "CON-004",
      "category": "Scene ordering",
      "sceneOrEntityId": "SCN-001",
      "status": "PASSED",
      "severity": "PASS",
      "message": "Chronological progression intact: SCN-001 (Dusk) -> SCN-002 (Night) -> SCN-003 (Dawn)."
    },
    {
      "id": "CON-005",
      "category": "Adaptation continuity",
      "sceneOrEntityId": "ADP-001",
      "status": "FLAGGED",
      "severity": "WARNING",
      "message": "Term 'बाबोसा' used in SCN-001 and SCN-002; verify register remains uniform across remaining script lines."
    }
  ],
  "unresolvedItems": [
    "Verify village council (पंचायती) protocol in Scene 3 matches contemporary rural Jodhpur administrative reality.",
    "Editorial sign-off needed for phonetic vocal register of 'कुड़क' (debt foreclosure) before dialogue coaching."
  ]
}
```
