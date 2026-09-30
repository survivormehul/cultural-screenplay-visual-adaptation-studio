"use client";

import React, { useState } from "react";
import { ACTIVE_CULTURAL_PROFILE } from "@/data/sampleScreenplay";
import { WorkflowStepId } from "@/types/adaptation";

interface WorkspacePreviewProps {
  screenplayText: string;
  workflowInitiated: boolean;
  activeStepId: WorkflowStepId;
}

export const WorkspacePreview: React.FC<WorkspacePreviewProps> = ({
  screenplayText,
  workflowInitiated,
  activeStepId,
}) => {
  const [activeTab, setActiveTab] = useState<
    "source" | "plan" | "adapted" | "visuals" | "continuity"
  >("source");

  const wordCount = screenplayText.trim() ? screenplayText.trim().split(/\s+/).length : 0;

  return (
    <section aria-labelledby="workspace-preview-title" className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="workspace-preview-title" className="text-base font-semibold text-stone-900">
              Workspace & Adaptation Preview
            </h2>
            <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-mono uppercase text-stone-600">
              Focus: {activeStepId}
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Inspect source text, cultural dialect mappings, and downstream generation stages for {ACTIVE_CULTURAL_PROFILE.targetDialect}.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 rounded-lg bg-stone-100 p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("source")}
            className={`rounded-md px-3 py-1.5 font-medium transition-all ${
              activeTab === "source"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Source Script
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("plan")}
            className={`rounded-md px-3 py-1.5 font-medium transition-all ${
              activeTab === "plan"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Adaptation Plan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("adapted")}
            className={`rounded-md px-3 py-1.5 font-medium transition-all ${
              activeTab === "adapted"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Marwari Output <span className="text-[10px] text-stone-400 font-normal">(Devanagari)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("visuals")}
            className={`rounded-md px-3 py-1.5 font-medium transition-all ${
              activeTab === "visuals"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Visual Concepts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("continuity")}
            className={`rounded-md px-3 py-1.5 font-medium transition-all ${
              activeTab === "continuity"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Continuity Audit
          </button>
        </div>
      </div>

      <div className="mt-4">
        {/* TAB 1: SOURCE SCRIPT */}
        {activeTab === "source" && (
          <div>
            {!screenplayText.trim() ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 py-16 px-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-400 mb-3">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-stone-800">No Screenplay Ingested</h3>
                <p className="text-xs text-stone-500 max-w-sm mt-1">
                  Paste dialogue or scene action into the input section above, or click &ldquo;Load Sample Scene&rdquo; to preview script formatting.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-100 pb-2">
                  <span>Formatted Monospace View</span>
                  <span>{wordCount} words loaded</span>
                </div>
                <pre className="max-h-96 overflow-y-auto rounded-lg bg-stone-900 p-4 font-mono text-xs text-stone-100 leading-relaxed whitespace-pre-wrap selection:bg-amber-800 selection:text-white">
                  {screenplayText}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ADAPTATION PLAN */}
        {activeTab === "plan" && (
          <div className="space-y-4">
            <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-950">
              <div className="flex items-start gap-2.5">
                <span className="rounded bg-amber-200/80 px-2 py-0.5 font-bold text-amber-900 shrink-0 text-[11px]">
                  Engine: Pending Connection
                </span>
                <div>
                  <p className="font-semibold">
                    Cultural Translation Matrix: Standard Script → Rural Jodhpur Marwari
                  </p>
                  <p className="text-amber-800 mt-0.5 text-[11px]">
                    The automatic dialect adaptation engine will map dramatic beats, honorifics, and environmental metaphors when connected in upcoming milestones. Below is the active target blueprint.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="rounded-lg border border-stone-200 p-4">
                <h3 className="font-semibold text-stone-900 mb-2">Dialect & Honorifics Lexicon</h3>
                <ul className="space-y-2 text-stone-600">
                  <li className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="font-medium text-stone-800">Formal Greeting:</span>
                    <span className="font-mono text-stone-900">खम्मा घणी / घणी खम्मा</span>
                  </li>
                  <li className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="font-medium text-stone-800">Patriarch Honorific:</span>
                    <span className="font-mono text-stone-900">हुकम / बाबोसा</span>
                  </li>
                  <li className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="font-medium text-stone-800">Pronouns:</span>
                    <span className="font-mono text-stone-900">म्हे (We) / थ्हें (You) / म्हारो (Mine)</span>
                  </li>
                  <li className="flex justify-between pb-1">
                    <span className="font-medium text-stone-800">Cultural Oath:</span>
                    <span className="font-mono text-stone-900">बावड़ी री सौगंध (Water sanctity)</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-stone-200 p-4">
                <h3 className="font-semibold text-stone-900 mb-2">Setting & Environmental Adaptations</h3>
                <ul className="space-y-2 text-stone-600">
                  <li className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="font-medium text-stone-800">Ancestral Property:</span>
                    <span className="text-stone-900">Sandstone Pol & Courtyard (हवेली)</span>
                  </li>
                  <li className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="font-medium text-stone-800">Well & Water Basin:</span>
                    <span className="text-stone-900">Ancient Baori & Jharokha wellhead</span>
                  </li>
                  <li className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="font-medium text-stone-800">Costume Transition:</span>
                    <span className="text-stone-900">Panchrangi Safa, Angarkha, silver amulets</span>
                  </li>
                  <li className="flex justify-between pb-1">
                    <span className="font-medium text-stone-800">Atmosphere:</span>
                    <span className="text-stone-900">Thar dusk winds, earthenware, copper tones</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MARWARI OUTPUT */}
        {activeTab === "adapted" && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 py-16 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <span className="rounded bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-600 mb-2 uppercase">
              Pipeline Stage 5: Pending Connection
            </span>
            <h3 className="text-sm font-semibold text-stone-800">
              Adapted Screenplay Output (मारवाड़ी - देवनागरी)
            </h3>
            <p className="text-xs text-stone-500 max-w-md mt-1.5">
              The Marwari Devanagari translation engine is not yet connected in this milestone. When integrated, the adapted screenplay with local idioms, emotional nuances, and stage directions will render here in side-by-side comparison.
            </p>
          </div>
        )}

        {/* TAB 4: VISUAL CONCEPTS */}
        {activeTab === "visuals" && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 py-16 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-500 mb-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="rounded bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-600 mb-2 uppercase">
              Pipeline Stage 6: Pending Connection
            </span>
            <h3 className="text-sm font-semibold text-stone-800">
              Visual Generation & Concept Artboards
            </h3>
            <p className="text-xs text-stone-500 max-w-md mt-1.5">
              Visual generation engine (generating Rural Jodhpur architecture, Thar lighting, and character wardrobe continuity) is not yet connected. Generated concept frames and character sheets will populate here in Milestone 2.
            </p>
          </div>
        )}

        {/* TAB 5: CONTINUITY AUDIT */}
        {activeTab === "continuity" && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 py-16 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-500 mb-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="rounded bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-600 mb-2 uppercase">
              Pipeline Stage 7: Pending Connection
            </span>
            <h3 className="text-sm font-semibold text-stone-800">
              Continuity & Cultural Accuracy Audit
            </h3>
            <p className="text-xs text-stone-500 max-w-md mt-1.5">
              Continuity engine pending. Automated character arc checks, timeline consistency, and Marwari dialect propriety audits will execute after human approval.
            </p>
          </div>
        )}
      </div>

      {/* Pipeline Status Banner */}
      {workflowInitiated && (
        <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-950 flex items-start gap-2.5">
          <svg className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div className="space-y-1">
            <p className="font-semibold text-emerald-900">
              Screenplay Validated · Workflow Initiated
            </p>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              Step 1 (Screenplay Input) complete. Next step: <strong>Structure Extraction (Stage 2)</strong>.
              <br />
              <span className="text-stone-600">
                Note: AI extraction, Marwari Devanagari translation, and visual diffusion models are marked as pending/not yet connected for this milestone.
              </span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
