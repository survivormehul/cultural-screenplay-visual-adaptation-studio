"use client";

import React, { useState } from "react";
import { AdaptedScreenplay, Screenplay } from "@/types/domain";

interface AdaptedScreenplayViewProps {
  originalScreenplay: Screenplay;
  adaptedScreenplay: AdaptedScreenplay;
  onProceedToVisuals: () => void;
}

export const AdaptedScreenplayView: React.FC<AdaptedScreenplayViewProps> = ({
  originalScreenplay,
  adaptedScreenplay,
  onProceedToVisuals,
}) => {
  const [viewMode, setViewMode] = useState<"sideBySide" | "sceneByScene">("sideBySide");
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);

  const currentScene = adaptedScreenplay.scenes[selectedSceneIndex] || adaptedScreenplay.scenes[0];
  const originalScene = originalScreenplay.scenes[selectedSceneIndex] || originalScreenplay.scenes[0];

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-stone-900">
              Adapted Screenplay: Marwari (Devanagari)
            </h2>
            <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-900">
              {adaptedScreenplay.totalApprovedAdaptations} Applied Adaptations
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Preserving narrative arcs, character IDs, and core beats with regional Thar vernacular.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg bg-stone-100 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("sideBySide")}
              className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                viewMode === "sideBySide"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Side-by-Side View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("sceneByScene")}
              className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                viewMode === "sceneByScene"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Scene Inspector
            </button>
          </div>

          <button
            type="button"
            onClick={onProceedToVisuals}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-800 transition-colors cursor-pointer"
          >
            <span>Proceed to Visuals</span>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mandatory Demo & Devanagari Disclaimers */}
      <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-2.5 text-stone-700 flex items-center gap-2">
          <span className="font-semibold text-stone-900">Notice:</span> Generated in Demo Mode — deterministic adaptation provider.
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-2.5 text-amber-900 flex items-center gap-2">
          <span className="font-semibold text-amber-950">Orthography:</span> Devanagari demo output — native-speaker validation required.
        </div>
      </div>

      {/* SCENE SELECTOR (for multi-scene scripts) */}
      {adaptedScreenplay.scenes.length > 1 && (
        <div className="mt-3 flex items-center gap-2 border-b border-stone-100 pb-2 text-xs">
          <span className="font-semibold text-stone-700">Select Scene:</span>
          {adaptedScreenplay.scenes.map((s, idx) => (
            <button
              key={s.sceneId}
              type="button"
              onClick={() => setSelectedSceneIndex(idx)}
              className={`rounded px-2 py-1 font-mono text-[11px] ${
                selectedSceneIndex === idx
                  ? "bg-amber-800 text-white font-bold"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {s.sceneId} (Scene {s.sceneNumber})
            </button>
          ))}
        </div>
      )}

      {/* VIEW MODES */}
      <div className="mt-4">
        {viewMode === "sideBySide" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* ORIGINAL COLUMN */}
            <div className="rounded-lg border border-stone-200 p-4 bg-stone-50/50">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold bg-stone-800 text-white px-2 py-0.5 rounded text-[11px]">
                    {originalScene?.id || "SCN-001"}
                  </span>
                  <span className="font-bold text-stone-900 text-xs">Original Screenplay</span>
                </div>
                <span className="text-[11px] text-stone-500 font-mono">
                  {originalScene?.timeOfDay}
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs leading-relaxed text-stone-800 max-h-[500px] overflow-y-auto pr-1">
                <p className="font-bold text-stone-900 bg-white p-2 rounded border border-stone-200">
                  {originalScene?.heading}
                </p>

                {originalScene?.actions.map((act) => (
                  <p key={act.id} className="text-stone-700 italic">
                    {act.text}
                  </p>
                ))}

                {originalScene?.dialogue.map((dia) => (
                  <div key={dia.id} className="bg-white p-2.5 rounded border border-stone-200">
                    <p className="font-bold text-stone-900">
                      {dia.characterName} {dia.parenthetical && <span className="font-normal italic">({dia.parenthetical})</span>}
                    </p>
                    <p className="mt-1 text-stone-800">{dia.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ADAPTED COLUMN (MARWARI / DEVANAGARI) */}
            <div className="rounded-lg border border-amber-200 p-4 bg-amber-50/30">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold bg-amber-800 text-white px-2 py-0.5 rounded text-[11px]">
                    {currentScene?.sceneId || "SCN-001"}
                  </span>
                  <span className="font-bold text-amber-950 text-xs">
                    Adapted Marwari (Devanagari)
                  </span>
                </div>
                <span className="text-[11px] text-amber-800 font-mono">
                  {currentScene?.appliedAdaptations.length} adjustments applied
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs leading-relaxed text-stone-900 max-h-[500px] overflow-y-auto pr-1">
                <p className="font-bold text-amber-950 bg-white p-2 rounded border border-amber-200">
                  {currentScene?.adaptedHeading}
                </p>

                {currentScene?.actions.map((act, i) => (
                  <p key={i} className="text-stone-800 italic">
                    {act}
                  </p>
                ))}

                {currentScene?.dialogues.map((dia) => (
                  <div key={dia.dialogueId} className="bg-white p-3 rounded border border-amber-200 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-stone-900">
                        {dia.characterName} {dia.parenthetical && <span className="font-normal italic">({dia.parenthetical})</span>}
                      </p>
                      {dia.appliedSuggestionIds.length > 0 && (
                        <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-mono">
                          {dia.appliedSuggestionIds.join(", ")}
                        </span>
                      )}
                    </div>

                    {/* Devanagari output prominently displayed */}
                    <div className="p-2 rounded bg-amber-50/70 border border-amber-100">
                      <span className="text-[10px] uppercase font-bold text-amber-800 block mb-0.5">
                        Devanagari (देवनागरी):
                      </span>
                      <p className="text-sm font-semibold text-amber-950 leading-relaxed font-sans">
                        {dia.devanagariText}
                      </p>
                    </div>

                    <p className="text-[11px] text-stone-500 font-mono">
                      Subtext / Romanized: {dia.adaptedText}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* SCENE BY SCENE VIEW */
          <div className="space-y-4">
            <div className="rounded-lg border border-amber-200 p-4 bg-amber-50/30">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2 mb-3">
                <span className="font-bold text-stone-900 text-sm">
                  Scene {currentScene?.sceneNumber}: {currentScene?.adaptedHeading}
                </span>
                <span className="font-mono text-xs text-amber-800">
                  Location: {currentScene?.locationName} ({currentScene?.timeOfDay})
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {currentScene?.actions.map((act, i) => (
                  <p key={i} className="text-stone-700 italic bg-stone-50 p-2.5 rounded border border-stone-200">
                    {act}
                  </p>
                ))}

                {currentScene?.dialogues.map((dia) => (
                  <div key={dia.dialogueId} className="bg-white p-3.5 rounded border border-stone-200 space-y-2">
                    <p className="font-bold text-stone-900 text-sm">
                      {dia.characterName} {dia.parenthetical && <span className="font-normal italic">({dia.parenthetical})</span>}
                    </p>
                    <div className="p-2.5 rounded bg-amber-50 border border-amber-200">
                      <span className="text-[10px] uppercase font-bold text-amber-800 block mb-1">
                        Devanagari Output:
                      </span>
                      <p className="text-base font-bold text-amber-950 font-sans">
                        {dia.devanagariText}
                      </p>
                    </div>
                    <div className="text-xs text-stone-600">
                      <span className="font-semibold text-stone-700">Original:</span> {dia.originalText}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
