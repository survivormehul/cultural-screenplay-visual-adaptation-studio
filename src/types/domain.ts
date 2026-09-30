export type CanonicalId = string;

export interface Dialogue {
  id: CanonicalId; // DIA-001
  characterId: CanonicalId; // CHR-001
  characterName: string;
  parenthetical?: string;
  text: string;
  lineNumber?: number;
}

export interface Action {
  id: CanonicalId; // ACT-001
  text: string;
  lineNumber?: number;
}

export interface Scene {
  id: CanonicalId; // SCN-001
  sceneNumber: number;
  heading: string;
  locationId: CanonicalId; // LOC-001
  locationName: string;
  interiorExterior: "INT." | "EXT." | "INT./EXT." | "UNKNOWN";
  timeOfDay: string;
  characterIds: CanonicalId[];
  dialogue: Dialogue[];
  actions: Action[];
  propIds: CanonicalId[];
  costumeIds: CanonicalId[];
  unresolved: string[];
}

export interface Character {
  id: CanonicalId; // CHR-001
  name: string;
  description: string;
  dialogueCount: number;
  sceneIds: CanonicalId[];
}

export interface Location {
  id: CanonicalId; // LOC-001
  name: string;
  type: "EXT" | "INT" | "INT/EXT" | "UNKNOWN";
  sceneIds: CanonicalId[];
}

export interface Prop {
  id: CanonicalId; // PROP-001
  name: string;
  sceneIds: CanonicalId[];
  unresolved?: boolean;
}

export interface Costume {
  id: CanonicalId; // COST-001
  characterId: CanonicalId;
  characterName: string;
  description: string;
  sceneIds: CanonicalId[];
}

export interface Screenplay {
  title: string;
  scenes: Scene[];
  characters: Character[];
  locations: Location[];
  props: Prop[];
  costumes: Costume[];
  unresolvedItems: string[];
}

export type AdaptationCategory =
  | "Dialogue/Register"
  | "Greeting/Address"
  | "Environment"
  | "Costume"
  | "Props"
  | "Food"
  | "Social context"
  | "Local terminology";

export type SuggestionStatus = "pending" | "approved" | "rejected" | "edited";

export interface AdaptationSuggestion {
  id: CanonicalId; // ADP-001
  sceneId: CanonicalId; // SCN-001
  entityId?: CanonicalId;
  category: AdaptationCategory;
  original: string;
  proposed: string;
  devanagariProposed?: string;
  rationale: string;
  confidence: number;
  status: SuggestionStatus;
  userEditedText?: string;
}

export interface AdaptationDecision {
  suggestionId: CanonicalId;
  status: SuggestionStatus;
  editedValue?: string;
  decidedAt: string;
  notes?: string;
}

export interface AdaptationPlan {
  planId: CanonicalId;
  cultureProfileId: string;
  targetCulture: string;
  targetDialect: string;
  script: string;
  region: string;
  suggestions: AdaptationSuggestion[];
  totalSuggestions: number;
  generatedAt: string;
}

export interface AdaptedDialogue {
  dialogueId: CanonicalId;
  characterId: CanonicalId;
  characterName: string;
  parenthetical?: string;
  originalText: string;
  adaptedText: string;
  devanagariText: string;
  appliedSuggestionIds: CanonicalId[];
}

export interface AdaptedScene {
  sceneId: CanonicalId; // SCN-001
  sceneNumber: number;
  originalHeading: string;
  adaptedHeading: string;
  locationName: string;
  timeOfDay: string;
  characterIds: CanonicalId[];
  actions: string[];
  dialogues: AdaptedDialogue[];
  appliedAdaptations: CanonicalId[];
}

export interface AdaptedScreenplay {
  screenplayId: CanonicalId;
  scenes: AdaptedScene[];
  generatedAt: string;
  provider: string;
  totalScenes: number;
  totalApprovedAdaptations: number;
  summary: string;
}

export interface SceneVisualPromptPackage {
  visualId: CanonicalId; // VIS-SCN-001
  sceneId: CanonicalId; // SCN-001
  subject: string;
  environment: string;
  architecture: string;
  costume: string;
  props: string;
  lighting: string;
  mood: string;
  camera: string;
  framing: string;
  culturalConstraints: string[];
  continuityConstraints: string[];
  finalPrompt: string;
}

export interface CharacterVisualPromptPackage {
  visualId: CanonicalId; // VIS-CHR-001
  characterId: CanonicalId; // CHR-001
  characterName: string;
  appearance: string;
  costume: string;
  ageDescriptor: string;
  environment: string;
  continuityRequirements: string[];
  finalPrompt: string;
}

export interface VisualPackages {
  scenePackages: SceneVisualPromptPackage[];
  characterPackages: CharacterVisualPromptPackage[];
  generatedAt: string;
  provider: string;
}

export type ContinuityCategory =
  | "Character continuity"
  | "Costume continuity"
  | "Prop continuity"
  | "Location continuity"
  | "Scene ordering"
  | "Adaptation continuity"
  | "Unresolved information";

export type SeverityLevel = "PASS" | "WARNING" | "ERROR";

export interface ContinuityCheck {
  id: CanonicalId; // CON-001
  category: ContinuityCategory;
  severity: SeverityLevel;
  sceneOrEntityId: CanonicalId;
  message: string;
  status: "PASSED" | "FLAGGED";
  recommendation?: string;
}

export interface ContinuityReport {
  reportId: CanonicalId;
  timestamp: string;
  totalChecks: number;
  passed: number;
  warnings: number;
  errors: number;
  checks: ContinuityCheck[];
  unresolvedItems: string[];
}

export type PipelineStage =
  | "input"
  | "structure"
  | "plan"
  | "approval"
  | "adapted"
  | "visuals"
  | "continuity"
  | "export";

export interface ProjectState {
  currentStage: PipelineStage;
  rawScreenplay: string;
  parsedScreenplay: Screenplay | null;
  adaptationPlan: AdaptationPlan | null;
  adaptedScreenplay: AdaptedScreenplay | null;
  visualPackages: VisualPackages | null;
  continuityReport: ContinuityReport | null;
  structureApproved: boolean;
  approvalGateCompleted: boolean;
  continuityApproved: boolean;
}
