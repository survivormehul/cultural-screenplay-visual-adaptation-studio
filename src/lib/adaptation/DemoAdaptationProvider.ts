import {
  AdaptationDecision,
  AdaptationPlan,
  AdaptationSuggestion,
  AdaptedScreenplay,
  Screenplay,
} from "@/types/domain";
import { CulturalProfile } from "@/types/adaptation";
import { TextAdaptationProvider } from "./types";
import { adaptScreenplay } from "./adaptScreenplay";

export class DemoAdaptationProvider implements TextAdaptationProvider {
  public providerId = "demo-marwari-jodhpur-v1";
  public name = "Deterministic Marwari Cultural Engine (Rural Jodhpur, Devanagari)";

  public async generatePlan(
    screenplay: Screenplay,
    profile: CulturalProfile
  ): Promise<AdaptationPlan> {
    const suggestions: AdaptationSuggestion[] = [];
    const firstScene = screenplay.scenes[0];
    const secondScene = screenplay.scenes[1];
    const thirdScene = screenplay.scenes[2];

    const s1Id = firstScene ? firstScene.id : "SCN-001";
    const s2Id = secondScene ? secondScene.id : s1Id;
    const s3Id = thirdScene ? thirdScene.id : s1Id;

    // --- SCENE 1 SUGGESTIONS ---

    // 1. Greeting/Address (Babosa)
    suggestions.push({
      id: "ADP-001",
      sceneId: s1Id,
      category: "Greeting/Address",
      original: "Father",
      proposed: "बाबोसा (Babosa / Revered Father)",
      devanagariProposed: "बाबोसा",
      rationale:
        "Contextual adaptation suggestion: In rural Marwar, an elder Rajput or village patriarch is addressed with the reverent familial title 'Babosa' rather than formal English 'Father'. Requires native-speaker/editorial validation.",
      confidence: 0.98,
      status: "pending",
    });

    // 2. Greeting/Address (Vikram-sa)
    suggestions.push({
      id: "ADP-002",
      sceneId: s1Id,
      category: "Greeting/Address",
      original: "Vikram",
      proposed: "विक्रम सा (Vikram-sa)",
      devanagariProposed: "विक्रम सा",
      rationale:
        "Contextual adaptation suggestion: Honorific suffix '-सा' appended even when addressing adult sons in traditional rural family settings to maintain conversational dignity. Requires native-speaker/editorial validation.",
      confidence: 0.92,
      status: "pending",
    });

    // 3. Dialogue/Register (Nothing left in well)
    suggestions.push({
      id: "ADP-003",
      sceneId: s1Id,
      category: "Dialogue/Register",
      original: "Because there's nothing left in it, Father.",
      proposed: "काईं कोनी बच्यो इणमें, बाबोसा।",
      devanagariProposed: "काईं कोनी बच्यो इणमें, बाबोसा।",
      rationale:
        "Contextual adaptation suggestion: Shifts urban English dialogue to rural Marwari colloquial negative 'काईं कोनी बच्यो' preserving the despondent tone. Requires native-speaker/editorial validation.",
      confidence: 0.95,
      status: "pending",
    });

    // 4. Environment (Homestead -> Sandstone Haveli Pol & Stepwell)
    suggestions.push({
      id: "ADP-004",
      sceneId: s1Id,
      category: "Environment",
      original: "EXT. ANCESTRAL HOMESTEAD - DUSK",
      proposed: "EXT. THAR HAVELI PARAPET & STEPWELL - DUSK (ग्रामीण जोधपुर हवेल़ी पोल़)",
      devanagariProposed: "EXT. थार हवेली पोल व बावड़ी - गोधूलि वेला",
      rationale:
        "Contextual adaptation suggestion: Grounds the abstract homestead into a distinctive Jodhpur red-and-yellow sandstone courtyard (पोल) adjoining an ancestral stepwell (बावड़ी). Requires native-speaker/editorial validation.",
      confidence: 0.96,
      status: "pending",
    });

    // 5. Costume (Kurta -> Angarkha & Saffron Pag)
    suggestions.push({
      id: "ADP-005",
      sceneId: s1Id,
      category: "Costume",
      original: "crisp khadi kurta",
      proposed: "Handspun Angarkha with saffron-edged Safa (केसरिया पाग) and silver ear-studs (मुरकी)",
      devanagariProposed: "अंगरखा, केसरिया पाग व मुरकी",
      rationale:
        "Contextual adaptation suggestion: Matches the traditional patriarch silhouette in rural Jodhpur where safa color indicates elder lineage authority. Requires native-speaker/editorial validation.",
      confidence: 0.94,
      status: "pending",
    });

    // 6. Props (Motorcycle -> Dust-caked Enfield with Moli charm)
    suggestions.push({
      id: "ADP-006",
      sceneId: s1Id,
      category: "Props",
      original: "vintage motorcycle",
      proposed: "Dust-caked Royal Enfield with protective red thread charm (मोली) on the handlebar",
      devanagariProposed: "रेत से सनी रॉयल एनफील्ड, मोली बंधी हुई",
      rationale:
        "Contextual adaptation suggestion: Reflects the ubiquitous vehicle choice for returning sons in rural Western Rajasthan, culturally grounded with a protective thread. Requires native-speaker/editorial validation.",
      confidence: 0.88,
      status: "pending",
    });

    // 7. Social context (Bank foreclosure -> Kudak / Sahukar debt obligation)
    suggestions.push({
      id: "ADP-007",
      sceneId: s1Id,
      category: "Social context",
      original:
        "The city bank called twice this morning. If we don't clear the mortgage on the workshop in town, they will seize the house.",
      proposed:
        "शहर रा साहूकार अर बैंक वाला दो बार तगादा कर चुक्या है। जे आपणों गिरवी नी छुड़ाया तो हवेली कुड़क हो जावेली।",
      devanagariProposed:
        "शहर रा साहूकार अर बैंक वाला दो बार तगादा कर चुक्या है। जे आपणों गिरवी नी छुड़ाया तो हवेली कुड़क हो जावेली।",
      rationale:
        "Contextual adaptation suggestion: Transforms administrative foreclosure into the rural Marwari concept of 'कुड़क' (seizure) and ancestral debt obligation. Requires native-speaker/editorial validation.",
      confidence: 0.91,
      status: "pending",
    });

    // 8. Local terminology (Dried well as temple -> Baori re saughand)
    suggestions.push({
      id: "ADP-008",
      sceneId: s1Id,
      category: "Local terminology",
      original: "In this soil, a dried well is still a temple. You don't sell the altar to pay off the carpenter.",
      proposed:
        "इण धोरों री धरती पर सूक्योड़ी बावड़ी भी मंदर है, विक्रम सा। कुलदेवता री साख बेच'र कर्जो नी चुकाईजे।",
      devanagariProposed:
        "इण धोरों री धरती पर सूक्योड़ी बावड़ी भी मंदर है, विक्रम सा। कुलदेवता री साख बेच'र कर्जो नी चुकाईजे।",
      rationale:
        "Contextual adaptation suggestion: Adapts the metaphor to Thar desert dunes ('धोरों री धरती') and sacred stepwell oath ('बावड़ी री साख'). Requires native-speaker/editorial validation.",
      confidence: 0.97,
      status: "pending",
    });

    // 9. Food (Fresh water in lota -> Chilled rainwater from underground Tanka)
    suggestions.push({
      id: "ADP-009",
      sceneId: s1Id,
      category: "Food",
      original: "brass lota of fresh water",
      proposed: "Chilled rainwater drawn from underground tank (टांका) served in an embossed kansa vessel with crushed misri",
      devanagariProposed: "टांका रो मीठो पाणी, कांसा रो लोटियो",
      rationale:
        "Contextual adaptation suggestion: In Jodhpur desert homesteads, sacred rainwater stored in covered tanks ('टांका') is offered to honored visitors. Requires native-speaker/editorial validation.",
      confidence: 0.9,
      status: "pending",
    });

    // 10. Dialogue/Register (Ancestors' sweat -> Purkhan ro paseeno)
    suggestions.push({
      id: "ADP-010",
      sceneId: s1Id,
      category: "Dialogue/Register",
      original:
        "Tell him the Singh family still draws breath, and until the sand swallows this veranda, we do not barter our ancestors' sweat.",
      proposed:
        "कैय दे उनने—जब तक सिंह खानदान री सांस चाले है, अर रेत इण पोल़ ने नी लील लेवे, म्हे पुरखां रो पसीनो कोनी बेचस्यां।",
      devanagariProposed:
        "कैय दे उनने—जब तक सिंह खानदान री सांस चाले है, अर रेत इण पोल़ ने नी लील लेवे, म्हे पुरखां रो पसीनो कोनी बेचस्यां।",
      rationale:
        "Contextual adaptation suggestion: Culminating dramatic oath in Marwari vernacular preserving heroic stoicism ('पुरखां रो पसीनो कोनी बेचस्यां'). Requires native-speaker/editorial validation.",
      confidence: 0.99,
      status: "pending",
    });

    // --- SCENE 2 & 3 CONTEXTUAL SUGGESTIONS (if multi-scene) ---
    if (secondScene) {
      suggestions.push({
        id: "ADP-011",
        sceneId: s2Id,
        category: "Environment",
        original: "INT. HAVELI VERANDA - NIGHT",
        proposed: "INT. SANDSTONE HAVELI VERANDA - NIGHT (हवेली रो ओटो - रात)",
        devanagariProposed: "INT. हवेली रो ओटो - रात री वेला",
        rationale:
          "Contextual adaptation suggestion: Specifies the interior courtyard veranda ('ओटो') built from native Jodhpur Chhitar sandstone. Requires native-speaker/editorial validation.",
        confidence: 0.94,
        status: "pending",
      });

      suggestions.push({
        id: "ADP-012",
        sceneId: s2Id,
        category: "Props",
        original: "bank mortgage notice",
        proposed: "कर्ज रो तगादा फरमान (Sealed mortgage decree)",
        devanagariProposed: "कर्ज रो तगादा फरमान",
        rationale:
          "Contextual adaptation suggestion: References the document with the formal Marwari administrative term 'तगादा फरमान'. Requires native-speaker/editorial validation.",
        confidence: 0.89,
        status: "pending",
      });
    }

    if (thirdScene) {
      suggestions.push({
        id: "ADP-013",
        sceneId: s3Id,
        category: "Environment",
        original: "EXT. STEPWELL PERIMETER - DAWN",
        proposed: "EXT. STEPWELL PERIMETER - DAWN (बावड़ी रो काठो - प्रभात)",
        devanagariProposed: "EXT. बावड़ी रो काठो - प्रभात वेला",
        rationale:
          "Contextual adaptation suggestion: Uses the regional waterbody boundary term 'काठो' (perimeter/embankment) at first light. Requires native-speaker/editorial validation.",
        confidence: 0.93,
        status: "pending",
      });

      suggestions.push({
        id: "ADP-014",
        sceneId: s3Id,
        category: "Social context",
        original: "village council",
        proposed: "गांवा री चौपाल अर पंच-पटेल (Panchayat elders)",
        devanagariProposed: "गांवा री चौपाल अर पंच-पटेल",
        rationale:
          "Contextual adaptation suggestion: References rural community authority by invoking 'चौपाल' and respected village elders ('पंच-पटेल'). Requires native-speaker/editorial validation.",
        confidence: 0.96,
        status: "pending",
      });
    }

    return {
      planId: `PLAN-${Date.now()}`,
      cultureProfileId: "marwari-rural-jodhpur",
      targetCulture: profile.targetCulture,
      targetDialect: profile.targetDialect,
      script: profile.script,
      region: profile.region,
      suggestions,
      totalSuggestions: suggestions.length,
      generatedAt: new Date().toISOString(),
    };
  }

  public async generateAdaptation(
    screenplay: Screenplay,
    plan: AdaptationPlan,
    decisions: Record<string, AdaptationDecision>
  ): Promise<AdaptedScreenplay> {
    return adaptScreenplay(screenplay, plan, decisions);
  }
}
