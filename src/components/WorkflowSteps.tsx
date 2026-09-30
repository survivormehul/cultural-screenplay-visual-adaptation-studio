import React from "react";
import { PipelineStage } from "@/types/domain";

export interface WorkflowStageItem {
  id: PipelineStage;
  number: number;
  label: string;
  shortDescription: string;
  status: "active" | "completed" | "ready" | "locked";
  isAccessible: boolean;
}

interface WorkflowStepsProps {
  stages: WorkflowStageItem[];
  activeStage: PipelineStage;
  onSelectStage: (stage: PipelineStage) => void;
}

export const WorkflowSteps: React.FC<WorkflowStepsProps> = ({
  stages,
  activeStage,
  onSelectStage,
}) => {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-stone-100 pb-3">
        <div>
          <h2 className="text-base font-semibold text-stone-900">
            Adaptation Pipeline & Multi-Step Workflow
          </h2>
          <p className="text-xs text-stone-500">
            Deterministic end-to-end local demo: click any unlocked stage to inspect state or step forward through the pipeline.
          </p>
        </div>
        <div className="text-xs text-stone-500">
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
            Local Deterministic Demo Mode Active
          </span>
        </div>
      </div>

      <nav aria-label="Workflow Stages" className="mt-4">
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {stages.map((stage) => {
            const isCurrent = stage.id === activeStage;
            const isCompleted = stage.status === "completed";
            const isClickable = stage.isAccessible;

            return (
              <li key={stage.id}>
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onSelectStage(stage.id)}
                  className={`group relative flex w-full flex-col justify-between rounded-lg border p-3 text-left transition-all h-full ${
                    isCurrent
                      ? "border-amber-600 bg-amber-50/70 ring-2 ring-amber-600/30"
                      : isCompleted
                      ? "border-emerald-300 bg-emerald-50/30 hover:border-emerald-400 hover:bg-emerald-50/60 cursor-pointer"
                      : isClickable
                      ? "border-stone-300 bg-stone-50/70 hover:border-stone-400 hover:bg-stone-100 cursor-pointer"
                      : "border-stone-200 bg-stone-50/30 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        isCurrent
                          ? "bg-amber-700 text-white"
                          : isCompleted
                          ? "bg-emerald-700 text-white"
                          : isClickable
                          ? "bg-stone-300 text-stone-800"
                          : "bg-stone-200 text-stone-400"
                      }`}
                    >
                      {isCompleted ? "✓" : stage.number}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isCurrent
                          ? "bg-amber-200 text-amber-900"
                          : isCompleted
                          ? "bg-emerald-100 text-emerald-800"
                          : isClickable
                          ? "bg-stone-200 text-stone-700"
                          : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      {stage.status}
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <span
                      className={`block text-xs font-semibold ${
                        isCurrent
                          ? "text-amber-950 font-bold"
                          : isCompleted
                          ? "text-emerald-950"
                          : isClickable
                          ? "text-stone-800"
                          : "text-stone-400"
                      }`}
                    >
                      {stage.label}
                    </span>
                    <span className="mt-1 block text-[10px] leading-tight text-stone-500 line-clamp-2">
                      {stage.shortDescription}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-1.5 border-t border-stone-200/60 flex items-center gap-1 text-[10px]">
                    {isCurrent ? (
                      <span className="text-amber-800 font-semibold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                        Active View
                      </span>
                    ) : isCompleted ? (
                      <span className="text-emerald-700 font-medium">Completed</span>
                    ) : isClickable ? (
                      <span className="text-stone-600 font-medium">Available</span>
                    ) : (
                      <span className="text-stone-400">Locked</span>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};
