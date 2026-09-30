"use client";

import React, { useState } from "react";
import { VisualPackages } from "@/types/domain";

interface VisualConceptBoardProps {
  visualPackages: VisualPackages;
  onProceedToContinuity: () => void;
  onUpdateVisualPackages?: (updated: VisualPackages) => void;
  isGeminiConfigured?: boolean;
}

export const VisualConceptBoard: React.FC<VisualConceptBoardProps> = ({
  visualPackages,
  onProceedToContinuity,
  onUpdateVisualPackages,
  isGeminiConfigured = false,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"scenes" | "characters">("scenes");
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
  const [batchProgress, setBatchProgress] = useState<{
    current: number;
    total: number;
    label: string;
  } | null>(null);
  const [zoomedImage, setZoomedImage] = useState<{ url: string; title: string } | null>(null);

  const copyPrompt = (id: string, prompt: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(prompt);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Generate a single visual image via Gemini server API
  const handleGenerateSingle = async (
    visualId: string,
    prompt: string,
    type: "scene" | "character"
  ) => {
    if (generatingIds.has(visualId)) return;

    setGeneratingIds((prev) => new Set(prev).add(visualId));

    try {
      const res = await fetch("/api/visuals/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, visualId, type }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      if (data.imageUrl && onUpdateVisualPackages) {
        const updatedScenePackages = visualPackages.scenePackages.map((s) =>
          s.visualId === visualId
            ? { ...s, imageUrl: data.imageUrl, imageGeneratedAt: data.generatedAt, imageError: undefined }
            : s
        );
        const updatedCharPackages = visualPackages.characterPackages.map((c) =>
          c.visualId === visualId
            ? { ...c, imageUrl: data.imageUrl, imageGeneratedAt: data.generatedAt, imageError: undefined }
            : c
        );

        onUpdateVisualPackages({
          ...visualPackages,
          scenePackages: updatedScenePackages,
          characterPackages: updatedCharPackages,
          isLiveAiGenerated: true,
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (onUpdateVisualPackages) {
        const updatedScenePackages = visualPackages.scenePackages.map((s) =>
          s.visualId === visualId ? { ...s, imageError: errorMsg } : s
        );
        const updatedCharPackages = visualPackages.characterPackages.map((c) =>
          c.visualId === visualId ? { ...c, imageError: errorMsg } : c
        );
        onUpdateVisualPackages({
          ...visualPackages,
          scenePackages: updatedScenePackages,
          characterPackages: updatedCharPackages,
        });
      }
    } finally {
      setGeneratingIds((prev) => {
        const next = new Set(prev);
        next.delete(visualId);
        return next;
      });
    }
  };

  // Generate all pending images with real-time progress
  const handleGenerateAll = async () => {
    if (batchProgress !== null) return;

    const allItems: Array<{
      id: string;
      prompt: string;
      label: string;
      type: "scene" | "character";
    }> = [
      ...visualPackages.scenePackages.map((s) => ({
        id: s.visualId,
        prompt: s.finalPrompt,
        label: `Scene Visual (${s.sceneId})`,
        type: "scene" as const,
      })),
      ...visualPackages.characterPackages.map((c) => ({
        id: c.visualId,
        prompt: c.finalPrompt,
        label: `Character Portrait (${c.characterName})`,
        type: "character" as const,
      })),
    ];

    const total = allItems.length;
    let currentPkg = { ...visualPackages };

    for (let i = 0; i < total; i++) {
      const item = allItems[i];
      setBatchProgress({
        current: i + 1,
        total,
        label: item.label,
      });
      setGeneratingIds((prev) => new Set(prev).add(item.id));

      try {
        const res = await fetch("/api/visuals/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: item.prompt, visualId: item.id, type: item.type }),
        });

        const data = await res.json();
        if (res.ok && data.imageUrl) {
          currentPkg = {
            ...currentPkg,
            scenePackages: currentPkg.scenePackages.map((s) =>
              s.visualId === item.id
                ? { ...s, imageUrl: data.imageUrl, imageGeneratedAt: data.generatedAt, imageError: undefined }
                : s
            ),
            characterPackages: currentPkg.characterPackages.map((c) =>
              c.visualId === item.id
                ? { ...c, imageUrl: data.imageUrl, imageGeneratedAt: data.generatedAt, imageError: undefined }
                : c
            ),
            isLiveAiGenerated: true,
          };
          if (onUpdateVisualPackages) {
            onUpdateVisualPackages(currentPkg);
          }
        }
      } catch (e) {
        console.error(`Failed to generate visual for ${item.id}:`, e);
      } finally {
        setGeneratingIds((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
      }
    }

    setBatchProgress(null);
  };

  const totalImagesGenerated =
    visualPackages.scenePackages.filter((s) => s.imageUrl).length +
    visualPackages.characterPackages.filter((c) => c.imageUrl).length;
  const totalItems =
    visualPackages.scenePackages.length + visualPackages.characterPackages.length;

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
      {/* Zoom Modal */}
      {zoomedImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-xl border border-stone-700 bg-stone-900 p-2 shadow-2xl">
            <div className="flex items-center justify-between pb-2 px-2 text-stone-200 text-xs">
              <span className="font-semibold">{zoomedImage.title}</span>
              <button
                type="button"
                onClick={() => setZoomedImage(null)}
                className="rounded px-2 py-0.5 text-stone-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomedImage.url}
              alt={zoomedImage.title}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-stone-900">
              Visual Concept Board & Production Pack
            </h2>
            <span
              className={`rounded px-2 py-0.5 text-[11px] font-mono font-medium ${
                isGeminiConfigured
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-stone-100 text-stone-700"
              }`}
            >
              {isGeminiConfigured ? "✨ Gemini 3.1 Flash Image" : "Deterministic Prompt Engine"}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Structured scene concept packages and character consistency specifications for rural Jodhpur setting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Batch Generate Button */}
          {isGeminiConfigured && onUpdateVisualPackages && (
            <button
              type="button"
              disabled={batchProgress !== null}
              onClick={handleGenerateAll}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-2xs transition-colors cursor-pointer ${
                batchProgress !== null
                  ? "bg-stone-200 text-stone-500 cursor-not-allowed"
                  : "bg-purple-700 text-white hover:bg-purple-800"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>
                {batchProgress !== null
                  ? `Generating (${batchProgress.current}/${batchProgress.total})...`
                  : totalImagesGenerated > 0
                  ? "Regenerate All AI Visuals"
                  : "Generate All AI Visuals (Gemini)"}
              </span>
            </button>
          )}

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

      {/* Progress Bar (During Batch Generation) */}
      {batchProgress && (
        <div className="mt-3.5 rounded-lg border border-purple-200 bg-purple-50 p-3 text-xs text-purple-950 space-y-2">
          <div className="flex items-center justify-between font-semibold">
            <span>
              ⚡ Generating Visual {batchProgress.current} / {batchProgress.total}: {batchProgress.label}
            </span>
            <span className="font-mono">
              {Math.round((batchProgress.current / batchProgress.total) * 100)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-purple-200">
            <div
              className="h-full bg-purple-600 transition-all duration-300"
              style={{
                width: `${(batchProgress.current / batchProgress.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Image Provider Notice */}
      <div className="mt-3.5 rounded-lg border border-stone-200 bg-stone-50 p-3 text-xs text-stone-700 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isGeminiConfigured ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
              </span>
              <span>
                <strong>Gemini Image Provider Connected</strong> — Model:{" "}
                <code className="bg-stone-200/80 px-1 py-0.5 rounded font-mono text-[11px]">
                  gemini-3.1-flash-image
                </code>
                . {totalImagesGenerated} of {totalItems} visuals generated.
              </span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4 text-stone-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                <strong>Deterministic Demo Mode</strong> — Structured prompt specifications ready for diffusion/Gemini models.
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] text-stone-500 font-mono">
          35mm Anamorphic · Rural Jodhpur
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
                    {pkg.imageUrl && (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                        ✓ AI Generated
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Per-card generate button */}
                    {isGeminiConfigured && onUpdateVisualPackages && (
                      <button
                        type="button"
                        disabled={generatingIds.has(pkg.visualId)}
                        onClick={() => handleGenerateSingle(pkg.visualId, pkg.finalPrompt, "scene")}
                        className="inline-flex items-center gap-1 rounded-md border border-purple-300 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-900 hover:bg-purple-100 transition-colors shadow-2xs"
                      >
                        {generatingIds.has(pkg.visualId) ? (
                          <>
                            <svg className="animate-spin h-3.5 w-3.5 text-purple-700" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <span>✨ {pkg.imageUrl ? "Regenerate Visual" : "Generate with Gemini"}</span>
                          </>
                        )}
                      </button>
                    )}

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
                </div>

                {/* Error Banner if generation failed */}
                {pkg.imageError && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-2.5 text-xs text-red-800 flex items-center justify-between">
                    <span>Generation notice: {pkg.imageError}</span>
                    <button
                      type="button"
                      onClick={() => handleGenerateSingle(pkg.visualId, pkg.finalPrompt, "scene")}
                      className="text-xs font-semibold underline hover:text-red-950"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Visual Concept Display (Generated Image OR Styled Artboard Placeholder) */}
                {pkg.imageUrl ? (
                  <div className="relative overflow-hidden rounded-lg border border-amber-300/60 bg-stone-950 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.subject}
                      className="w-full max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => setZoomedImage({ url: pkg.imageUrl!, title: `Scene Visual: ${pkg.sceneId}` })}
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-amber-200">{pkg.subject}</p>
                          <p className="text-[11px] text-stone-300">
                            {pkg.lighting} · {pkg.mood}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setZoomedImage({ url: pkg.imageUrl!, title: `Scene Visual: ${pkg.sceneId}` })}
                          className="rounded bg-black/60 px-2 py-1 text-[11px] font-medium text-stone-200 hover:text-white backdrop-blur-xs"
                        >
                          🔍 Expand
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
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
                )}

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
                    {charPkg.imageUrl && (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                        ✓ AI Portrait
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isGeminiConfigured && onUpdateVisualPackages && (
                      <button
                        type="button"
                        disabled={generatingIds.has(charPkg.visualId)}
                        onClick={() => handleGenerateSingle(charPkg.visualId, charPkg.finalPrompt, "character")}
                        className="rounded border border-purple-300 bg-purple-50 px-2 py-1 text-xs font-semibold text-purple-900 hover:bg-purple-100"
                      >
                        {generatingIds.has(charPkg.visualId) ? "Generating..." : charPkg.imageUrl ? "Regenerate" : "✨ Generate"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => copyPrompt(charPkg.visualId, charPkg.finalPrompt)}
                      className="rounded border border-stone-300 bg-white px-2 py-1 text-xs font-medium text-stone-700 hover:bg-stone-50"
                    >
                      {copiedId === charPkg.visualId ? "Copied!" : "Copy Prompt"}
                    </button>
                  </div>
                </div>

                {charPkg.imageError && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-800 flex items-center justify-between">
                    <span>{charPkg.imageError}</span>
                    <button
                      type="button"
                      onClick={() => handleGenerateSingle(charPkg.visualId, charPkg.finalPrompt, "character")}
                      className="text-xs underline font-semibold"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Character Portrait (Generated Image OR Text Specification) */}
                {charPkg.imageUrl ? (
                  <div className="relative overflow-hidden rounded-lg border border-stone-700 bg-stone-950 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={charPkg.imageUrl}
                      alt={charPkg.characterName}
                      className="w-full max-h-72 object-cover cursor-pointer hover:opacity-95"
                      onClick={() => setZoomedImage({ url: charPkg.imageUrl!, title: `Portrait: ${charPkg.characterName}` })}
                    />
                    <div className="p-3 bg-stone-900 text-stone-200">
                      <p className="text-xs font-semibold text-amber-300">{charPkg.characterName} · {charPkg.ageDescriptor}</p>
                      <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-2">{charPkg.appearance}</p>
                    </div>
                  </div>
                ) : (
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
                )}

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
