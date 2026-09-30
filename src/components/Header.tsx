import React from "react";

interface HeaderProps {
  onResetProject?: () => void;
  onLoadDemoProject?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onResetProject,
  onLoadDemoProject,
}) => {
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
              Deterministic local demo studio: adapting narrative screenplays to regional Marwari (Rural Jodhpur, Devanagari) while preserving plot, characters, and continuity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {onLoadDemoProject && (
              <button
                type="button"
                onClick={onLoadDemoProject}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 font-semibold text-amber-900 hover:bg-amber-100 transition-colors shadow-2xs"
              >
                <span>⚡ Load Demo Project</span>
              </button>
            )}

            {onResetProject && (
              <button
                type="button"
                onClick={onResetProject}
                className="inline-flex items-center gap-1 rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
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

            <div className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 px-2.5 py-1 font-medium text-stone-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>Deterministic Demo Mode</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
