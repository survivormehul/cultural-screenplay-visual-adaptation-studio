"use client";

import React, { useState } from "react";
import { ContinuityCategory, ContinuityReport as IContinuityReport } from "@/types/domain";

interface ContinuityReportViewProps {
  report: IContinuityReport;
  onReRunCheck: () => void;
  onProceedToExport: () => void;
}

export const ContinuityReportView: React.FC<ContinuityReportViewProps> = ({
  report,
  onReRunCheck,
  onProceedToExport,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = Array.from(new Set(report.checks.map((c) => c.category))) as ContinuityCategory[];

  const filteredChecks = report.checks.filter((c) => {
    const matchesSeverity = selectedSeverity === "ALL" || c.severity === selectedSeverity;
    const matchesCategory = selectedCategory === "ALL" || c.category === selectedCategory;
    return matchesSeverity && matchesCategory;
  });

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-stone-900">
              Continuity & Narrative Verification Report
            </h2>
            <span className="rounded bg-stone-100 px-2 py-0.5 text-[11px] font-mono text-stone-700">
              Report ID: {report.reportId}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Automated audit covering character preservation, costume transitions, prop persistence, and human sign-off gates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReRunCheck}
            className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
          >
            ↻ Run Continuity Check
          </button>

          <button
            type="button"
            onClick={onProceedToExport}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-700 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-800 transition-colors cursor-pointer"
          >
            <span>Proceed to Export</span>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <button
          type="button"
          onClick={() => setSelectedSeverity("ALL")}
          className={`rounded-lg border p-3 text-left transition-all ${
            selectedSeverity === "ALL"
              ? "border-stone-900 bg-stone-900 text-white"
              : "border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">
            Total Checks
          </span>
          <span className="text-lg font-bold">{report.totalChecks}</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedSeverity("PASS")}
          className={`rounded-lg border p-3 text-left transition-all ${
            selectedSeverity === "PASS"
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">
            Passed
          </span>
          <span className="text-lg font-bold">{report.passed}</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedSeverity("WARNING")}
          className={`rounded-lg border p-3 text-left transition-all ${
            selectedSeverity === "WARNING"
              ? "border-amber-600 bg-amber-600 text-white"
              : "border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-950"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">
            Warnings
          </span>
          <span className="text-lg font-bold">{report.warnings}</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedSeverity("ERROR")}
          className={`rounded-lg border p-3 text-left transition-all ${
            selectedSeverity === "ERROR"
              ? "border-red-600 bg-red-600 text-white"
              : "border-red-200 bg-red-50/70 hover:bg-red-100 text-red-950"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">
            Errors
          </span>
          <span className="text-lg font-bold">{report.errors}</span>
        </button>
      </div>

      {/* Overall Integrity Status Banner */}
      <div
        className={`mt-3.5 rounded-lg border p-3 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
          report.errors === 0
            ? "border-emerald-300 bg-emerald-50 text-emerald-950"
            : "border-red-300 bg-red-50 text-red-950"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">{report.errors === 0 ? "✓" : "⚠️"}</span>
          <span>
            {report.errors === 0 ? (
              <>
                <strong>Integrity Verified:</strong> No unresolved continuity errors detected ({report.passed}/{report.totalChecks} checks passed, {report.warnings} warning{report.warnings === 1 ? "" : "s"}).
              </>
            ) : (
              <>
                <strong>Continuity Alert:</strong> {report.errors} unresolved continuity error(s) detected.
              </>
            )}
          </span>
        </div>
        <span className="text-[11px] font-mono text-stone-600 shrink-0">
          {report.unresolvedItems.length} contextual sign-off item(s) flagged below
        </span>
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
          All Categories ({report.checks.length})
        </button>
        {categories.map((cat) => {
          const count = report.checks.filter((c) => c.category === cat).length;
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

      {/* CHECK FINDINGS LIST */}
      <div className="mt-5 space-y-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Verification Findings ({filteredChecks.length})
          </h3>

          <div className="space-y-2.5">
            {filteredChecks.map((check) => (
              <div
                key={check.id}
                className={`rounded-lg border p-3.5 text-xs transition-all ${
                  check.severity === "PASS"
                    ? "border-emerald-200 bg-emerald-50/30"
                    : check.severity === "WARNING"
                    ? "border-amber-200 bg-amber-50/40"
                    : "border-red-200 bg-red-50/40"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                        check.severity === "PASS"
                          ? "bg-emerald-700 text-white"
                          : check.severity === "WARNING"
                          ? "bg-amber-700 text-white"
                          : "bg-red-700 text-white"
                      }`}
                    >
                      {check.id}
                    </span>
                    <span className="font-semibold text-stone-900">
                      {check.category}
                    </span>
                    <span className="font-mono text-[11px] text-stone-500">
                      Entity: {check.sceneOrEntityId}
                    </span>
                  </div>

                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      check.severity === "PASS"
                        ? "bg-emerald-100 text-emerald-800"
                        : check.severity === "WARNING"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {check.severity}
                  </span>
                </div>

                <p className="mt-2 text-stone-700 leading-relaxed">
                  {check.message}
                </p>

                {check.recommendation && (
                  <p className="mt-1.5 text-[11px] text-stone-500 font-mono">
                    <strong className="text-stone-700">Action:</strong> {check.recommendation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* UNRESOLVED / REQUIRES HUMAN REVIEW SECTION */}
        <div className="rounded-lg border border-amber-300 bg-amber-50/70 p-4 text-xs text-amber-950 space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-white font-bold text-xs">
              !
            </span>
            <h3 className="font-bold text-sm text-amber-900">
              Unresolved / Requires Human Review
            </h3>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            The studio pipeline distinguishes deterministic algorithmic checks from nuanced cultural and linguistic sign-offs. The following items require native Marwari speaker and production head editorial sign-off:
          </p>

          <ol className="list-decimal list-inside space-y-1.5 pt-1 text-stone-800 text-[11px]">
            {report.unresolvedItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed bg-white/70 p-2 rounded border border-amber-200/60">
                {item}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};
