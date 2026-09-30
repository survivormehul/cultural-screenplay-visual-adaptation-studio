"use client";

import React, { useState } from "react";
import {
  AdaptationCategory,
  AdaptationDecision,
  AdaptationPlan as IAdaptationPlan,
  AdaptationSuggestion,
  SuggestionStatus,
} from "@/types/domain";

interface AdaptationPlanProps {
  plan: IAdaptationPlan;
  decisions: Record<string, AdaptationDecision>;
  onDecisionChange: (suggestionId: string, status: SuggestionStatus, editedValue?: string) => void;
  onApproveAll: () => void;
  onRejectAll: () => void;
  onResetDecisions: () => void;
  onProceedToApprovalGate: () => void;
}

export const AdaptationPlan: React.FC<AdaptationPlanProps> = ({
  plan,
  decisions,
  onDecisionChange,
  onApproveAll,
  onRejectAll,
  onResetDecisions,
  onProceedToApprovalGate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const categories: AdaptationCategory[] = [
    "Dialogue/Register",
    "Greeting/Address",
    "Environment",
    "Costume",
    "Props",
    "Food",
    "Social context",
    "Local terminology",
  ];

  const getEffectiveStatus = (s: AdaptationSuggestion): SuggestionStatus => {
    return decisions[s.id]?.status || s.status;
  };

  const getEffectiveProposed = (s: AdaptationSuggestion): string => {
    if (decisions[s.id]?.status === "edited" && decisions[s.id]?.editedValue) {
      return decisions[s.id].editedValue!;
    }
    return s.userEditedText || s.proposed;
  };

  const approvedCount = plan.suggestions.filter((s) => getEffectiveStatus(s) === "approved").length;
  const pendingCount = plan.suggestions.filter((s) => getEffectiveStatus(s) === "pending").length;
  const rejectedCount = plan.suggestions.filter((s) => getEffectiveStatus(s) === "rejected").length;
  const editedCount = plan.suggestions.filter((s) => getEffectiveStatus(s) === "edited").length;

  const filteredSuggestions = selectedCategory === "ALL"
    ? plan.suggestions
    : plan.suggestions.filter((s) => s.category === selectedCategory);

  const startEdit = (s: AdaptationSuggestion) => {
    setEditingId(s.id);
    setEditValue(getEffectiveProposed(s));
  };

  const saveEdit = (suggestionId: string) => {
    if (editValue.trim()) {
      onDecisionChange(suggestionId, "edited", editValue.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-stone-900">
              Cultural Adaptation Plan: Marwari (Rural Jodhpur)
            </h2>
            <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-900">
              {plan.totalSuggestions} Suggestions
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Targeting Thar vernacular, Devanagari script, architectural motifs, and filial honorifics.
          </p>
        </div>

        <button
          type="button"
          onClick={onProceedToApprovalGate}
          disabled={plan.suggestions.length === 0}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <span>Go to Human Approval Gate</span>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="mt-3.5 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-950 flex items-start gap-2">
        <svg className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <span className="font-semibold">Review Requirement:</span> Demo adaptation suggestions require human/native-speaker review before production use.
        </div>
      </div>

      {/* Status Counters & Bulk Controls */}
      <div className="mt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-stone-50/80 p-3 rounded-lg border border-stone-200 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-stone-700">Approved: <strong>{approvedCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
            <span className="text-stone-700">Edited: <strong>{editedCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
            <span className="text-stone-700">Pending: <strong>{pendingCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
            <span className="text-stone-700">Rejected: <strong>{rejectedCount}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onApproveAll}
            className="rounded-md bg-emerald-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors"
          >
            Approve All
          </button>
          <button
            type="button"
            onClick={onRejectAll}
            className="rounded-md border border-stone-300 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Reject All
          </button>
          <button
            type="button"
            onClick={onResetDecisions}
            className="rounded-md border border-stone-300 bg-white px-2.5 py-1 text-xs font-medium text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Reset Decisions
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-3.5 flex flex-wrap gap-1.5 text-xs">
        <button
          type="button"
          onClick={() => setSelectedCategory("ALL")}
          className={`rounded-md px-2.5 py-1 font-medium transition-all ${
            selectedCategory === "ALL"
              ? "bg-stone-900 text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          All Categories ({plan.suggestions.length})
        </button>
        {categories.map((cat) => {
          const count = plan.suggestions.filter((s) => s.category === cat).length;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-amber-800 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Suggestion Cards */}
      <div className="mt-4 space-y-3.5">
        {filteredSuggestions.map((s) => {
          const status = getEffectiveStatus(s);
          const isEditing = editingId === s.id;
          const effectiveProposed = getEffectiveProposed(s);

          return (
            <div
              key={s.id}
              className={`rounded-lg border p-4 transition-all text-xs ${
                status === "approved"
                  ? "border-emerald-200 bg-emerald-50/20"
                  : status === "edited"
                  ? "border-blue-200 bg-blue-50/20"
                  : status === "rejected"
                  ? "border-red-200 bg-red-50/20 opacity-75"
                  : "border-stone-200 bg-white"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold bg-stone-900 text-white px-2 py-0.5 rounded text-[11px]">
                    {s.id}
                  </span>
                  <span className="font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                    {s.category}
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">
                    Scene: {s.sceneId}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-500">
                    Confidence: {(s.confidence * 100).toFixed(0)}%
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 font-bold uppercase text-[10px] ${
                      status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : status === "edited"
                        ? "bg-blue-100 text-blue-800"
                        : status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              </div>

              {/* Transformation diff */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 bg-stone-50/60 p-3 rounded border border-stone-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Original Source Text
                  </span>
                  <p className="font-mono text-stone-800 bg-white p-2 rounded border border-stone-200">
                    {s.original}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                    Proposed Cultural Adaptation (Marwari / Devanagari)
                  </span>
                  {isEditing ? (
                    <div className="space-y-1.5">
                      <textarea
                        rows={2}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full rounded border border-blue-400 p-2 font-mono text-xs text-stone-900 bg-white"
                      />
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => saveEdit(s.id)}
                          className="rounded bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-blue-700"
                        >
                          Save Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded border border-stone-300 bg-white px-2 py-0.5 text-[11px] text-stone-600 hover:bg-stone-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="font-mono text-stone-900 bg-amber-50/60 p-2 rounded border border-amber-200">
                      <p className="font-medium text-amber-950">{effectiveProposed}</p>
                      {s.devanagariProposed && (
                        <p className="mt-1 text-sm font-bold text-amber-900">
                          {s.devanagariProposed}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Rationale */}
              <div className="mt-2.5 text-stone-600 text-[11px] leading-relaxed">
                <strong className="text-stone-700">Cultural Rationale:</strong> {s.rationale}
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center justify-end gap-2 border-t border-stone-100 pt-2">
                <button
                  type="button"
                  onClick={() => onDecisionChange(s.id, "approved")}
                  className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                    status === "approved"
                      ? "bg-emerald-600 text-white"
                      : "border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                  }`}
                >
                  ✓ Approve
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(s)}
                  className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                    status === "edited"
                      ? "bg-blue-600 text-white"
                      : "border border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100"
                  }`}
                >
                  ✎ Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDecisionChange(s.id, "rejected")}
                  className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                    status === "rejected"
                      ? "bg-red-600 text-white"
                      : "border border-red-300 bg-red-50 text-red-800 hover:bg-red-100"
                  }`}
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
