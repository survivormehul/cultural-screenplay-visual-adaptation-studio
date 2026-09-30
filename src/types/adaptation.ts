export type WorkflowStepId =
  | "input"
  | "extraction"
  | "plan"
  | "approval"
  | "adapted"
  | "visuals"
  | "continuity"
  | "export";

export type StepStatus = "ready" | "active" | "pending" | "completed" | "locked";

export interface WorkflowStep {
  id: WorkflowStepId;
  number: number;
  label: string;
  shortDescription: string;
  status: StepStatus;
  isEngineConnected: boolean;
}

export interface CulturalProfile {
  targetCulture: string;
  targetDialect: string;
  script: string;
  region: string;
  periodAndSetting: string;
  dialectMarkers: string[];
  architecturalContext: string[];
  attireContext: string[];
  socioCulturalNotes: string;
}

export interface ScreenplayFileMeta {
  name: string;
  size: number;
  type: string;
  lastModified?: number;
}
