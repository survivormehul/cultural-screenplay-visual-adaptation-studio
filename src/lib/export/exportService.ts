import {
  AdaptationDecision,
  AdaptationPlan,
  AdaptedScreenplay,
  ContinuityReport,
} from "@/types/domain";

export function downloadFile(filename: string, content: string, mimeType: string): void {
  if (typeof window === "undefined") return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function formatAdaptedScreenplayAsTxt(adapted: AdaptedScreenplay): string {
  let output = `================================================================================\n`;
  output += `CULTURAL SCREENPLAY ADAPTATION STUDIO - ADAPTED SCREENPLAY\n`;
  output += `Target: Marwari (Rural Jodhpur, Devanagari) | Provider: ${adapted.provider}\n`;
  output += `Generated At: ${adapted.generatedAt}\n`;
  output += `Total Scenes: ${adapted.totalScenes} | Approved Cultural Adjustments: ${adapted.totalApprovedAdaptations}\n`;
  output += `Notice: Devanagari demo output — native-speaker validation required.\n`;
  output += `================================================================================\n\n`;

  for (const scene of adapted.scenes) {
    output += `--------------------------------------------------------------------------------\n`;
    output += `SCENE ${scene.sceneNumber} (${scene.sceneId})\n`;
    output += `ORIGINAL: ${scene.originalHeading}\n`;
    output += `ADAPTED:  ${scene.adaptedHeading}\n`;
    output += `TIME:     ${scene.timeOfDay} | LOCATION: ${scene.locationName}\n`;
    output += `APPLIED ADAPTATIONS: [${scene.appliedAdaptations.join(", ")}]\n`;
    output += `--------------------------------------------------------------------------------\n\n`;

    output += `[ACTION]\n`;
    for (const act of scene.actions) {
      output += `${act}\n\n`;
    }

    output += `[DIALOGUE & ADAPTED REGISTER]\n`;
    for (const dia of scene.dialogues) {
      output += `${dia.characterName} (${dia.characterId})`;
      if (dia.parenthetical) {
        output += ` ${dia.parenthetical}`;
      }
      output += `:\n`;
      output += `  [Devanagari]: ${dia.devanagariText}\n`;
      output += `  [English/Marwari]: ${dia.adaptedText}\n`;
      if (dia.appliedSuggestionIds.length > 0) {
        output += `  (Applied: ${dia.appliedSuggestionIds.join(", ")})\n`;
      }
      output += `\n`;
    }
  }

  return output;
}

export function exportAdaptedScreenplayTxt(adapted: AdaptedScreenplay): void {
  const text = formatAdaptedScreenplayAsTxt(adapted);
  downloadFile("cultural-adapted-screenplay.txt", text, "text/plain;charset=utf-8");
}

export function exportAdaptationPlanJson(
  plan: AdaptationPlan,
  decisions: Record<string, AdaptationDecision>
): void {
  const payload = {
    exportType: "CULTURAL_ADAPTATION_PLAN",
    cultureProfile: {
      culture: plan.targetCulture,
      dialect: plan.targetDialect,
      script: plan.script,
      region: plan.region,
    },
    planId: plan.planId,
    generatedAt: plan.generatedAt,
    totalSuggestions: plan.totalSuggestions,
    suggestions: plan.suggestions.map((s) => ({
      ...s,
      decision: decisions[s.id] || { status: s.status },
    })),
  };
  const jsonStr = JSON.stringify(payload, null, 2);
  downloadFile("cultural-adaptation-plan.json", jsonStr, "application/json");
}

export function formatContinuityReportAsTxt(report: ContinuityReport): string {
  let output = `================================================================================\n`;
  output += `CULTURAL SCREENPLAY CONTINUITY & ACCURACY AUDIT REPORT\n`;
  output += `Report ID: ${report.reportId} | Timestamp: ${report.timestamp}\n`;
  output += `Total Checks: ${report.totalChecks} | Passed: ${report.passed} | Warnings: ${report.warnings} | Errors: ${report.errors}\n`;
  output += `================================================================================\n\n`;

  output += `SUMMARY OF FINDINGS:\n`;
  for (const check of report.checks) {
    output += `[${check.severity}] ${check.id} - ${check.category} (${check.sceneOrEntityId})\n`;
    output += `  Status: ${check.status}\n`;
    output += `  Details: ${check.message}\n`;
    if (check.recommendation) {
      output += `  Recommendation: ${check.recommendation}\n`;
    }
    output += `\n`;
  }

  output += `================================================================================\n`;
  output += `UNRESOLVED / REQUIRES HUMAN REVIEW:\n`;
  output += `================================================================================\n`;
  for (let i = 0; i < report.unresolvedItems.length; i++) {
    output += `${i + 1}. ${report.unresolvedItems[i]}\n`;
  }

  return output;
}

export function exportContinuityReportTxt(report: ContinuityReport): void {
  const text = formatContinuityReportAsTxt(report);
  downloadFile("continuity-report.txt", text, "text/plain;charset=utf-8");
}

export function exportCompleteProjectJson(projectData: object): void {
  const jsonStr = JSON.stringify(projectData, null, 2);
  downloadFile("cultural-screenplay-project.json", jsonStr, "application/json");
}
