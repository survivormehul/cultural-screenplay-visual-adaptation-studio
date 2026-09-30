"use client";

import React, { useState, useEffect } from "react";
import { Header, AiServerStatus } from "@/components/Header";
import { CultureSettingsCard } from "@/components/CultureSettingsCard";
import { WorkflowSteps, WorkflowStageItem } from "@/components/WorkflowSteps";
import { ScreenplayInputSection } from "@/components/ScreenplayInputSection";
import { WorkspacePreview } from "@/components/WorkspacePreview";
import { StructureReview } from "@/components/StructureReview";
import { AdaptationPlan as AdaptationPlanView } from "@/components/AdaptationPlan";
import { ApprovalPanel } from "@/components/ApprovalPanel";
import { AdaptedScreenplayView } from "@/components/AdaptedScreenplayView";
import { VisualConceptBoard } from "@/components/VisualConceptBoard";
import { ContinuityReportView } from "@/components/ContinuityReportView";
import { ExportPanel } from "@/components/ExportPanel";

import { parseScreenplay } from "@/lib/parser";
import { DemoAdaptationProvider, adaptScreenplay } from "@/lib/adaptation";
import { DemoImageGenerationProvider } from "@/lib/visuals";
import { runContinuityChecks } from "@/lib/continuity";

import { ACTIVE_CULTURAL_PROFILE, SAMPLE_SCREENPLAY } from "@/data/sampleScreenplay";
import {
  AdaptationDecision,
  AdaptationPlan,
  AdaptedScreenplay,
  ContinuityReport,
  PipelineStage,
  Screenplay,
  SuggestionStatus,
  VisualPackages,
} from "@/types/domain";
import { ScreenplayFileMeta } from "@/types/adaptation";

export default function Home() {
  const [activeStage, setActiveStage] = useState<PipelineStage>("input");
  const [rawScreenplay, setRawScreenplay] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<ScreenplayFileMeta | null>(null);

  // Gemini AI Server Status & Mode Switcher
  const [aiConfig, setAiConfig] = useState<AiServerStatus | null>(null);
  const [aiMode, setAiMode] = useState<"live" | "demo">("live");

  // Domain Pipeline Entities
  const [parsedScreenplay, setParsedScreenplay] = useState<Screenplay | null>(null);
  const [adaptationPlan, setAdaptationPlan] = useState<AdaptationPlan | null>(null);
  const [decisions, setDecisions] = useState<Record<string, AdaptationDecision>>({});
  const [adaptedScreenplay, setAdaptedScreenplay] = useState<AdaptedScreenplay | null>(null);
  const [visualPackages, setVisualPackages] = useState<VisualPackages | null>(null);
  const [continuityReport, setContinuityReport] = useState<ContinuityReport | null>(null);

  // Workflow Gate States
  const [structureApproved, setStructureApproved] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "info" | "success" | "warning";
    text: string;
  } | null>(null);

  // Discover server-side Gemini AI configuration on load
  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data: AiServerStatus) => {
        setAiConfig(data);
        if (data.configured) {
          setAiMode("live");
        } else {
          setAiMode("demo");
        }
      })
      .catch(() => {
        setAiConfig({
          configured: false,
          provider: "Deterministic Fallback",
          textModel: "gemini-2.5-flash",
          imageModel: "gemini-3.1-flash-image",
        });
        setAiMode("demo");
      });
  }, []);

  // STAGE 1: INGESTION & PARSING
  const handleFileSelected = (file: File) => {
    setValidationError(null);
    const isTxt = file.type === "text/plain" || file.name.endsWith(".txt");
    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");

    if (!isTxt && !isPdf) {
      setValidationError("Unsupported file format. Please upload a .txt or .pdf screenplay file.");
      return;
    }

    const fileMeta: ScreenplayFileMeta = {
      name: file.name,
      size: file.size,
      type: isPdf ? "application/pdf" : "text/plain",
      lastModified: file.lastModified,
    };
    setSelectedFile(fileMeta);

    if (isTxt) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          setRawScreenplay(content);
          setStatusMessage({
            type: "success",
            text: `Screenplay text loaded from "${file.name}" (${file.size} bytes).`,
          });
        }
      };
      reader.onerror = () => {
        setValidationError("Failed to read the file. Please check file permissions or try copying the text.");
      };
      reader.readAsText(file);
    } else {
      setStatusMessage({
        type: "info",
        text: `Selected "${file.name}". Note: Server-side PDF extraction is not connected in demo mode. Please paste screenplay text or click 'Load Sample Scene'.`,
      });
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
  };

  const handleLoadSample = () => {
    setRawScreenplay(SAMPLE_SCREENPLAY);
    setValidationError(null);
    setSelectedFile(null);
    setStatusMessage({
      type: "success",
      text: "Sample dramatic scene loaded: 'EXT. ANCESTRAL HOMESTEAD - DUSK' (Water Rights & Rural Thar Setting).",
    });
  };

  const handleStartWorkflow = () => {
    if (!rawScreenplay.trim()) {
      setValidationError(
        "Screenplay text cannot be empty. Please type text into the editor, upload a .txt file, or click 'Load Sample Scene' to begin."
      );
      setStatusMessage(null);
      return;
    }

    setValidationError(null);
    setIsProcessing(true);

    setTimeout(() => {
      // Deterministic structure extraction
      const parsed = parseScreenplay(rawScreenplay, "Cultural Adaptation Demo");
      setParsedScreenplay(parsed);
      setIsProcessing(false);
      setActiveStage("structure");

      setStatusMessage({
        type: "success",
        text: `✓ Screenplay structure extracted: ${parsed.scenes.length} scene(s), ${parsed.characters.length} character(s), ${parsed.props.length} prop(s). Review structure below.`,
      });
    }, 300);
  };

  // STAGE 2: STRUCTURE APPROVAL
  const handleApproveStructure = async () => {
    if (!parsedScreenplay) return;
    setStructureApproved(true);
    setIsProcessing(true);

    if (aiMode === "live" && aiConfig?.configured) {
      setStatusMessage({
        type: "info",
        text: "⚡ Gemini AI is synthesizing cultural adaptation suggestions across all 8 dimensions...",
      });

      try {
        const res = await fetch("/api/adapt/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            screenplay: parsedScreenplay,
            profile: ACTIVE_CULTURAL_PROFILE,
          }),
        });

        const planData = await res.json();
        if (!res.ok) {
          throw new Error(planData.error || "Failed to generate adaptation plan with Gemini");
        }

        setAdaptationPlan(planData);
        const initialDecisions: Record<string, AdaptationDecision> = {};
        for (const s of planData.suggestions) {
          initialDecisions[s.id] = {
            suggestionId: s.id,
            status: s.status,
            decidedAt: new Date().toISOString(),
          };
        }
        setDecisions(initialDecisions);
        setActiveStage("plan");
        setIsProcessing(false);
        setStatusMessage({
          type: "success",
          text: `✓ Structure approved. Cultural Adaptation Plan generated via Gemini (${planData.totalSuggestions} Marwari dialect & cultural adjustments).`,
        });
        return;
      } catch (err: unknown) {
        console.warn("Live Gemini adaptation plan failed, falling back to deterministic engine:", err);
        setStatusMessage({
          type: "warning",
          text: `Live Gemini plan generation notice (${err instanceof Error ? err.message : "Error"}). Loaded deterministic Marwari adaptation plan as fallback.`,
        });
      }
    }

    // Fallback to deterministic provider
    const provider = new DemoAdaptationProvider();
    const plan = await provider.generatePlan(parsedScreenplay, ACTIVE_CULTURAL_PROFILE);
    setAdaptationPlan(plan);

    // Initial decisions mapped to default suggestions
    const initialDecisions: Record<string, AdaptationDecision> = {};
    for (const s of plan.suggestions) {
      initialDecisions[s.id] = {
        suggestionId: s.id,
        status: s.status,
        decidedAt: new Date().toISOString(),
      };
    }
    setDecisions(initialDecisions);

    setActiveStage("plan");
    setIsProcessing(false);
    setStatusMessage({
      type: "success",
      text: `✓ Structure approved. Cultural Adaptation Plan generated with ${plan.totalSuggestions} Marwari dialect and cultural adjustments.`,
    });
  };

  // STAGE 3: ADAPTATION PLAN DECISIONS
  const handleDecisionChange = (suggestionId: string, status: SuggestionStatus, editedValue?: string) => {
    setDecisions((prev) => ({
      ...prev,
      [suggestionId]: {
        suggestionId,
        status,
        editedValue,
        decidedAt: new Date().toISOString(),
      },
    }));
  };

  const handleApproveAll = () => {
    if (!adaptationPlan) return;
    const updated: Record<string, AdaptationDecision> = { ...decisions };
    for (const s of adaptationPlan.suggestions) {
      updated[s.id] = {
        suggestionId: s.id,
        status: "approved",
        decidedAt: new Date().toISOString(),
      };
    }
    setDecisions(updated);
    setStatusMessage({
      type: "success",
      text: `Approved all ${adaptationPlan.suggestions.length} cultural adaptation suggestions.`,
    });
  };

  const handleRejectAll = () => {
    if (!adaptationPlan) return;
    const updated: Record<string, AdaptationDecision> = { ...decisions };
    for (const s of adaptationPlan.suggestions) {
      updated[s.id] = {
        suggestionId: s.id,
        status: "rejected",
        decidedAt: new Date().toISOString(),
      };
    }
    setDecisions(updated);
    setStatusMessage({
      type: "warning",
      text: `Marked all ${adaptationPlan.suggestions.length} cultural adaptation suggestions as rejected.`,
    });
  };

  const handleResetDecisions = () => {
    if (!adaptationPlan) return;
    const reset: Record<string, AdaptationDecision> = {};
    for (const s of adaptationPlan.suggestions) {
      reset[s.id] = {
        suggestionId: s.id,
        status: "pending",
        decidedAt: new Date().toISOString(),
      };
    }
    setDecisions(reset);
    setStatusMessage({
      type: "info",
      text: "Reset all adaptation decisions back to pending state.",
    });
  };

  // STAGE 4: HUMAN APPROVAL GATE
  const handleApprovePending = () => {
    if (!adaptationPlan) return;
    const updated = { ...decisions };
    for (const s of adaptationPlan.suggestions) {
      if ((updated[s.id]?.status || s.status) === "pending") {
        updated[s.id] = {
          suggestionId: s.id,
          status: "approved",
          decidedAt: new Date().toISOString(),
        };
      }
    }
    setDecisions(updated);
    setStatusMessage({
      type: "success",
      text: "Approved remaining pending adaptation suggestions.",
    });
  };

  const handleRejectPending = () => {
    if (!adaptationPlan) return;
    const updated = { ...decisions };
    for (const s of adaptationPlan.suggestions) {
      if ((updated[s.id]?.status || s.status) === "pending") {
        updated[s.id] = {
          suggestionId: s.id,
          status: "rejected",
          decidedAt: new Date().toISOString(),
        };
      }
    }
    setDecisions(updated);
    setStatusMessage({
      type: "warning",
      text: "Marked remaining pending adaptation suggestions as rejected.",
    });
  };

  const handleGenerateAdaptedScreenplay = async () => {
    if (!parsedScreenplay || !adaptationPlan) return;

    const hasPending = adaptationPlan.suggestions.some(
      (s) => (decisions[s.id]?.status || s.status) === "pending"
    );
    if (hasPending) {
      setStatusMessage({
        type: "warning",
        text: "Review required: Please resolve all pending cultural decisions before generating the adapted screenplay.",
      });
      return;
    }

    setIsProcessing(true);

    if (aiMode === "live" && aiConfig?.configured) {
      setStatusMessage({
        type: "info",
        text: "⚡ Gemini AI is synthesizing the final adapted screenplay using your approved cultural decisions...",
      });

      try {
        const res = await fetch("/api/adapt/screenplay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            screenplay: parsedScreenplay,
            plan: adaptationPlan,
            decisions,
          }),
        });

        const adaptedData = await res.json();
        if (!res.ok) {
          throw new Error(adaptedData.error || "Failed to generate adapted screenplay with Gemini");
        }

        setAdaptedScreenplay(adaptedData);
        setActiveStage("adapted");
        setIsProcessing(false);

        setStatusMessage({
          type: "success",
          text: `✓ Adapted screenplay generated via Gemini in Marwari (Devanagari) applying ${adaptedData.totalApprovedAdaptations} approved cultural adjustments.`,
        });
        return;
      } catch (err: unknown) {
        console.warn("Live Gemini screenplay generation failed, using deterministic synthesizer:", err);
        setStatusMessage({
          type: "warning",
          text: `Live Gemini screenplay generation notice (${err instanceof Error ? err.message : "Error"}). Synthesized via deterministic engine.`,
        });
      }
    }

    const adapted = adaptScreenplay(parsedScreenplay, adaptationPlan, decisions);
    setAdaptedScreenplay(adapted);
    setActiveStage("adapted");
    setIsProcessing(false);

    setStatusMessage({
      type: "success",
      text: `✓ Adapted screenplay generated in Marwari (Devanagari) applying ${adapted.totalApprovedAdaptations} approved cultural adjustments.`,
    });
  };

  // STAGE 5 -> 6: VISUAL GENERATION
  const handleProceedToVisuals = async () => {
    if (!adaptedScreenplay || !parsedScreenplay) return;
    setIsProcessing(true);

    try {
      const res = await fetch("/api/visuals/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adaptedScreenplay,
          originalScreenplay: parsedScreenplay,
        }),
      });

      if (res.ok) {
        const pkgs = await res.json();
        setVisualPackages(pkgs);
        setActiveStage("visuals");
        setIsProcessing(false);

        setStatusMessage({
          type: "success",
          text: `✓ Visual concept prompt packages generated (${pkgs.scenePackages.length} scene framing, ${pkgs.characterPackages.length} character continuity). Ready for Gemini image synthesis.`,
        });
        return;
      }
    } catch (e) {
      console.warn("Server visual package fetch failed, falling back to local engine:", e);
    }

    const visualProvider = new DemoImageGenerationProvider();
    const pkgs = await visualProvider.generateAll(adaptedScreenplay, parsedScreenplay);
    setVisualPackages(pkgs);
    setActiveStage("visuals");
    setIsProcessing(false);

    setStatusMessage({
      type: "success",
      text: `✓ Visual concept prompt packages generated (${pkgs.scenePackages.length} scene framing, ${pkgs.characterPackages.length} character continuity).`,
    });
  };

  // STAGE 6 -> 7: CONTINUITY CHECKS
  const handleProceedToContinuity = () => {
    if (!parsedScreenplay || !adaptedScreenplay || !adaptationPlan) return;

    const report = runContinuityChecks(
      parsedScreenplay,
      adaptedScreenplay,
      adaptationPlan,
      decisions,
      visualPackages
    );
    setContinuityReport(report);
    setActiveStage("continuity");

    setStatusMessage({
      type: "success",
      text: `✓ Continuity verification executed: ${report.passed}/${report.totalChecks} checks passed (${report.warnings} warnings, ${report.errors} errors).`,
    });
  };

  // STAGE 7 -> 8: EXPORT
  const handleProceedToExport = () => {
    setActiveStage("export");
    setStatusMessage({
      type: "success",
      text: "✓ Workflow complete! All production artifacts are ready for review and download below.",
    });
  };

  // RESET & DEMO ACCELERATORS
  const handleResetProject = () => {
    setActiveStage("input");
    setRawScreenplay("");
    setSelectedFile(null);
    setParsedScreenplay(null);
    setAdaptationPlan(null);
    setDecisions({});
    setAdaptedScreenplay(null);
    setVisualPackages(null);
    setContinuityReport(null);
    setStructureApproved(false);
    setValidationError(null);
    setStatusMessage({
      type: "info",
      text: "Project state reset. Ready for a new screenplay ingestion.",
    });
  };

  const handleLoadDemoProject = async () => {
    handleResetProject();
    setRawScreenplay(SAMPLE_SCREENPLAY);
    const parsed = parseScreenplay(SAMPLE_SCREENPLAY, "Ancestral Homestead (Thar Drama)");
    setParsedScreenplay(parsed);
    setStructureApproved(false);

    // Keep user on Screenplay Input (Stage 1) so the demo screenplay and disclaimer are immediately visible
    setActiveStage("input");
    setStatusMessage({
      type: "info",
      text: "⚡ Demo Project loaded with original 3-scene screenplay. Click 'Start Adaptation Workflow' or navigate to Structure Extraction to review canonical entities.",
    });
  };

  // BUILD DYNAMIC 8-STAGE WORKFLOW STATE
  const workflowStagesList: WorkflowStageItem[] = [
    {
      id: "input",
      number: 1,
      label: "Screenplay Input",
      shortDescription: "Script ingest (.txt/.pdf) & text validation",
      status: parsedScreenplay ? "completed" : activeStage === "input" ? "active" : "ready",
      isAccessible: true,
    },
    {
      id: "structure",
      number: 2,
      label: "Structure Extraction",
      shortDescription: "Scenes, characters, props & locations",
      status: structureApproved ? "completed" : activeStage === "structure" ? "active" : parsedScreenplay ? "ready" : "locked",
      isAccessible: Boolean(parsedScreenplay),
    },
    {
      id: "plan",
      number: 3,
      label: "Cultural Adaptation Plan",
      shortDescription: "Marwari lexicon & cultural matrix",
      status: adaptedScreenplay ? "completed" : activeStage === "plan" ? "active" : Boolean(adaptationPlan) ? "ready" : "locked",
      isAccessible: Boolean(adaptationPlan),
    },
    {
      id: "approval",
      number: 4,
      label: "Human Approval",
      shortDescription: "Editorial governance & sign-off gate",
      status: adaptedScreenplay ? "completed" : activeStage === "approval" ? "active" : Boolean(adaptationPlan) ? "ready" : "locked",
      isAccessible: Boolean(adaptationPlan),
    },
    {
      id: "adapted",
      number: 5,
      label: "Adapted Screenplay",
      shortDescription: "Marwari Devanagari script output",
      status: visualPackages ? "completed" : activeStage === "adapted" ? "active" : Boolean(adaptedScreenplay) ? "ready" : "locked",
      isAccessible: Boolean(adaptedScreenplay),
    },
    {
      id: "visuals",
      number: 6,
      label: "Visual Generation",
      shortDescription: "Jodhpur architectural & costume concept art",
      status: continuityReport ? "completed" : activeStage === "visuals" ? "active" : Boolean(visualPackages) ? "ready" : "locked",
      isAccessible: Boolean(visualPackages),
    },
    {
      id: "continuity",
      number: 7,
      label: "Continuity Report",
      shortDescription: "Character, prop, & dialect verification audit",
      status: activeStage === "export" ? "completed" : activeStage === "continuity" ? "active" : Boolean(continuityReport) ? "ready" : "locked",
      isAccessible: Boolean(continuityReport),
    },
    {
      id: "export",
      number: 8,
      label: "Export",
      shortDescription: "Production scripts & JSON archive bundle",
      status: activeStage === "export" ? "active" : Boolean(continuityReport) ? "ready" : "locked",
      isAccessible: Boolean(continuityReport),
    },
  ];

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans flex flex-col">
      <Header
        onResetProject={handleResetProject}
        onLoadDemoProject={handleLoadDemoProject}
        aiStatus={aiConfig}
        aiMode={aiMode}
        onToggleAiMode={setAiMode}
      />

      <main className="mx-auto max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 w-full space-y-6">
        {/* Status Notification Banner */}
        {statusMessage && (
          <div
            role="status"
            className={`rounded-lg p-3.5 text-xs flex items-start justify-between gap-2 border shadow-2xs ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-950 border-emerald-300"
                : statusMessage.type === "warning"
                ? "bg-amber-50 text-amber-950 border-amber-300"
                : "bg-sky-50 text-sky-950 border-sky-300"
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="font-bold text-sm">
                {statusMessage.type === "success" ? "✓" : "ℹ"}
              </span>
              <p className="mt-0.5 leading-relaxed">{statusMessage.text}</p>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              aria-label="Dismiss message"
              className="text-stone-400 hover:text-stone-700 font-bold ml-2 text-sm"
            >
              ×
            </button>
          </div>
        )}

        {/* Culture Settings Summary Card */}
        <CultureSettingsCard />

        {/* Interactive 8-Stage Workflow Bar */}
        <WorkflowSteps
          stages={workflowStagesList}
          activeStage={activeStage}
          onSelectStage={(stage) => setActiveStage(stage)}
        />

        {/* ACTIVE STAGE CONTENT VIEWS */}
        <div>
          {/* STAGE 1: INPUT */}
          {activeStage === "input" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 space-y-6">
                <ScreenplayInputSection
                  screenplayText={rawScreenplay}
                  onChangeText={(text) => {
                    setRawScreenplay(text);
                    if (validationError) setValidationError(null);
                  }}
                  selectedFile={selectedFile}
                  onFileSelected={handleFileSelected}
                  onClearFile={handleClearFile}
                  onLoadSample={handleLoadSample}
                  onStartWorkflow={handleStartWorkflow}
                  isProcessing={isProcessing}
                  validationError={validationError}
                />
              </div>

              <div className="lg:col-span-6 space-y-6">
                <WorkspacePreview
                  screenplayText={rawScreenplay}
                  workflowInitiated={Boolean(parsedScreenplay)}
                  activeStepId="input"
                />
              </div>
            </div>
          )}

          {/* STAGE 2: STRUCTURE EXTRACTION REVIEW */}
          {activeStage === "structure" && parsedScreenplay && (
            <StructureReview
              screenplay={parsedScreenplay}
              onApproveStructure={handleApproveStructure}
              isApproved={structureApproved}
            />
          )}

          {/* STAGE 3: CULTURAL ADAPTATION PLAN */}
          {activeStage === "plan" && adaptationPlan && (
            <AdaptationPlanView
              plan={adaptationPlan}
              decisions={decisions}
              onDecisionChange={handleDecisionChange}
              onApproveAll={handleApproveAll}
              onRejectAll={handleRejectAll}
              onResetDecisions={handleResetDecisions}
              onProceedToApprovalGate={() => setActiveStage("approval")}
            />
          )}

          {/* STAGE 4: HUMAN APPROVAL GATE */}
          {activeStage === "approval" && adaptationPlan && (
            <ApprovalPanel
              plan={adaptationPlan}
              decisions={decisions}
              onApprovePending={handleApprovePending}
              onRejectPending={handleRejectPending}
              onProceedToAdaptation={handleGenerateAdaptedScreenplay}
              onBackToPlan={() => setActiveStage("plan")}
            />
          )}

          {/* STAGE 5: ADAPTED SCREENPLAY VIEW */}
          {activeStage === "adapted" && adaptedScreenplay && parsedScreenplay && (
            <AdaptedScreenplayView
              originalScreenplay={parsedScreenplay}
              adaptedScreenplay={adaptedScreenplay}
              onProceedToVisuals={handleProceedToVisuals}
            />
          )}

          {/* STAGE 6: VISUAL CONCEPT BOARD */}
          {activeStage === "visuals" && visualPackages && (
            <VisualConceptBoard
              visualPackages={visualPackages}
              onProceedToContinuity={handleProceedToContinuity}
              onUpdateVisualPackages={setVisualPackages}
              isGeminiConfigured={Boolean(aiConfig?.configured && aiMode === "live")}
            />
          )}

          {/* STAGE 7: CONTINUITY REPORT */}
          {activeStage === "continuity" && continuityReport && (
            <ContinuityReportView
              report={continuityReport}
              onReRunCheck={handleProceedToContinuity}
              onProceedToExport={handleProceedToExport}
            />
          )}

          {/* STAGE 8: EXPORT PACKAGES */}
          {activeStage === "export" && (
            <ExportPanel
              originalScreenplay={parsedScreenplay}
              adaptedScreenplay={adaptedScreenplay}
              adaptationPlan={adaptationPlan}
              decisions={decisions}
              visualPackages={visualPackages}
              continuityReport={continuityReport}
              culturalProfile={ACTIVE_CULTURAL_PROFILE}
              rawScreenplay={rawScreenplay}
            />
          )}
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white py-4 mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
          <div>
            Cultural Screenplay & Visual Adaptation Studio · Target: Marwari (Rural Jodhpur, Devanagari)
          </div>
          <div>
            {aiConfig?.configured && aiMode === "live"
              ? "Live Gemini AI Mode (2.5 Flash / 3.1 Flash Image)"
              : "Deterministic Demo Mode (Local Synthesizer)"}
          </div>
        </div>
      </footer>
    </div>
  );
}
