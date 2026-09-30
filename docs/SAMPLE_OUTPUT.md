# Sample Pipeline Output Artifact

This document provides a static, representative end-to-end trace of a single scene as it moves through every stage of the **Cultural Screenplay & Visual Adaptation Studio** pipeline.

---

## Complete Pipeline Trace

```
Original Scene
      │
      ▼
Extracted Structure
      │
      ▼
Cultural Suggestion
      │
      ▼
Human Decision
      │
      ▼
Adapted Screenplay Output
      │
      ▼
Visual Prompt Package
      │
      ▼
Continuity Result
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

### 2. Extracted Structure (Canonical Domain Model)

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

### 3. Cultural Adaptation Suggestions

```json
[
  {
    "id": "ADP-001",
    "sceneId": "SCN-001",
    "category": "Greeting/Address",
    "original": "Father",
    "proposed": "बाबोसा (Babosa / Revered Father)",
    "devanagariProposed": "बाबोसा",
    "rationale": "Contextual adaptation suggestion: In rural Marwar, an elder Rajput or village patriarch is addressed with the reverent familial title 'Babosa' rather than formal English 'Father'. Requires native-speaker/editorial validation.",
    "confidence": 0.98,
    "status": "pending"
  },
  {
    "id": "ADP-003",
    "sceneId": "SCN-001",
    "category": "Dialogue/Register",
    "original": "Because there's nothing left in it, Father.",
    "proposed": "काईं कोनी बच्यो इणमें, बाबोसा।",
    "devanagariProposed": "काईं कोनी बच्यो इणमें, बाबोसा।",
    "rationale": "Contextual adaptation suggestion: Shifts urban English dialogue to rural Marwari colloquial negative 'काईं कोनी बच्यो' preserving the despondent tone. Requires native-speaker/editorial validation.",
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
    "rationale": "Contextual adaptation suggestion: Matches the traditional patriarch silhouette in rural Jodhpur where safa color indicates elder lineage authority. Requires native-speaker/editorial validation.",
    "confidence": 0.94,
    "status": "pending"
  }
]
```

---

### 4. Human Decision (Approval Gate Log)

```json
{
  "ADP-001": {
    "suggestionId": "ADP-001",
    "status": "approved",
    "decidedAt": "2026-09-30T17:20:00.000Z",
    "note": "Approved standard Marwari filial address"
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

### 5. Adapted Screenplay Output (Devanagari Marwari)

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

### 6. Visual Concept Prompt Package

```json
{
  "visualId": "VIS-SCN-001",
  "sceneId": "SCN-001",
  "subject": "Dramatic exterior standoff between Vikram (dusty jeans, city jacket) and his father Thakur Bhawani Singh (elderly patriarch in saffron safa and handspun angarkha) by an ancestral stone stepwell",
  "environment": "Ancestral sandstone compound, dry Thar desert basin, Jodhpur rural outskirts",
  "architecture": "Jodhpur yellow sandstone carved arches, weathered stone well parapet, dry thorny acacia perimeter",
  "costume": "Bhawani in handspun Angarkha, saffron-edged Safa (पाग), silver ear-studs (मुरकी); Vikram in dust-streaked western denim and heavy boots",
  "props": "Brass water lota reflecting dusk light, dust-caked Royal Enfield motorcycle",
  "lighting": "Godhuli Bela (गोधूलि वेला) — low raking copper desert twilight with long deep-blue shadows",
  "mood": "Stark emotional gravity, filial friction, ancestral dignity under existential drought",
  "camera": "Arri Alexa LF, Cooke Anamorphic/i Full Frame Plus 40mm T2.3",
  "framing": "Wide establishing angle, 2.39:1 cinemascope, low ground perspective accentuating dry cracked earth in foreground",
  "culturalConstraints": [
    "Patriarch safa must be authentically tied in Marwari/Jodhpur style, not ceremonial Bollywood turban",
    "Brass lota held with traditional ritual care, resting on parapet stone",
    "Sandstone haveli facade must show characteristic desert wind erosion and carved brackets"
  ],
  "continuityConstraints": [
    "Bhawani holds brass lota in SCN-001; must carry same lota into SCN-002 night veranda",
    "Vikram wears denim jacket with dust patterns consistent across SCN-001 and SCN-002"
  ],
  "finalPrompt": "Cinematic 35mm film still, 2.39:1 cinemascope aspect ratio. EXT. THAR DESERT STEPWELL OUTSKIRTS - DUSK (गोधूलि वेला). Dramatic wide confrontation between elder Rajput patriarch Thakur Bhawani Singh (70s, weathered regal face, handspun beige Angarkha, tightly bound saffron-edged Safa turban, silver murki ear-studs) holding a traditional brass water vessel, and his urbanized son Vikram (40s, dust-stained denim shirt, weary city posture) standing near a vintage dust-caked Enfield motorcycle. Foreground shows dry cracked soil and deep red-yellow sandstone well parapet. Background features open Thar scrubland under a vibrant copper-to-cobalt dusk sky. Shot on Arri Alexa LF with Cooke Anamorphic 40mm lens, natural desert twilight, ultra-detailed architectural texture, master cinematography --ar 21:9 --v 6.1 --style raw"
}
```

---

### 7. Continuity Verification Result

```json
{
  "reportId": "CON-REP-1727710000",
  "timestamp": "2026-09-30T17:21:00.000Z",
  "totalChecks": 10,
  "passed": 9,
  "warnings": 1,
  "errors": 0,
  "checks": [
    {
      "id": "CON-001",
      "category": "Character continuity",
      "sceneOrEntityId": "CHR-001",
      "status": "Verified",
      "severity": "PASS",
      "message": "Character VIKRAM (CHR-001) successfully preserved across all adapted scenes."
    },
    {
      "id": "CON-002",
      "category": "Character continuity",
      "sceneOrEntityId": "CHR-002",
      "status": "Verified",
      "severity": "PASS",
      "message": "Character THAKUR BHAWANI SINGH (CHR-002) successfully preserved across all adapted scenes."
    },
    {
      "id": "CON-003",
      "category": "Prop continuity",
      "sceneOrEntityId": "PROP-003",
      "status": "Verified",
      "severity": "PASS",
      "message": "Key prop 'brass lota' persists from SCN-001 (exterior stepwell) into SCN-002 (interior veranda takhat)."
    },
    {
      "id": "CON-004",
      "category": "Scene ordering",
      "sceneOrEntityId": "SCN-001",
      "status": "Verified",
      "severity": "PASS",
      "message": "Chronological progression intact: SCN-001 (Dusk) -> SCN-002 (Night) -> SCN-003 (Dawn)."
    },
    {
      "id": "CON-005",
      "category": "Dialect consistency",
      "sceneOrEntityId": "ADP-001",
      "status": "Flagged",
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
