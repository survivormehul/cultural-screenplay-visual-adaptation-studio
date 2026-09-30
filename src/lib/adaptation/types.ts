import {
  AdaptationDecision,
  AdaptationPlan,
  AdaptedScreenplay,
  Screenplay,
} from "@/types/domain";
import { CulturalProfile } from "@/types/adaptation";

export interface TextAdaptationProvider {
  providerId: string;
  name: string;
  generatePlan(screenplay: Screenplay, profile: CulturalProfile): Promise<AdaptationPlan>;
  generateAdaptation(
    screenplay: Screenplay,
    plan: AdaptationPlan,
    decisions: Record<string, AdaptationDecision>
  ): Promise<AdaptedScreenplay>;
}
