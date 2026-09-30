"use client";

import React from "react";
import {
  AdaptationDecision,
  AdaptationPlan,
  SuggestionStatus,
} from "@/types/domain";

interface ApprovalPanelProps {
  plan: AdaptationPlan;
  decisions: Record<string, AdaptationDecision>;
  onApprovePending: () => void;
  onRejectPending: () => void;
  onProceedToAdaptation: () => void;
  onBackToPlan: () => void;
}

export const ApprovalPanel: React.FC<ApprovalPanelProps> = ({
  plan,
  decisions,
  onApprovePending,
  onRejectPending,
  onProceedToAdaptation,
  onBackToPlan,
}) => {
  const getStatus = (id: string, fallback: SuggestionStatus): SuggestionStatus => {
    return decisions[id]?.status || fallback;
  };

  const approvedList = plan.suggestions.filter(
    (s) => getStatus(s.id, s.status) === "approved"
  );
  const editedList = plan.suggestions.filter(
    (s) => getStatus(s.id, s.status) === "edited"
  );
  const rejectedList = plan.suggestions.filter(
    (s) => getStatus(s.id, s.status) === "rejected"
  );
  const pendingList = plan.suggestions.filter(
    (s) => getStatus(s.id, s.status) === "pending"
  );

  const pendingCount = pendingList.length;
  const hasPending = pendingCount > 0;
  const totalEffective = approvedList.length + editedList.length;

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-stone-900">
              Human Approval Gate
            </h2>
            <span className="rounded bg-stone-100 px-2 py-0.5 text-[11px] font-mono text-stone-700">
              Editorial Governance
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Strict verification: Adapted screenplay cannot be generated while cultural decisions remain pending.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToPlan}
            className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            ← Back to Plan
          </button>
        </div>
      </div>

      {/* Counters Bar */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-stone-700">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Total</span>
          <span className="text-base font-bold text-stone-900">{plan.suggestions.length} suggestions</span>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 text-emerald-950">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block">Approved</span>
          <span className="text-base font-bold">{approvedList.length} approved</span>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-3 text-blue-950">
          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 block">Edited</span>
          <span className="text-base font-bold">{editedList.length} edited</span>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-amber-950">
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 block">Pending</span>
          <span className="text-base font-bold">{pendingList.length} pending</span>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50/60 p-3 text-red-950">
          <span className="text-[10px] uppercase font-bold tracking-wider text-red-700 block">Rejected</span>
          <span className="text-base font-bold">{rejectedList.length} rejected</span>
        </div>
      </div>

      {/* Pending Warning Banner if pending items remain */}
      {hasPending ? (
        <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950 space-y-3">
          <div className="flex items-start gap-2.5">
            <svg className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-bold text-amber-950 text-sm">
                Review required before adaptation
              </p>
              <p className="text-amber-900 mt-1 font-semibold text-xs">
                {pendingCount} cultural decision{pendingCount > 1 ? "s" : ""} still require{pendingCount === 1 ? "s" : ""} review.
              </p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                The adaptation pipeline is paused at this gate. The adapted screenplay cannot be generated while decisions are pending, ensuring unreviewed suggestions are never accidentally injected.
              </p>
            </div>
          </div>

          <div className="pt-1 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onApprovePending}
              className="rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              ✓ Approve Remaining ({pendingCount})
            </button>
            <button
              type="button"
              onClick={onRejectPending}
              className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              ✕ Reject Remaining ({pendingCount})
            </button>
            <button
              type="button"
              onClick={onBackToPlan}
              className="rounded-md border border-amber-300 bg-amber-100/70 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-200 transition-colors cursor-pointer"
            >
              ✎ Review In Plan Editor
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-950 flex items-start gap-2.5">
          <svg className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="space-y-1">
            <p className="font-bold text-emerald-900 text-sm">
              All Decisions Reviewed & Signed Off
            </p>
            <p className="text-emerald-800">
              Ready to generate adapted screenplay with <strong>{totalEffective} active cultural adjustments</strong> ({approvedList.length} approved, {editedList.length} user-edited, {rejectedList.length} excluded). Zero decisions pending.
            </p>
          </div>
        </div>
      )}

      {/* Decision Summary Breakdown */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-3">
          <span className="font-bold text-emerald-900 block text-sm">
            Active in Output ({totalEffective})
          </span>
          <p className="text-[11px] text-emerald-700 mt-1">
            {approvedList.length} approved · {editedList.length} edited
          </p>
          <div className="mt-2.5 space-y-1 font-mono text-[11px] max-h-36 overflow-y-auto">
            {totalEffective === 0 ? (
              <p className="text-stone-400 italic">No approved adaptations.</p>
            ) : (
              [...approvedList, ...editedList].map((s) => (
                <div key={s.id} className="text-stone-700 truncate" title={`${s.id}: ${s.original}`}>
                  • {s.id}: {s.original} → {s.devanagariProposed || s.proposed}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50/40 p-3">
          <span className="font-bold text-red-900 block text-sm">
            Excluded ({rejectedList.length})
          </span>
          <p className="text-[11px] text-red-700 mt-1">
            Rejected suggestions strictly omitted from output
          </p>
          <div className="mt-2.5 space-y-1 font-mono text-[11px] max-h-36 overflow-y-auto">
            {rejectedList.length === 0 ? (
              <p className="text-stone-400 italic">None rejected.</p>
            ) : (
              rejectedList.map((s) => (
                <div key={s.id} className="text-red-800 line-through truncate" title={`${s.id}: ${s.original}`}>
                  • {s.id}: {s.original}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-3">
          <span className="font-bold text-amber-900 block text-sm">
            Pending Decisions ({pendingList.length})
          </span>
          <p className="text-[11px] text-amber-700 mt-1">
            Blocks screenplay generation until resolved
          </p>
          <div className="mt-2.5 space-y-1 font-mono text-[11px] max-h-36 overflow-y-auto">
            {pendingList.length === 0 ? (
              <p className="text-emerald-700 font-semibold">✓ Zero pending decisions.</p>
            ) : (
              pendingList.map((s) => (
                <div key={s.id} className="text-amber-900 font-medium truncate" title={`${s.id}: ${s.original}`}>
                  • {s.id}: {s.original}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Trigger Action */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100 pt-4">
        <span className="text-xs text-stone-500">
          Target Language: <strong>Marwari (Rural Jodhpur)</strong> · Script: <strong>Devanagari</strong>
        </span>

        <button
          type="button"
          disabled={hasPending}
          onClick={onProceedToAdaptation}
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-xs font-semibold shadow-xs transition-all ${
            hasPending
              ? "bg-stone-300 text-stone-500 cursor-not-allowed opacity-75"
              : "bg-amber-700 text-white hover:bg-amber-800 cursor-pointer"
          }`}
        >
          {hasPending ? (
            <span>Review Required: {pendingCount} Cultural Decision{pendingCount > 1 ? "s" : ""} Pending</span>
          ) : (
            <>
              <span>Generate Adapted Screenplay ({totalEffective} Adaptations)</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
