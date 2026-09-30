"use client";

import React from "react";

export interface AiServerStatus {
  configured: boolean;
  provider: string;
  textModel: string;
  imageModel: string;
}

interface HeaderProps {
  onResetProject?: () => void;
  onLoadDemoProject?: () => void;
  aiStatus?: AiServerStatus | null;
  aiMode?: "live" | "demo";
  onToggleAiMode?: (mode: "live" | "demo") => void;
}

export const Header: React.FC<HeaderProps> = ({
  onResetProject,
  onLoadDemoProject,
  aiStatus,
  aiMode = "live",
  onToggleAiMode,
}) => {
  const isLiveConnected = Boolean(aiStatus?.configured);

  return (
    <header className="border-b border-stone-200 bg-white shadow-xs">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center justify-center rounded-md bg-amber-700 px-2.5 py-1 text-xs font-semibold tracking-wider text-amber-50 uppercase">
                Studio
              </span>
              <h1 className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
                Cultural Screenplay & Visual Adaptation Studio
              </h1>
            </div>
            <p className="max-w-3xl text-sm text-stone-600">
              AI-powered cultural adaptation studio: grounding screenplays in regional Marwari (Rural Jodhpur, Devanagari) and generating consistent 35mm visual production packs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {onLoadDemoProject && (
              <button
                type="button"
                onClick={onLoadDemoProject}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 font-semibold text-amber-900 hover:bg-amber-100 transition-colors shadow-2xs cursor-pointer"
              >
                <span>⚡ Load Demo Project</span>
              </button>
            )}

            {onResetProject && (
              <button
                type="button"
                onClick={onResetProject}
                className="inline-flex items-center gap-1 rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <span>↺ Reset</span>
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/80 px-3 py-1 font-medium text-amber-900">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-600"></span>
              </span>
              <span><strong>Marwari · Rural Jodhpur</strong> (देवनागरी)</span>
            </div>

            {/* AI Status Badge & Mode Switcher */}
            {isLiveConnected ? (
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 font-medium text-emerald-900 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
                </span>
                <span><strong>LIVE AI</strong> (Gemini Connected)</span>
                {onToggleAiMode && (
                  <button
                    type="button"
                    onClick={() => onToggleAiMode(aiMode === "live" ? "demo" : "live")}
                    className="ml-1 rounded bg-emerald-200/70 px-1.5 py-0.5 text-[10px] font-mono hover:bg-emerald-300 cursor-pointer"
                    title="Click to toggle between Live Gemini AI and Deterministic Demo fallback"
                  >
                    Mode: {aiMode === "live" ? "Live" : "Fallback"}
                  </button>
                )}
              </div>
            ) : (
              <div
                className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 px-2.5 py-1 font-medium text-stone-600"
                title="GEMINI_API_KEY not detected in .env.local. Operating in 100% deterministic fallback demo mode."
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                <span>Deterministic Demo Mode</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
