"use client";

import React, { useState } from "react";
import { VisualPackages } from "@/types/domain";

interface VisualConceptBoardProps {
  visualPackages: VisualPackages;
  onProceedToContinuity: () => void;
}

export const VisualConceptBoard: React.FC<VisualConceptBoardProps> = ({
  visualPackages,
  onProceedToContinuity,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"scenes" | "characters">("scenes");

  const copyPrompt = (id: string, prompt: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(prompt);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-stone-900">
              Visual Concept Board & Prompt Packages
            </h2>
            <span className="rounded bg-stone-100 px-2 py-0.5 text-[11px] font-mono text-stone-700">
              Deterministic Prompt Engine
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Structured scene concept packages and character consistency specifications for rural Jodhpur setting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Switcher */}
          <div className="flex rounded-lg bg-stone-100 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("scenes")}
              className={`rounded-md px-3 py-1 font-medium transition-all ${
                activeTab === "scenes"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Scene Concept Prompts ({visualPackages.scenePackages.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("characters")}
              className={`rounded-md px-3 py-1 font-medium transition-all ${
                activeTab === "characters"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Character Concept Prompts ({visualPackages.characterPackages.length})
            </button>
          </div>

          <button
            type="button"
            onClick={onProceedToContinuity}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-800 transition-colors cursor-pointer"
          >
            <span>Proceed to Continuity Report</span>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mandatory Image Provider Notice */}
      <div className="mt-3.5 rounded-lg border border-stone-200 bg-stone-50 p-3 text-xs text-stone-700 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-stone-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong>Image provider not connected</strong> — prompt package generated in Demo Mode.
          </span>
        </div>
        <span className="text-[11px] text-stone-500 font-mono">
          Ready for Stable Diffusion / Midjourney / FLUX API
        </span>
      </div>

      {/* CONTENT TABS */}
      <div className="mt-4">
        {/* SCENE CONCEPT PROMPTS */}
        {activeTab === "scenes" && (
          <div className="space-y-4">
            {visualPackages.scenePackages.map((pkg) => (
              <div key={pkg.visualId} className="rounded-lg border border-stone-200 bg-stone-50/30 p-4 text-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold bg-amber-800 text-white px-2 py-0.5 rounded text-[11px]">
                      {pkg.visualId}
                    </span>
                    <span className="font-bold text-stone-900 text-sm">
                      Scene Visual: {pkg.sceneId}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyPrompt(pkg.visualId, pkg.finalPrompt)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-stone-300 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors"
                  >
                    <svg className="h-3.5 w-3.5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>{copiedId === pkg.visualId ? "Copied!" : "Copy Prompt"}</span>
                  </button>
                </div>

                {/* Styled Concept Frame Placeholder */}
                <div className="relative rounded-lg border border-amber-300/60 bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 p-6 text-white overflow-hidden shadow-inner">
                  <div className="absolute top-2 right-2 flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-[10px] font-mono text-amber-200 uppercase tracking-widest backdrop-blur-xs">
                    Concept Artboard Placeholder · 35mm
                  </div>
                  <div className="max-w-xl space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                      Subject Framing
                    </span>
                    <p className="text-sm font-semibold leading-snug text-stone-100">
                      {pkg.subject}
                    </p>
                    <p className="text-xs text-stone-300">
                      <strong>Atmosphere:</strong> {pkg.lighting} · {pkg.mood}
                    </p>
                  </div>
                </div>

                {/* Attributes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-[11px]">
                  <div className="rounded border border-stone-200 bg-white p-2.5">
                    <strong className="text-stone-700 block mb-0.5">Environment:</strong>
                    <span className="text-stone-600">{pkg.environment}</span>
                  </div>
                  <div className="rounded border border-stone-200 bg-white p-2.5">
                    <strong className="text-stone-700 block mb-0.5">Architecture:</strong>
                    <span className="text-stone-600">{pkg.architecture}</span>
                  </div>
                  <div className="rounded border border-stone-200 bg-white p-2.5">
                    <strong className="text-stone-700 block mb-0.5">Costumes:</strong>
                    <span className="text-stone-600">{pkg.costume}</span>
                  </div>
                  <div className="rounded border border-stone-200 bg-white p-2.5">
                    <strong className="text-stone-700 block mb-0.5">Key Props:</strong>
                    <span className="text-stone-600">{pkg.props}</span>
                  </div>
                  <div className="rounded border border-stone-200 bg-white p-2.5">
                    <strong className="text-stone-700 block mb-0.5">Camera & Lens:</strong>
                    <span className="text-stone-600">{pkg.camera} ({pkg.framing})</span>
                  </div>
                </div>

                {/* Constraints */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[11px]">
                  <div className="rounded border border-amber-200 bg-amber-50/50 p-2.5">
                    <strong className="text-amber-950 block mb-1">Cultural Constraints:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-stone-700">
                      {pkg.culturalConstraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded border border-sky-200 bg-sky-50/50 p-2.5">
                    <strong className="text-sky-950 block mb-1">Continuity Constraints:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-stone-700">
                      {pkg.continuityConstraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Final Prompt Code Box */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Final Engineered Prompt String:
                  </span>
                  <pre className="rounded bg-stone-900 p-3 font-mono text-[11px] text-amber-100 whitespace-pre-wrap leading-relaxed">
                    {pkg.finalPrompt}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CHARACTER CONCEPT PROMPTS */}
        {activeTab === "characters" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visualPackages.characterPackages.map((charPkg) => (
              <div key={charPkg.visualId} className="rounded-lg border border-stone-200 bg-stone-50/30 p-4 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold bg-stone-900 text-white px-2 py-0.5 rounded text-[11px]">
                      {charPkg.visualId}
                    </span>
                    <span className="font-mono text-stone-500 text-[11px]">({charPkg.characterId})</span>
                    <span className="font-bold text-stone-900 text-sm">{charPkg.characterName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyPrompt(charPkg.visualId, charPkg.finalPrompt)}
                    className="rounded border border-stone-300 bg-white px-2 py-1 text-xs font-medium text-stone-700 hover:bg-stone-50"
                  >
                    {copiedId === charPkg.visualId ? "Copied!" : "Copy Prompt"}
                  </button>
                </div>

                {/* Character Portrait Placeholder */}
                <div className="rounded-lg border border-stone-300 bg-stone-900 p-4 text-white space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                    Portrait Specification · {charPkg.characterId} · {charPkg.ageDescriptor}
                  </span>
                  <p className="text-xs text-stone-200 leading-relaxed">
                    {charPkg.appearance}
                  </p>
                  <p className="text-[11px] text-stone-400 pt-1">
                    <strong>Costume:</strong> {charPkg.costume}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    <strong>Environment Context:</strong> {charPkg.environment}
                  </p>
                </div>

                <div className="rounded border border-stone-200 bg-white p-2.5 text-[11px]">
                  <strong className="text-stone-700 block mb-1">Continuity Requirements:</strong>
                  <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                    {charPkg.continuityRequirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Character Prompt:
                  </span>
                  <pre className="rounded bg-stone-900 p-2.5 font-mono text-[11px] text-amber-100 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
                    {charPkg.finalPrompt}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
