"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Sparkles,
  LayoutGrid,
  Target,
  AlertCircle,
  ArrowRight,
  Loader2,
  Search,
  X,
  Plus,
  Check,
  ChevronLeft,
  Info,
} from "lucide-react";
import { useScenarioContext } from "../store/ScenarioContext";
import {
  useGenerateScenarios,
  usePostWindtunnel,
} from "../hooks/useNewScenario";
import { ScenarioResult, WindtunnelPayload } from "../types/newScenario.types";
import StrategicMatrixChart from "./StrategicMatrixChart";
import DataMismatchModal from "./DataMismatchModal";

/**
 * Helper to truncate text to exactly N words.
 */
const truncateText = (text: string, limit: number) => {
  const words = text ? text.split(/\s+/) : [];
  if (words.length <= limit) return { truncated: text, needsMore: false };
  return {
    truncated: words.slice(0, limit).join(" ") + "...",
    needsMore: true,
  };
};

const ScenarioResultView: React.FC = () => {
  const {
    company,
    axes,
    forces,
    conversationHistory,
    strategicOptions,
    setWindtunnelData,
    addHistory,
    setStep,
    setScenarios: setScenariosToStore,
    updateStrategicOptions,
  } = useScenarioContext();
  const {
    mutateAsync: generateScenarios,
    isPending,
    error,
  } = useGenerateScenarios();

  const { mutateAsync: postWindtunnel, isPending: isFinalizing } =
    usePostWindtunnel();

  const [scenarios, setScenarios] = useState<ScenarioResult[]>([]);
  const [activeTabs, setActiveTabs] = useState<Record<number, string>>({});
  const [isMismatch, setIsMismatch] = useState(false);
  const [mismatchVariant, setMismatchVariant] = useState<
    "alignment" | "processing" | "structural"
  >("alignment");

  // Modal State
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    scenario: ScenarioResult | null;
    scenarioLetter: string;
  }>({
    isOpen: false,
    scenario: null,
    scenarioLetter: "",
  });

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const openModal = (scenario: ScenarioResult, letter: string) => {
    setModalData({ isOpen: true, scenario, scenarioLetter: letter });
    setExpandedSections({}); // Reset expanded state on new modal open
  };

  const closeModal = () => {
    setModalData({ ...modalData, isOpen: false });
  };

  const handleFinalize = async () => {
    const sessionId = localStorage.getItem("sessionId") || "";
    const payload: WindtunnelPayload = {
      sessionId,
      company: {
        name: company.name,
        focalQuestion: company.focalQuestion,
        horizonYear: company.horizonYear,
      },
      scenarios,
      strategicOptions,
      conversationHistory,
    };

    console.log("Finalizing Workshop - Payload:", payload);

    try {
      setIsMismatch(false);
      const response = await postWindtunnel(payload);
      console.log("Finalization Success - Response:", response);

      // Validation: Check for presence of windTunnel data
      if (!response?.data?.windTunnel) {
        console.error(
          "Data mismatch: No wind tunnel results returned from AI.",
        );

        // Specific check for structural mismatch (returning AxesData instead of WindtunnelResult)
        const responseData = response?.data as unknown as
          | Record<string, unknown>
          | undefined;
        if (responseData?.axisA && responseData?.axisB) {
          setMismatchVariant("structural");
          setIsMismatch(true);
          return;
        }

        setMismatchVariant("processing");
        setIsMismatch(true);
        return;
      }

      if (response?.success && response?.data) {
        setWindtunnelData(response.data);

        // Sync generated options if backend provided new ones
        if (
          response.data.generatedOptions &&
          response.data.generatedOptions.length > 0
        ) {
          updateStrategicOptions(response.data.generatedOptions);
        }

        addHistory("user", "Run wind tunnel.");
        addHistory("assistant", JSON.stringify(response.data));
        setStep(5);
      }
    } catch (err: unknown) {
      console.error("Finalization Failed - Error:", err);

      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        errorResponse?.response?.data?.message || errorResponse?.message || "";
      if (
        errorMessage.includes(
          "Failed to parse AI response into JSON after retry",
        )
      ) {
        setMismatchVariant("processing");
        setIsMismatch(true);
      }
    }
  };

  const handleRetry = useCallback(async () => {
    // Don't trigger if axes are missing
    if (!axes || isPending) return;

    try {
      const sessionId = localStorage.getItem("sessionId") || "";

      const payload = {
        sessionId,
        company: {
          name: company.name,
          industry: company.industry,
          summary: company.companySummary,
        },
        focalQuestion: company.focalQuestion,
        horizonYear: company.horizonYear,
        axes: {
          axisA: {
            label: axes.axisA.label,
            poleA1: axes.axisA.pole1 || "",
            poleA2: axes.axisA.pole2 || "",
          },
          axisB: {
            label: axes.axisB.label,
            poleB1: axes.axisB.pole1 || "",
            poleB2: axes.axisB.pole2 || "",
          },
        },
        forces: forces.map((f) => f.title || f.category),
        conversationHistory: conversationHistory,
      };

      setIsMismatch(false);
      const response = await generateScenarios(payload);

      // Validation: AI might return success but empty or missing data
      if (!response?.data?.scenarios || response.data.scenarios.length === 0) {
        console.error("Data mismatch: No scenarios returned from AI.");
        setMismatchVariant("alignment");
        setIsMismatch(true);
        return;
      }

      if (response?.success && response?.data?.scenarios) {
        const mappedScenarios = response.data.scenarios;
        const newStrategicOptions = response.data.strategicOptions;

        if (newStrategicOptions && newStrategicOptions.length > 0) {
          updateStrategicOptions(newStrategicOptions);
        }

        setScenarios(mappedScenarios);
        setScenariosToStore(mappedScenarios);

        const initialTabs: Record<number, string> = {};
        mappedScenarios.forEach((s) => {
          initialTabs[s.id] = "narrative";
        });
        setActiveTabs(initialTabs);
      }
    } catch (err: unknown) {
      console.error("Failed to generate detailed scenarios:", err);
      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        errorResponse?.response?.data?.message || errorResponse?.message || "";

      // Only show mismatch/error if it's a definitive failure (like parsing)
      if (
        errorMessage.includes(
          "Failed to parse AI response into JSON after retry",
        )
      ) {
        setMismatchVariant("processing");
        setIsMismatch(true);
      }
    }
  }, [
    axes,
    company,
    conversationHistory,
    forces,
    generateScenarios,
    isPending,
    setScenariosToStore,
    updateStrategicOptions,
  ]);

  useEffect(() => {
    // We no longer auto-trigger handleRetry on mount.
    // The user will click 'Generate 4 Futures' to start the process.
  }, []);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-12">
        <div className="w-24 h-24 rounded-3xl bg-blue-50 flex items-center justify-center mb-8 animate-pulse shadow-sm">
          <Sparkles className="w-12 h-12 text-blue-600 animate-spin-slow" />
        </div>
        <h2 className="text-3xl font-black text-[#0F172A] mb-4 tracking-tighter">
          Synthesizing Strategic Worlds
        </h2>
        <p className="text-slate-500 max-w-lg mx-auto font-medium leading-relaxed">
          Our AI is weaving complex narratives based on your strategic axes.
          This may take up to 2 minutes as we calculate cross-sector
          implications and signposts.
        </p>
        <div className="mt-8 flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">
            Processing Scenario Engine...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-12">
          <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mb-8 shadow-sm">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-black text-[#0F172A] mb-4">
            Scenario Synthesis Interrupted
          </h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
            We encountered an issue during the AI generation process. This could
            be due to a timeout or connection issue.
          </p>
          <button
            onClick={handleRetry}
            className="px-10 py-4 bg-[#0F172A] text-white rounded-2xl font-bold flex items-center gap-2 hover:shadow-xl transition-all active:scale-95 cursor-pointer"
          >
            Retry Synthesis
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <DataMismatchModal
          isOpen={isMismatch}
          variant={mismatchVariant}
          onClose={() => setIsMismatch(false)}
          backStepLabel="Go back to Step 3"
          onRetry={() => {
            setIsMismatch(false);
            if (mismatchVariant === "processing") {
              handleRetry();
            } else {
              handleFinalize();
            }
          }}
          onRestart={() => {
            setIsMismatch(false);
            setStep(3);
          }}
        />
      </>
    );
  }

  const COLORS = [
    {
      border: "border-blue-500",
      bg: "bg-blue-500",
      text: "text-blue-600",
      light: "bg-blue-50",
    },
    {
      border: "border-emerald-500",
      bg: "bg-emerald-500",
      text: "text-emerald-600",
      light: "bg-emerald-50",
    },
    {
      border: "border-amber-500",
      bg: "bg-amber-500",
      text: "text-amber-600",
      light: "bg-amber-50",
    },
    {
      border: "border-rose-500",
      bg: "bg-rose-500",
      text: "text-rose-600",
      light: "bg-rose-50",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] pb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 sm:pb-20">
      <DataMismatchModal
        isOpen={isMismatch}
        variant={mismatchVariant}
        onClose={() => setIsMismatch(false)}
        backStepLabel="Go back to Step 3"
        onRetry={() => {
          setIsMismatch(false);
          if (scenarios.length === 0) {
            handleRetry();
          } else {
            handleFinalize();
          }
        }}
        onRestart={() => {
          setIsMismatch(false);
          setStep(3);
        }}
      />

      {scenarios.length === 0 && axes ? (
        /* ==========================================
           CASE 1: STRATEGIC MAPPING (Axes Confirmation)
           ========================================== */
        <div key="mapping-view">
          <div className="mb-8 flex flex-col justify-between gap-5 px-1 sm:mb-12 sm:px-4 md:flex-row md:items-end md:gap-6">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shadow-sm">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 sm:text-[11px] sm:tracking-[0.3em]">
                  Strategic Mapping Phase
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-[#0F172A] sm:text-4xl">
                Scenario Framework Mapping
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500 sm:text-base">
                Confirm your strategic axes for{" "}
                <span className="text-blue-600 font-bold">{company.name}</span>{" "}
                before generating plausible futures.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <button
                onClick={() => setStep(3)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-black uppercase tracking-widest text-[#0F172A] shadow-sm transition-all hover:bg-slate-50 active:scale-95 sm:w-auto"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              <button
                onClick={handleRetry}
                className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-[#0F172A] px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-95 sm:w-auto"
              >
                Generate 4 Scenarios
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Mapping Content Layout */}
          <div className="relative grid grid-cols-1 items-start gap-6 px-1 sm:px-4 lg:grid-cols-12 lg:gap-10 xl:gap-20">
            {/* Left Column: Info Cards */}
            <div className="flex max-w-none flex-col gap-4 sm:gap-6 lg:col-span-3 lg:max-w-sm">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                    <span className="text-[10px] font-black text-blue-600">
                      Y
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-[9px]">
                    Vertical Axis
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#0F172A] mb-2 leading-tight">
                  {axes.axisA.label}
                </h3>
                <p className="text-xs font-medium text-slate-500 italic leading-relaxed">
                  <span className="font-black text-blue-600 not-italic uppercase tracking-tighter mr-1.5">
                    Force:
                  </span>
                  {axes.axisA.selectedForce}
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <span className="text-[10px] font-black text-indigo-600">
                      X
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-[9px]">
                    Horizontal Axis
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#0F172A] mb-2 leading-tight">
                  {axes.axisB.label}
                </h3>
                <p className="text-xs font-medium text-slate-500 italic leading-relaxed">
                  <span className="font-black text-indigo-600 not-italic uppercase tracking-tighter mr-1.5">
                    Force:
                  </span>
                  {axes.axisB.selectedForce}
                </p>
              </div>

              <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl shadow-indigo-900/10 text-white flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3 text-indigo-200">
                  <Info className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Strategic Logic
                  </span>
                </div>
                <p className="text-xs font-medium leading-relaxed opacity-95">
                  {axes.axisA.reason.split(".")[0]}. This framework explores the
                  unpredictable intersection of internal expectations and
                  external regulatory pressures.
                </p>
              </div>
            </div>

            {/* Right Column: Matrix Visualization */}
            <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-slate-50/50 p-4 sm:p-6 lg:col-span-9 lg:min-h-[600px] lg:rounded-[2.5rem] lg:py-10 lg:pl-24 lg:pr-8 xl:pl-48 xl:pr-12">
              <div className="flex min-w-[620px] items-center justify-center lg:justify-end">
                <StrategicMatrixChart
                  axisA={axes.axisA}
                  axisB={axes.axisB}
                  scenarios={axes.scenarios}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ==========================================
           CASE 2: SCENARIO DISCOVERY BOARD
           ========================================== */
        <div key="discovery-view">
          <div className="mb-8 flex flex-col justify-between gap-5 px-1 sm:mb-12 sm:px-4 md:flex-row md:items-end md:gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shadow-sm">
                  <LayoutGrid className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 sm:text-[11px] sm:tracking-[0.3em]">
                  Strategic Output Phase
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-[#0F172A] sm:text-4xl">
                Scenario Discovery Board
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500 sm:text-base">
                Four plausible futures for{" "}
                <span className="text-blue-600 font-bold">{company.name}</span>{" "}
                based on the critical uncertainties of {axes?.axisA.label} vs{" "}
                {axes?.axisB.label}.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <button
                onClick={() => setStep(3)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-black uppercase tracking-widest text-[#0F172A] shadow-sm transition-all hover:bg-slate-50 active:scale-95 sm:w-auto"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              <button
                onClick={handleFinalize}
                disabled={isFinalizing || scenarios.length === 0}
                className={`
              flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-4 text-sm font-black uppercase tracking-widest transition-all duration-300 sm:w-auto
              ${
                isFinalizing || scenarios.length === 0
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-[#0F172A] text-white hover:shadow-2xl hover:-translate-y-1 active:scale-95 cursor-pointer"
              }
            `}
              >
                {isFinalizing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
                Continue to Finalize
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-5 px-1 sm:gap-8 sm:px-4 xl:grid-cols-2">
            {scenarios
              .filter((s) => s.name && s.story) // Filter out metadata objects that aren't real scenarios
              .map((s, idx) => {
                const color = COLORS[idx % COLORS.length];
                const activeTab = activeTabs[s.id] || "narrative";

                return (
                  <div
                    key={s.id}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 sm:rounded-[2.5rem]"
                  >
                    <div className={`h-2 w-full ${color.bg}`} />

                    <div className="flex flex-1 flex-col p-5 sm:p-10">
                      <div className="mb-6 flex items-start justify-between sm:mb-8">
                        <div className="space-y-2">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <h2 className="text-xl font-black tracking-tight text-[#0F172A] transition-colors group-hover:text-blue-600 sm:text-2xl">
                              {s.name}
                            </h2>
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-400 border border-slate-100 flex items-center gap-1.5 shadow-sm">
                              <LayoutGrid className="w-3 h-3" />
                              {s.combination === "A1+B1" && "Low / Low"}
                              {s.combination === "A1+B2" && "High / Low"}
                              {s.combination === "A2+B1" && "Low / High"}
                              {s.combination === "A2+B2" && "High / High"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tabs Implementation */}
                      <div className="mb-6 grid grid-cols-1 gap-1 rounded-2xl border border-slate-100/50 bg-slate-50 p-1.5 sm:mb-8 sm:grid-cols-3">
                        {[
                          {
                            id: "narrative",
                            label: "Narrative",
                            icon: Sparkles,
                          },
                          {
                            id: "implications",
                            label: "Implications",
                            icon: Target,
                          },
                          { id: "signposts", label: "Signposts", icon: Search },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() =>
                              setActiveTabs({ ...activeTabs, [s.id]: tab.id })
                            }
                            className={`
                        flex items-center justify-center gap-2 rounded-xl py-2.5 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer
                        ${
                          activeTab === tab.id
                            ? "bg-white text-[#0F172A] shadow-sm border border-slate-200"
                            : "text-slate-400 hover:text-slate-600"
                        }
                      `}
                          >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Tab Content */}
                      <div className="flex min-h-[240px] flex-1 flex-col sm:min-h-[300px]">
                        {activeTab === "narrative" && (
                          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex-1 flex flex-col">
                            <div className="flex-1">
                              <p className="whitespace-pre-line border-l-4 border-slate-100 py-2 pl-4 text-left text-sm font-medium italic leading-relaxed text-slate-600 sm:pl-6 sm:text-justify">
                                {truncateText(s.story || "", 50).truncated}
                              </p>
                            </div>
                            {truncateText(s.story || "", 50).needsMore && (
                              <button
                                onClick={() =>
                                  openModal(s, String.fromCodePoint(65 + idx))
                                }
                                className={`mt-4 w-fit flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${color.text} hover:opacity-70 transition-all cursor-pointer`}
                              >
                                <Plus className="w-3 h-3" />
                                See More
                              </button>
                            )}
                          </div>
                        )}

                        {activeTab === "implications" && (
                          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex-1 flex flex-col">
                            <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 sm:p-6">
                              <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-widest mb-4">
                                Strategic Implications
                              </h4>
                              <p className="text-slate-700 text-sm leading-relaxed font-semibold whitespace-pre-line">
                                {
                                  truncateText(s.implications || "", 50)
                                    .truncated
                                }
                              </p>
                            </div>
                            {truncateText(s.implications || "", 50)
                              .needsMore && (
                              <button
                                onClick={() =>
                                  openModal(s, String.fromCodePoint(65 + idx))
                                }
                                className={`mt-4 w-fit flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${color.text} hover:opacity-70 transition-all cursor-pointer`}
                              >
                                <Plus className="w-3 h-3" />
                                See More
                              </button>
                            )}
                          </div>
                        )}

                        {activeTab === "signposts" && (
                          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <ul className="space-y-4">
                              {s.signposts?.map((post, pIdx) => (
                                <li
                                  key={pIdx}
                                  className="flex gap-4 group/item"
                                >
                                  <div
                                    className={`w-6 h-6 rounded-lg ${color.light} flex items-center justify-center shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform`}
                                  >
                                    <div
                                      className={`w-1.5 h-1.5 rounded-full ${color.bg}`}
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-slate-600 leading-relaxed">
                                    {post}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Full Text Modal */}
      {modalData.isOpen && modalData.scenario && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-8 overflow-hidden">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 w-full h-full bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500 cursor-default border-none outline-none"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_32px_64px_-16px_rgba(15,23,42,0.15)] animate-in zoom-in-95 fade-in duration-500 sm:rounded-[2.5rem]">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-50 bg-white/80 px-5 py-5 sm:px-8 sm:py-8">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 shadow-inner sm:flex">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block">
                    Scenario Case Study • {modalData.scenarioLetter}
                  </span>
                  <h3 className="text-xl font-black leading-tight tracking-tighter text-[#0F172A] sm:text-2xl">
                    {modalData.scenario.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition-all active:scale-95 group"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto px-5 py-6 sm:space-y-10 sm:px-8 sm:py-8">
              {/* SECTION: STORY */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-widest">
                    The Narrative
                  </h4>
                </div>
                <div className="relative group">
                  <p
                    className={`border-l-4 border-slate-100 pl-4 text-left text-sm font-medium italic leading-relaxed text-slate-600 transition-all duration-500 sm:pl-8 sm:text-base sm:text-justify ${!expandedSections["story"] ? "line-clamp-[5]" : ""}`}
                  >
                    {modalData.scenario.story}
                  </p>
                  {!expandedSections["story"] &&
                    truncateText(modalData.scenario.story, 40).needsMore && (
                      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    )}
                </div>
                {truncateText(modalData.scenario.story, 40).needsMore && (
                  <button
                    onClick={() =>
                      setExpandedSections((prev) => ({
                        ...prev,
                        story: !prev.story,
                      }))
                    }
                    className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors"
                  >
                    {expandedSections["story"]
                      ? "Show Less"
                      : "See Full Narrative"}
                    <ArrowRight
                      className={`w-3 h-3 transition-transform ${expandedSections["story"] ? "-rotate-90" : ""}`}
                    />
                  </button>
                )}
              </section>

              {/* SECTION: IMPLICATIONS */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                  <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-widest">
                    Strategic Implications
                  </h4>
                </div>
                <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/50 p-5 sm:p-8">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Target className="w-12 h-12 text-[#0F172A]" />
                  </div>
                  <p
                    className={`text-slate-700 text-sm leading-relaxed font-semibold transition-all duration-500 ${!expandedSections["implications"] ? "line-clamp-4" : ""}`}
                  >
                    {modalData.scenario.implications}
                  </p>
                  {truncateText(modalData.scenario.implications, 40)
                    .needsMore && (
                    <button
                      onClick={() =>
                        setExpandedSections((prev) => ({
                          ...prev,
                          implications: !prev.implications,
                        }))
                      }
                      className="mt-6 flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-800 transition-colors"
                    >
                      {expandedSections["implications"]
                        ? "Show Less"
                        : "See Full Implications"}
                      <ArrowRight
                        className={`w-3 h-3 transition-transform ${expandedSections["implications"] ? "-rotate-90" : ""}`}
                      />
                    </button>
                  )}
                </div>
              </section>

              {/* SECTION: SIGNPOSTS */}
              <section className="space-y-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                  <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-widest">
                    Critical Signposts
                  </h4>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {modalData.scenario.signposts.map((post, pIdx) => (
                    <div
                      key={pIdx}
                      className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover/item:bg-blue-50 transition-colors">
                        <Search className="w-4 h-4 text-slate-400 group-hover/item:text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-600 leading-relaxed">
                        {post}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-50 bg-slate-50/50 px-5 py-5 sm:px-8 sm:py-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Professional Strategic Analysis
              </span>
              {/* <button
                onClick={closeModal}
                className="px-10 py-3.5 bg-[#0F172A] text-white rounded-xl font-bold text-sm hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer shadow-lg shadow-blue-900/10"
              >
                Dismiss Case Study
              </button> */}
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles for scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default ScenarioResultView;
