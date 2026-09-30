import { CulturalProfile, WorkflowStep } from "@/types/adaptation";

export const ACTIVE_CULTURAL_PROFILE: CulturalProfile = {
  targetCulture: "Rajasthani (Marwar)",
  targetDialect: "Marwari (मारवाड़ी)",
  script: "Devanagari (देवनागरी)",
  region: "Rural Jodhpur (ग्रामीण जोधपुर)",
  periodAndSetting: "Contemporary Rural Thar, Sandstone Hamlets & Ancestral Havelis",
  dialectMarkers: [
    "खम्मा घणी (Greetings / Reverence)",
    "हुकम / सा (Honorific suffixes)",
    "कांई खबर? (What is the news?)",
    "म्हाने / थ्हाने (To me / To you)",
    "बावड़ी री सौगंध (Oath of the ancestral stepwell)",
  ],
  architecturalContext: [
    "Jodhpur yellow & red sandstone courtyards",
    "Carved Jharokhas & stone brackets",
    "Stepwell (बावड़ी) gathering perimeter",
    "Open earthen verandah (ओटा / पोल)",
  ],
  attireContext: [
    "Bandhej & Leheriya Turbans (पगड़ी / साफा)",
    "Angarkha & Dhoti with silver amulets",
    "Gotta-patti Odhani with silver Hasli",
  ],
  socioCulturalNotes:
    "Contextual baseline: Familial hierarchy governed by filial reverence, customary village panchayat protocol, water rights sanctity, and understated desert resilience. Note: Contextual adaptation suggestion requiring native-speaker/editorial validation.",
};

export const WORKFLOW_STAGES: WorkflowStep[] = [
  {
    id: "input",
    number: 1,
    label: "Screenplay Input",
    shortDescription: "Script ingest (.txt/.pdf) & text validation",
    status: "active",
    isEngineConnected: true,
  },
  {
    id: "extraction",
    number: 2,
    label: "Structure Extraction",
    shortDescription: "Scene headings, character arcs, beat sheets",
    status: "pending",
    isEngineConnected: true,
  },
  {
    id: "plan",
    number: 3,
    label: "Cultural Adaptation Plan",
    shortDescription: "Dialect lexicon, socio-cultural shift matrix",
    status: "pending",
    isEngineConnected: true,
  },
  {
    id: "approval",
    number: 4,
    label: "Human Approval",
    shortDescription: "Editorial sign-off on dialect & customs",
    status: "locked",
    isEngineConnected: true,
  },
  {
    id: "adapted",
    number: 5,
    label: "Adapted Screenplay",
    shortDescription: "Devanagari Marwari screenplay generation",
    status: "locked",
    isEngineConnected: true,
  },
  {
    id: "visuals",
    number: 6,
    label: "Visual Generation",
    shortDescription: "Jodhpur architectural & costume concept art",
    status: "locked",
    isEngineConnected: true,
  },
  {
    id: "continuity",
    number: 7,
    label: "Continuity Report",
    shortDescription: "Cross-scene dialect & character consistency audit",
    status: "locked",
    isEngineConnected: true,
  },
  {
    id: "export",
    number: 8,
    label: "Export",
    shortDescription: "Production scripts & JSON archive bundle",
    status: "locked",
    isEngineConnected: true,
  },
];

export const DEMO_SCREENPLAY_DISCLAIMER =
  "Original demo screenplay created for this prototype. Not supplied by STAGE.";

export const SAMPLE_SCREENPLAY = `EXT. ANCESTRAL HOMESTEAD - DUSK

The low sun casts long copper shadows across the cracked earth. In the distance, dry thorny acacia trees bow to the desert wind.

A weathered stone well stands at the center of the clearing.

VIKRAM (40s, dust-stained denim shirt, tired city posture) stands by his vintage motorcycle. He stares down into the dry basin of the well.

His father, THAKUR BHAWANI SINGH (70s, crisp khadi kurta, sharp hawk-like gaze) walks out from the shaded veranda. He holds a brass lota of fresh water.

BHAWANI
You haven't looked into that well since your mother passed, Vikram.

VIKRAM
(without looking back)
Because there's nothing left in it, Father. The government geologists told you three years ago—the water table is dead.

BHAWANI
The stone was placed by your great-grandfather in the famine of 1936. When seven villages had no grain, this well fed thirty families. You want me to sell the surrounding fifteen acres to a solar company for quick cash?

VIKRAM
It's not quick cash! It's survival. The city bank called twice this morning. If we don't clear the mortgage on the workshop in town, they will seize the house.

Bhawani places the brass lota slowly onto the parapet stone. He looks at his son not with anger, but with profound disappointment.

BHAWANI
In town you buy water in plastic bottles and call it progress. In this soil, a dried well is still a temple. You don't sell the altar to pay off the carpenter.

Vikram clenches his fists. The wind picks up sand around their boots.

VIKRAM
Then tell me what to tell the bailiff on Monday!

Bhawani looks toward the distant horizon where the dusk stars are just beginning to pierce the cobalt sky.

BHAWANI
Tell him the Singh family still draws breath, and until the sand swallows this veranda, we do not barter our ancestors' sweat.

INT. HAVELI VERANDA - NIGHT

A flickering kerosene lantern hangs from a carved wooden beam, casting amber light across the weathered sandstone floor.

Vikram sits on a wooden takhat, spreading out a folded bank mortgage notice.

Bhawani enters carrying the same brass lota and two earthen tumblers.

VIKRAM
They're giving us forty-eight hours, Father. The bank notice is legal.

BHAWANI
Paper written in an office five hundred miles away does not outweigh seventy years of water given freely to anyone who passed this road.

Bhawani fills both tumblers with cool water from the lota. He slides one across the takhat to Vikram.

VIKRAM
We can't drink pride when the well is dry.

BHAWANI
We drink patience, Vikram. Tomorrow at first light, we open the lower sluice stone.

EXT. STEPWELL PERIMETER - DAWN

The cold Thar dawn breaks in pale violet and gold. A chill breeze sweeps across the sandstone perimeter.

Vikram and Bhawani stand side by side at the stepwell parapet. Vikram holds a heavy iron pry bar; Bhawani holds the coiled hemp rope.

VIKRAM
If there's no water at the bottom, Father?

Bhawani places a weathered hand on Vikram's shoulder.

BHAWANI
Then the village council meets at noon, and we face them with clean hands and unbowed heads. Together.

Vikram looks at the iron bar, then nods firmly. He wedges the bar beneath the ancestral sluice stone.

FADE OUT.`;
