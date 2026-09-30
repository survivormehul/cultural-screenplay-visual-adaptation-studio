"use client";

import React, { useRef } from "react";
import { ScreenplayFileMeta } from "@/types/adaptation";

interface ScreenplayInputSectionProps {
  screenplayText: string;
  onChangeText: (text: string) => void;
  selectedFile: ScreenplayFileMeta | null;
  onFileSelected: (file: File) => void;
  onClearFile: () => void;
  onLoadSample: () => void;
  onStartWorkflow: () => void;
  isProcessing: boolean;
  validationError: string | null;
}

export const ScreenplayInputSection: React.FC<ScreenplayInputSectionProps> = ({
  screenplayText,
  onChangeText,
  selectedFile,
  onFileSelected,
  onClearFile,
  onLoadSample,
  onStartWorkflow,
  isProcessing,
  validationError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  const wordCount = screenplayText.trim() ? screenplayText.trim().split(/\s+/).length : 0;
  const lineCount = screenplayText ? screenplayText.split("\n").length : 0;
  const charCount = screenplayText.length;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <section aria-labelledby="screenplay-input-title" className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-100 pb-3.5">
        <div>
          <h2 id="screenplay-input-title" className="text-base font-semibold text-stone-900">
            Source Screenplay Input
          </h2>
          <p className="text-xs text-stone-500">
            Provide the narrative screenplay in standard format (.txt, .pdf, or paste directly).
          </p>
          <p className="text-[11px] text-amber-800 font-medium mt-1">
            Notice: Original demo screenplay created for this prototype. Not supplied by STAGE.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50/80 px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-100 transition-colors"
          >
            <svg
              className="h-3.5 w-3.5 text-amber-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Load Sample Scene
          </button>

          {screenplayText && (
            <button
              type="button"
              onClick={() => {
                onChangeText("");
                onClearFile();
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* File Upload Control */}
      <div className="mt-4">
        <label
          htmlFor="screenplay-file-upload"
          className="block text-xs font-semibold text-stone-700 mb-1.5"
        >
          Upload Script File (.txt or .pdf)
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            id="screenplay-file-upload"
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,text/plain,application/pdf"
            onChange={handleFileChange}
            className="block w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 cursor-pointer border border-stone-200 rounded-lg p-1 bg-stone-50/50"
          />

          {selectedFile && (
            <div className="flex items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-1.5 text-xs text-amber-950 shrink-0">
              <span className="font-medium truncate max-w-[200px]" title={selectedFile.name}>
                📄 {selectedFile.name}
              </span>
              <span className="text-[11px] text-amber-700">({formatFileSize(selectedFile.size)})</span>
              <button
                type="button"
                aria-label="Remove attached file"
                onClick={() => {
                  onClearFile();
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-amber-800 hover:text-amber-950 font-bold ml-1"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {selectedFile && selectedFile.type === "application/pdf" && (
          <div className="mt-2.5 rounded-lg border border-sky-200 bg-sky-50 p-2.5 text-xs text-sky-900 flex items-start gap-2">
            <svg className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold">PDF File Selected: {selectedFile.name}</p>
              <p className="text-[11px] text-sky-800 mt-0.5">
                Note: Server-side PDF extraction engine is not connected in Milestone 1. You can paste script text directly into the editor below or load the sample scene to test the workflow.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Screenplay Text Area */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="screenplay-editor"
            className="block text-xs font-semibold text-stone-700"
          >
            Screenplay Text Editor
          </label>
          <div className="flex items-center gap-3 text-[11px] text-stone-500 font-mono">
            <span>{lineCount} lines</span>
            <span>·</span>
            <span>{wordCount} words</span>
            <span>·</span>
            <span>{charCount} characters</span>
          </div>
        </div>

        <div className="relative">
          <textarea
            id="screenplay-editor"
            rows={14}
            value={screenplayText}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder="Paste your screenplay here, or click 'Load Sample Scene' above...&#10;&#10;Example format:&#10;EXT. ANCESTRAL WELL - DUSK&#10;&#10;VIKRAM stands over the cracked parapet...&#10;&#10;BHAWANI&#10;In this soil, water is not a commodity, it is an oath."
            className="w-full rounded-lg border border-stone-300 bg-stone-50/30 p-3.5 font-mono text-xs sm:text-sm leading-relaxed text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-600"
          />
        </div>
      </div>

      {/* Validation Error Message */}
      {validationError && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800 flex items-center gap-2">
          <svg className="h-4 w-4 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{validationError}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-stone-100 pt-4">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>Target Language: <strong>Marwari (Rural Jodhpur)</strong> · Output: <strong>Devanagari</strong></span>
        </div>

        <button
          type="button"
          onClick={onStartWorkflow}
          disabled={isProcessing || !screenplayText.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-700 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {isProcessing ? (
            <>
              <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Validating Screenplay...</span>
            </>
          ) : (
            <>
              <span>Start Adaptation Workflow</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
