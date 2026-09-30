import React from "react";
import { ACTIVE_CULTURAL_PROFILE } from "@/data/sampleScreenplay";

export const CultureSettingsCard: React.FC = () => {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-stone-900">
              Active Cultural Target & Adaptation Matrix
            </h2>
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-600/20">
              Configured
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Linguistic, spatial, and visual parameters applied during dialect transformation.
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start rounded-md border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-600">
          <svg
            className="h-3.5 w-3.5 text-stone-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>Target Profile Locked</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Culture & Dialect */}
        <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-3">
          <span className="block text-[11px] font-medium tracking-wide text-amber-900 uppercase">
            Language & Dialect
          </span>
          <p className="mt-1 text-sm font-semibold text-stone-900">
            {ACTIVE_CULTURAL_PROFILE.targetDialect}
          </p>
          <p className="text-xs text-stone-600">
            {ACTIVE_CULTURAL_PROFILE.targetCulture}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-amber-800">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-600"></span>
            <span>Orthography: <strong>Devanagari (देवनागरी)</strong></span>
          </div>
        </div>

        {/* Region & Setting */}
        <div className="rounded-lg border border-stone-200 bg-stone-50/70 p-3">
          <span className="block text-[11px] font-medium tracking-wide text-stone-500 uppercase">
            Geographic Scope
          </span>
          <p className="mt-1 text-sm font-semibold text-stone-900">
            {ACTIVE_CULTURAL_PROFILE.region}
          </p>
          <p className="text-xs text-stone-600 line-clamp-2">
            Thar basin, Sandstone Hamlets & Ancestral Havelis
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-stone-600">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-stone-500"></span>
            <span>Output Script: Devanagari Unicode</span>
          </div>
        </div>

        {/* Socio-cultural Context */}
        <div className="rounded-lg border border-stone-200 bg-stone-50/70 p-3">
          <span className="block text-[11px] font-medium tracking-wide text-stone-500 uppercase">
            Sociocultural Protocol
          </span>
          <p className="mt-1 text-xs text-stone-700 leading-relaxed">
            {ACTIVE_CULTURAL_PROFILE.socioCulturalNotes}
          </p>
        </div>
      </div>

      {/* Cultural Nuance Badges */}
      <div className="mt-4 pt-3.5 border-t border-stone-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-stone-700">Dialect Markers:</span>
          <div className="flex flex-wrap gap-1">
            {ACTIVE_CULTURAL_PROFILE.dialectMarkers.slice(0, 3).map((marker, i) => (
              <span
                key={i}
                className="rounded bg-stone-100 px-2 py-0.5 text-stone-700 font-mono text-[11px]"
              >
                {marker}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-medium text-stone-700">Visual Anchors:</span>
          <span className="text-stone-600">Jodhpur Sandstone · Baori · Safa & Odhani</span>
        </div>
      </div>

      {/* Cultural Safety & Authenticity Notice */}
      <div className="mt-3.5 rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-950 flex items-center gap-2">
        <span className="text-amber-700 text-sm shrink-0">ℹ️</span>
        <span className="text-[11px] leading-tight">
          <strong>Demo Output Notice:</strong> Native-speaker validation required before production use. Adaptations represent contextual demo suggestions, not universal cultural truths.
        </span>
      </div>
    </div>
  );
};
