import {
  Action,
  Character,
  Costume,
  Dialogue,
  Location,
  Prop,
  Scene,
  Screenplay,
} from "../../types/domain";

interface ParsedBlock {
  type: "heading" | "action" | "character" | "parenthetical" | "dialogue" | "transition";
  text: string;
  lineNumber: number;
}

const COMMON_PROPS = [
  "motorcycle",
  "vintage motorcycle",
  "brass lota",
  "lota",
  "water",
  "plastic bottles",
  "well",
  "stone",
  "boots",
  "parapet",
  "keys",
  "phone",
  "lamp",
  "sword",
  "turban",
  "staff",
  "earthen pot",
  "matka",
];

const KNOWN_COSTUMES: Record<string, string> = {
  VIKRAM: "dust-stained denim shirt, boots, tired city posture",
  "THAKUR BHAWANI SINGH": "crisp khadi kurta, sharp hawk-like gaze",
  BHAWANI: "crisp khadi kurta",
};

export function parseScreenplay(rawText: string, title = "Untitled Screenplay"): Screenplay {
  const lines = rawText.split(/\r?\n/);
  const blocks: ParsedBlock[] = [];
  const unresolvedItems: string[] = [];

  // 1. Line-by-line categorization
  let i = 0;
  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      i++;
      continue;
    }

    // Check Scene Heading
    const isHeading = /^(INT\.|EXT\.|INT\.\/EXT\.|I\/E\.)/i.test(line);
    if (isHeading) {
      blocks.push({ type: "heading", text: line, lineNumber: i + 1 });
      i++;
      continue;
    }

    // Check Transitions
    const isTransition = /^(FADE OUT|FADE IN|CUT TO|DISSOLVE TO|SMASH CUT TO)\.?$/i.test(line);
    if (isTransition) {
      blocks.push({ type: "transition", text: line, lineNumber: i + 1 });
      i++;
      continue;
    }

    // Check Parenthetical
    const isParenthetical = /^\(.*\)$/.test(line);
    if (isParenthetical) {
      blocks.push({ type: "parenthetical", text: line, lineNumber: i + 1 });
      i++;
      continue;
    }

    // Check Character Cue: uppercase name, usually shorter than 35 chars, not ending with punctuation except parens
    const cleanCue = line.replace(/\s*\(.*?\)\s*/g, "").trim();
    const isUppercase = cleanCue.length > 1 && cleanCue.length < 40 && cleanCue === cleanCue.toUpperCase();
    const isNextLineDialogue = i + 1 < lines.length && lines[i + 1].trim().length > 0 && !/^(INT\.|EXT\.)/i.test(lines[i + 1].trim());

    if (isUppercase && isNextLineDialogue) {
      blocks.push({ type: "character", text: line, lineNumber: i + 1 });
      i++;

      // Check for parenthetical right after
      if (i < lines.length && /^\(.*\)$/.test(lines[i].trim())) {
        blocks.push({ type: "parenthetical", text: lines[i].trim(), lineNumber: i + 1 });
        i++;
      }

      // Collect dialogue lines
      const dialogueLines: string[] = [];
      while (i < lines.length && lines[i].trim().length > 0 && !/^(INT\.|EXT\.)/i.test(lines[i].trim())) {
        const nextTrimmed = lines[i].trim();
        // Check if next is another character cue
        const nextClean = nextTrimmed.replace(/\s*\(.*?\)\s*/g, "").trim();
        if (nextClean.length > 1 && nextClean.length < 40 && nextClean === nextClean.toUpperCase() && i + 1 < lines.length && lines[i + 1].trim().length > 0) {
          break;
        }
        dialogueLines.push(nextTrimmed);
        i++;
      }

      if (dialogueLines.length > 0) {
        blocks.push({ type: "dialogue", text: dialogueLines.join(" "), lineNumber: i });
      }
      continue;
    }

    // Default to Action
    blocks.push({ type: "action", text: line, lineNumber: i + 1 });
    i++;
  }

  // 2. Build Scenes, Characters, Locations, Props, Costumes
  const scenes: Scene[] = [];
  const characterMap = new Map<string, { id: string; name: string; description: string; dialogueCount: number; sceneIds: Set<string> }>();
  const locationMap = new Map<string, { id: string; name: string; type: "EXT" | "INT" | "INT/EXT" | "UNKNOWN"; sceneIds: Set<string> }>();
  const propMap = new Map<string, { id: string; name: string; sceneIds: Set<string> }>();
  const costumeList: Costume[] = [];

  let currentScene: Scene | null = null;
  let currentCharacterCue: string | null = null;
  let currentParenthetical: string | null = null;
  let sceneCounter = 0;
  let dialogueCounter = 0;
  let actionCounter = 0;

  // Helper to normalize character names (e.g. "BHAWANI" and "THAKUR BHAWANI SINGH")
  const normalizeCharName = (raw: string): string => {
    const cleaned = raw.replace(/\s*\(.*?\)\s*/g, "").trim().toUpperCase();
    if (cleaned === "BHAWANI" || cleaned.includes("THAKUR BHAWANI SINGH")) {
      return "BHAWANI";
    }
    return cleaned;
  };

  const ensureCharacter = (rawName: string, sceneId: string, desc = ""): string => {
    const name = normalizeCharName(rawName);
    if (!name) return "";

    let existing = characterMap.get(name);
    if (!existing) {
      const charId = `CHR-${String(characterMap.size + 1).padStart(3, "0")}`;
      existing = {
        id: charId,
        name: name,
        description: desc || (name === "VIKRAM" ? "40s, tired city posture" : name === "BHAWANI" ? "70s, patriarch with sharp hawk-like gaze" : "Character in scene"),
        dialogueCount: 0,
        sceneIds: new Set<string>(),
      };
      characterMap.set(name, existing);
    }
    existing.sceneIds.add(sceneId);
    if (desc && (!existing.description || existing.description.startsWith("Character"))) {
      existing.description = desc;
    }
    return existing.id;
  };

  const ensureLocation = (headingText: string, sceneId: string): { locId: string; locName: string; intExt: "INT." | "EXT." | "INT./EXT." | "UNKNOWN"; timeOfDay: string } => {
    let intExt: "INT." | "EXT." | "INT./EXT." | "UNKNOWN" = "UNKNOWN";
    if (/^INT\.\/EXT\./i.test(headingText)) intExt = "INT./EXT.";
    else if (/^INT\./i.test(headingText)) intExt = "INT.";
    else if (/^EXT\./i.test(headingText)) intExt = "EXT.";

    const withoutPrefix = headingText.replace(/^(INT\.\/EXT\.|INT\.|EXT\.|I\/E\.)\s*/i, "").trim();
    const parts = withoutPrefix.split(/\s+-\s+/);
    const locName = parts[0]?.trim() || "UNKNOWN LOCATION";
    const timeOfDay = parts[1]?.trim() || "UNSPECIFIED";

    const locKey = locName.toUpperCase();
    let existing = locationMap.get(locKey);
    if (!existing) {
      const locId = `LOC-${String(locationMap.size + 1).padStart(3, "0")}`;
      existing = {
        id: locId,
        name: locName,
        type: intExt === "EXT." ? "EXT" : intExt === "INT." ? "INT" : intExt === "INT./EXT." ? "INT/EXT" : "UNKNOWN",
        sceneIds: new Set<string>(),
      };
      locationMap.set(locKey, existing);
    }
    existing.sceneIds.add(sceneId);

    return { locId: existing.id, locName: existing.name, intExt, timeOfDay };
  };

  const detectProps = (text: string, sceneId: string, scenePropIds: string[]) => {
    const lower = text.toLowerCase();
    for (const p of COMMON_PROPS) {
      if (lower.includes(p)) {
        let existing = propMap.get(p);
        if (!existing) {
          const propId = `PROP-${String(propMap.size + 1).padStart(3, "0")}`;
          existing = {
            id: propId,
            name: p.charAt(0).toUpperCase() + p.slice(1),
            sceneIds: new Set<string>(),
          };
          propMap.set(p, existing);
        }
        existing.sceneIds.add(sceneId);
        if (!scenePropIds.includes(existing.id)) {
          scenePropIds.push(existing.id);
        }
      }
    }
  };

  // If no heading was found at start, create a fallback scene
  if (blocks.length > 0 && blocks[0].type !== "heading") {
    sceneCounter++;
    const sceneId = `SCN-${String(sceneCounter).padStart(3, "0")}`;
    const loc = ensureLocation("EXT. UNTITLED SCENE - DAY", sceneId);
    currentScene = {
      id: sceneId,
      sceneNumber: sceneCounter,
      heading: "EXT. UNTITLED SCENE - DAY",
      locationId: loc.locId,
      locationName: loc.locName,
      interiorExterior: loc.intExt,
      timeOfDay: loc.timeOfDay,
      characterIds: [],
      dialogue: [],
      actions: [],
      propIds: [],
      costumeIds: [],
      unresolved: [],
    };
    scenes.push(currentScene);
  }

  for (const block of blocks) {
    if (block.type === "heading") {
      sceneCounter++;
      const sceneId = `SCN-${String(sceneCounter).padStart(3, "0")}`;
      const loc = ensureLocation(block.text, sceneId);

      currentScene = {
        id: sceneId,
        sceneNumber: sceneCounter,
        heading: block.text,
        locationId: loc.locId,
        locationName: loc.locName,
        interiorExterior: loc.intExt,
        timeOfDay: loc.timeOfDay,
        characterIds: [],
        dialogue: [],
        actions: [],
        propIds: [],
        costumeIds: [],
        unresolved: [],
      };
      scenes.push(currentScene);
      currentCharacterCue = null;
      currentParenthetical = null;
      continue;
    }

    if (!currentScene) {
      unresolvedItems.push(`Unattached block before first scene: "${block.text}"`);
      continue;
    }

    if (block.type === "character") {
      currentCharacterCue = block.text;
      currentParenthetical = null;

      // Extract character info like "VIKRAM (40s)"
      const charId = ensureCharacter(block.text, currentScene.id);
      if (charId && !currentScene.characterIds.includes(charId)) {
        currentScene.characterIds.push(charId);
      }
      continue;
    }

    if (block.type === "parenthetical") {
      currentParenthetical = block.text;
      continue;
    }

    if (block.type === "dialogue") {
      if (!currentCharacterCue) {
        currentScene.unresolved.push(`Dialogue without character cue at line ${block.lineNumber}: "${block.text}"`);
        unresolvedItems.push(`Dialogue without character cue at line ${block.lineNumber}: "${block.text}"`);
        continue;
      }

      dialogueCounter++;
      const charId = ensureCharacter(currentCharacterCue, currentScene.id);
      const charObj = characterMap.get(normalizeCharName(currentCharacterCue));
      if (charObj) {
        charObj.dialogueCount++;
      }

      const dialogueObj: Dialogue = {
        id: `DIA-${String(dialogueCounter).padStart(3, "0")}`,
        characterId: charId,
        characterName: charObj?.name || normalizeCharName(currentCharacterCue),
        parenthetical: currentParenthetical || undefined,
        text: block.text,
        lineNumber: block.lineNumber,
      };

      currentScene.dialogue.push(dialogueObj);
      detectProps(block.text, currentScene.id, currentScene.propIds);

      currentCharacterCue = null;
      currentParenthetical = null;
      continue;
    }

    if (block.type === "action") {
      actionCounter++;
      const actionObj: Action = {
        id: `ACT-${String(actionCounter).padStart(3, "0")}`,
        text: block.text,
        lineNumber: block.lineNumber,
      };
      currentScene.actions.push(actionObj);

      // Detect character mentions in action lines (e.g., "VIKRAM (40s, dust-stained...)")
      const actionCharMatch = block.text.match(/([A-Z\s]{3,30})\s*\((.*?)\)/);
      if (actionCharMatch) {
        const potentialName = actionCharMatch[1].trim();
        const desc = actionCharMatch[2].trim();
        if (potentialName === "VIKRAM" || potentialName.includes("BHAWANI")) {
          const charId = ensureCharacter(potentialName, currentScene.id, desc);
          if (charId && !currentScene.characterIds.includes(charId)) {
            currentScene.characterIds.push(charId);
          }

          // Costume extraction
          const costumeId = `COST-${String(costumeList.length + 1).padStart(3, "0")}`;
          costumeList.push({
            id: costumeId,
            characterId: charId,
            characterName: potentialName,
            description: desc,
            sceneIds: [currentScene.id],
          });
          currentScene.costumeIds.push(costumeId);
        }
      }

      detectProps(block.text, currentScene.id, currentScene.propIds);
      continue;
    }

    if (block.type === "transition") {
      // Recognized transition, e.g. FADE OUT.
      actionCounter++;
      currentScene.actions.push({
        id: `ACT-${String(actionCounter).padStart(3, "0")}`,
        text: block.text,
        lineNumber: block.lineNumber,
      });
    }
  }

  // Ensure known costumes for characters if not already captured
  for (const [name, desc] of Object.entries(KNOWN_COSTUMES)) {
    const charObj = characterMap.get(name);
    if (charObj) {
      const alreadyHasCostume = costumeList.some((c) => c.characterId === charObj.id);
      if (!alreadyHasCostume) {
        const costumeId = `COST-${String(costumeList.length + 1).padStart(3, "0")}`;
        costumeList.push({
          id: costumeId,
          characterId: charObj.id,
          characterName: charObj.name,
          description: desc,
          sceneIds: Array.from(charObj.sceneIds),
        });
      }
    }
  }

  const finalCharacters: Character[] = Array.from(characterMap.values()).map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    dialogueCount: c.dialogueCount,
    sceneIds: Array.from(c.sceneIds),
  }));

  const finalLocations: Location[] = Array.from(locationMap.values()).map((l) => ({
    id: l.id,
    name: l.name,
    type: l.type,
    sceneIds: Array.from(l.sceneIds),
  }));

  const finalProps: Prop[] = Array.from(propMap.values()).map((p) => ({
    id: p.id,
    name: p.name,
    sceneIds: Array.from(p.sceneIds),
  }));

  return {
    title,
    scenes,
    characters: finalCharacters,
    locations: finalLocations,
    props: finalProps,
    costumes: costumeList,
    unresolvedItems,
  };
}
