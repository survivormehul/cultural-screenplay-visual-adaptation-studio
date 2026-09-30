"use client";

import React, { useState } from "react";
import { Screenplay } from "@/types/domain";

interface StructureReviewProps {
  screenplay: Screenplay;
  onApproveStructure: () => void;
  isApproved: boolean;
}

export const StructureReview: React.FC<StructureReviewProps> = ({
  screenplay,
  onApproveStructure,
  isApproved,
}) => {
  const [activeTab, setActiveTab] = useState<"scenes" | "characters" | "props" | "locations" | "unresolved">("scenes");

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-stone-900">
              Extracted Screenplay Structure
            </h2>
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-600/20">
              Deterministic Parser
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Verified canonical scene hierarchy, character cues, dialogues, and extracted props.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isApproved ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Structure Approved
            </span>
          ) : (
            <button
              type="button"
              onClick={onApproveStructure}
              disabled={screenplay.scenes.length === 0}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-700 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <span>Approve Structure & Proceed</span>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Metric Counters */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("scenes")}
          className={`rounded-lg p-2.5 text-left border transition-all ${
            activeTab === "scenes"
              ? "border-amber-600 bg-amber-50/50 text-amber-900"
              : "border-stone-200 bg-stone-50/60 hover:bg-stone-100 text-stone-700"
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-stone-500 block">Scenes</span>
          <span className="text-base font-bold text-stone-900">{screenplay.scenes.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("characters")}
          className={`rounded-lg p-2.5 text-left border transition-all ${
            activeTab === "characters"
              ? "border-amber-600 bg-amber-50/50 text-amber-900"
              : "border-stone-200 bg-stone-50/60 hover:bg-stone-100 text-stone-700"
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-stone-500 block">Characters</span>
          <span className="text-base font-bold text-stone-900">{screenplay.characters.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("props")}
          className={`rounded-lg p-2.5 text-left border transition-all ${
            activeTab === "props"
              ? "border-amber-600 bg-amber-50/50 text-amber-900"
              : "border-stone-200 bg-stone-50/60 hover:bg-stone-100 text-stone-700"
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-stone-500 block">Props</span>
          <span className="text-base font-bold text-stone-900">{screenplay.props.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("locations")}
          className={`rounded-lg p-2.5 text-left border transition-all ${
            activeTab === "locations"
              ? "border-amber-600 bg-amber-50/50 text-amber-900"
              : "border-stone-200 bg-stone-50/60 hover:bg-stone-100 text-stone-700"
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-stone-500 block">Locations</span>
          <span className="text-base font-bold text-stone-900">{screenplay.locations.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("unresolved")}
          className={`rounded-lg p-2.5 text-left border transition-all ${
            activeTab === "unresolved"
              ? "border-amber-600 bg-amber-50/50 text-amber-900"
              : "border-stone-200 bg-stone-50/60 hover:bg-stone-100 text-stone-700"
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-stone-500 block">Unresolved</span>
          <span className="text-base font-bold text-stone-900">{screenplay.unresolvedItems.length}</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="mt-4">
        {/* SCENES */}
        {activeTab === "scenes" && (
          <div className="space-y-3">
            {screenplay.scenes.map((scene) => (
              <div key={scene.id} className="rounded-lg border border-stone-200 p-4 bg-stone-50/40 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-stone-900 px-2 py-0.5 font-mono text-[11px] font-bold text-white">
                      {scene.id}
                    </span>
                    <span className="font-bold text-stone-900 text-sm">
                      Scene {scene.sceneNumber}: {scene.heading}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-500 font-mono text-[11px]">
                    <span className="bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      {scene.interiorExterior}
                    </span>
                    <span className="bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      {scene.timeOfDay}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-stone-600">
                  <div>
                    <span className="font-semibold text-stone-700 block">Location:</span>
                    <span>{scene.locationName} ({scene.locationId})</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700 block">Characters in Scene:</span>
                    <span>{scene.characterIds.join(", ") || "None extracted"}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700 block">Dialogue Beats:</span>
                    <span>{scene.dialogue.length} dialogue lines · {scene.actions.length} action blocks</span>
                  </div>
                </div>

                {scene.dialogue.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-stone-100">
                    <span className="font-semibold text-stone-700 block mb-1.5">Dialogue Sample:</span>
                    <div className="space-y-1.5 font-mono bg-white p-2.5 rounded border border-stone-200 max-h-40 overflow-y-auto">
                      {scene.dialogue.slice(0, 3).map((d) => (
                        <div key={d.id} className="text-[11px]">
                          <span className="font-bold text-stone-900">{d.characterName}:</span>{" "}
                          <span className="text-stone-700">{d.text}</span>
                        </div>
                      ))}
                      {scene.dialogue.length > 3 && (
                        <p className="text-[10px] text-stone-400 italic">
                          + {scene.dialogue.length - 3} more dialogue lines extracted
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CHARACTERS */}
        {activeTab === "characters" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {screenplay.characters.map((char) => (
              <div key={char.id} className="rounded-lg border border-stone-200 p-3.5 bg-stone-50/50">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-[11px]">
                      {char.id}
                    </span>
                    <span className="font-bold text-stone-900 text-sm">{char.name}</span>
                  </div>
                  <span className="text-stone-500 font-mono text-[11px]">
                    {char.dialogueCount} dialogues
                  </span>
                </div>
                <p className="mt-2 text-stone-600 text-[11px] leading-relaxed">
                  <strong className="text-stone-700">Description:</strong> {char.description || "No explicit description extracted"}
                </p>
                <div className="mt-2 text-[11px] text-stone-500">
                  <span>Appears in scenes: {char.sceneIds.join(", ")}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PROPS */}
        {activeTab === "props" && (
          <div className="space-y-2 text-xs">
            {screenplay.props.length === 0 ? (
              <p className="text-stone-500 italic p-4 text-center">No explicit props detected.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {screenplay.props.map((prop) => (
                  <div key={prop.id} className="rounded-lg border border-stone-200 p-2.5 bg-stone-50/40">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{prop.name}</span>
                      <span className="font-mono text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                        {prop.id}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500 mt-1 block">
                      Referenced in: {prop.sceneIds.join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LOCATIONS */}
        {activeTab === "locations" && (
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {screenplay.locations.map((loc) => (
                <div key={loc.id} className="rounded-lg border border-stone-200 p-3 bg-stone-50/40">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{loc.name}</span>
                    <span className="font-mono text-[10px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                      {loc.id} · {loc.type}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Bound to scenes: {loc.sceneIds.join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UNRESOLVED */}
        {activeTab === "unresolved" && (
          <div className="text-xs space-y-2">
            {screenplay.unresolvedItems.length === 0 ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 text-center">
                ✓ No unresolved screenplay structures detected. All elements cleanly parsed.
              </div>
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 text-amber-950 space-y-1.5">
                <p className="font-semibold">Items Requiring Review:</p>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  {screenplay.unresolvedItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
