"use client";

import React, { useState } from "react";
import {
  AdaptationDecision,
  AdaptationPlan,
  AdaptedScreenplay,
  ContinuityReport,
  Screenplay,
  VisualPackages,
} from "@/types/domain";
import { CulturalProfile } from "@/types/adaptation";
import {
  exportAdaptedScreenplayTxt,
  exportAdaptationPlanJson,
  exportContinuityReportTxt,
  exportCompleteProjectJson,
} from "@/lib/export";

interface ExportPanelProps {
  originalScreenplay: Screenplay | null;
  adaptedScreenplay: AdaptedScreenplay | null;
  adaptationPlan: AdaptationPlan | null;
  decisions: Record<string, AdaptationDecision>;
  visualPackages: VisualPackages | null;
  continuityReport: ContinuityReport | null;
  culturalProfile: CulturalProfile;
  rawScreenplay: string;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  originalScreenplay,
  adaptedScreenplay,
  adaptationPlan,
  decisions,
  visualPackages,
  continuityReport,
  culturalProfile,
  rawScreenplay,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExportScreenplay = () => {
    if (!adaptedScreenplay) return;
    exportAdaptedScreenplayTxt(adaptedScreenplay);
    setDownloadSuccess("cultural-adapted-screenplay.txt downloaded successfully.");
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleExportPlan = () => {
    if (!adaptationPlan) return;
    exportAdaptationPlanJson(adaptationPlan, decisions);
    setDownloadSuccess("cultural-adaptation-plan.json downloaded successfully.");
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleExportContinuity = () => {
    if (!continuityReport) return;
    exportContinuityReportTxt(continuityReport);
    setDownloadSuccess("continuity-report.txt downloaded successfully.");
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleExportCompleteProject = () => {
    if (!adaptedScreenplay || !adaptationPlan || !continuityReport || !visualPackages || !originalScreenplay) return;
    const fullProjectPayload = {
      projectTitle: "Cultural Screenplay and Visual Adaptation Studio - Project Archive",
      exportedAt: new Date().toISOString(),
      studioVersion: "0.2.0-demo",
      cultureProfile: culturalProfile,
      rawScreenplay,
      structure: originalScreenplay,
      adaptationPlan,
      decisions,
      adaptedScreenplay,
      visualPromptPackages: visualPackages,
      continuityReport,
    };
    exportCompleteProjectJson(fullProjectPayload);
    setDownloadSuccess("cultural-screenplay-project.json downloaded successfully.");
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const canExportAll = Boolean(adaptedScreenplay && adaptationPlan && continuityReport && visualPackages && originalScreenplay);

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-stone-900">
              Export Production Packages & Audit Bundles
            </h2>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-900">
              Ready for Export
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Download production-ready text scripts, dialect translation dictionaries, continuity audit certificates, and full JSON archives.
          </p>
        </div>
      </div>

      {downloadSuccess && (
        <div className="mt-3.5 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-900 flex items-center gap-2">
          <svg className="h-4 w-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-semibold">{downloadSuccess}</span>
        </div>
      )}

      {/* Export Cards Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Card 1: Adapted Screenplay */}
        <div className="rounded-lg border border-stone-200 p-4 bg-stone-50/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 text-sm">
                Adapted Screenplay (.txt)
              </span>
              <span className="rounded bg-amber-100 text-amber-900 font-mono text-[10px] px-1.5 py-0.5 font-bold">
                Devanagari
              </span>
            </div>
            <p className="mt-1.5 text-stone-600 leading-relaxed text-[11px]">
              Complete script with scene headings, action descriptions, and dialogues adapted into rural Jodhpur Marwari in Devanagari script.
            </p>
            {adaptedScreenplay ? (
              <div className="mt-2 text-[10px] text-stone-500 font-mono">
                Includes {adaptedScreenplay.scenes.length} scene(s) · {adaptedScreenplay.totalApprovedAdaptations} cultural adjustments
              </div>
            ) : (
              <div className="mt-2 text-[10px] text-amber-800 font-semibold">
                ⚠️ Screenplay not yet adapted. Complete Stage 5 to unlock.
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={!adaptedScreenplay}
            onClick={handleExportScreenplay}
            className={`mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
              adaptedScreenplay
                ? "bg-stone-900 text-white hover:bg-stone-800 cursor-pointer"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download cultural-adapted-screenplay.txt</span>
          </button>
        </div>

        {/* Card 2: Adaptation Plan */}
        <div className="rounded-lg border border-stone-200 p-4 bg-stone-50/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 text-sm">
                Cultural Adaptation Plan (.json)
              </span>
              <span className="rounded bg-blue-100 text-blue-900 font-mono text-[10px] px-1.5 py-0.5 font-bold">
                Lexicon Data
              </span>
            </div>
            <p className="mt-1.5 text-stone-600 leading-relaxed text-[11px]">
              Structured translation ledger showing original text, proposed regional idioms, linguistic rationales, confidence scores, and approved editorial decisions.
            </p>
            {adaptationPlan ? (
              <div className="mt-2 text-[10px] text-stone-500 font-mono">
                Contains {adaptationPlan.suggestions.length} suggestions across 8 cultural categories
              </div>
            ) : (
              <div className="mt-2 text-[10px] text-amber-800 font-semibold">
                ⚠️ Plan not yet generated. Complete Stage 3 to unlock.
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={!adaptationPlan}
            onClick={handleExportPlan}
            className={`mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${
              adaptationPlan
                ? "border-stone-300 bg-white text-stone-800 hover:bg-stone-50 cursor-pointer"
                : "border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download cultural-adaptation-plan.json</span>
          </button>
        </div>

        {/* Card 3: Continuity Report */}
        <div className="rounded-lg border border-stone-200 p-4 bg-stone-50/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 text-sm">
                Continuity & Audit Report (.txt)
              </span>
              <span className="rounded bg-emerald-100 text-emerald-900 font-mono text-[10px] px-1.5 py-0.5 font-bold">
                Verification
              </span>
            </div>
            <p className="mt-1.5 text-stone-600 leading-relaxed text-[11px]">
              Complete diagnostic log detailing character retention, costume transitions, prop tracking, and unresolved cultural review items.
            </p>
            {continuityReport ? (
              <div className="mt-2 text-[10px] text-stone-500 font-mono">
                Audit score: {continuityReport.passed}/{continuityReport.totalChecks} checks passed ({continuityReport.warnings} warnings, {continuityReport.errors} errors)
              </div>
            ) : (
              <div className="mt-2 text-[10px] text-amber-800 font-semibold">
                ⚠️ Continuity check not yet executed. Complete Stage 7 to unlock.
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={!continuityReport}
            onClick={handleExportContinuity}
            className={`mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${
              continuityReport
                ? "border-stone-300 bg-white text-stone-800 hover:bg-stone-50 cursor-pointer"
                : "border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download continuity-report.txt</span>
          </button>
        </div>

        {/* Card 4: Complete Project JSON */}
        <div className="rounded-lg border border-amber-300 bg-amber-50/50 p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 text-sm">
                Complete Project Bundle (.json)
              </span>
              <span className="rounded bg-amber-700 text-white font-mono text-[10px] px-2 py-0.5 font-bold">
                Full Studio Archive
              </span>
            </div>
            <p className="mt-1.5 text-stone-700 leading-relaxed text-[11px]">
              The complete studio database payload including raw script, extracted structure, cultural profile, adaptation plan, editorial decisions, adapted screenplay, visual prompt packages, and continuity report.
            </p>
            {canExportAll ? (
              <div className="mt-2 text-[10px] text-amber-900 font-mono font-semibold">
                All 8 workflow stages bundled in standard JSON schema
              </div>
            ) : (
              <div className="mt-2 text-[10px] text-amber-800 font-semibold">
                ⚠️ Requires all stages to be completed before full archive packaging.
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={!canExportAll}
            onClick={handleExportCompleteProject}
            className={`mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors shadow-xs ${
              canExportAll
                ? "bg-amber-700 text-white hover:bg-amber-800 cursor-pointer"
                : "bg-stone-300 text-stone-500 cursor-not-allowed"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download cultural-screenplay-project.json</span>
          </button>
        </div>
      </div>
    </div>
  );
};
