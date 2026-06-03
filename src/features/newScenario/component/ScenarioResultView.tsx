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
    <div className="w-full max-w-[1600px] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
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
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shadow-sm">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Strategic Mapping Phase
                </span>
              </div>
              <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter">
                Scenario Framework Mapping
              </h1>
              <p className="text-slate-500 mt-2 font-medium max-w-2xl">
                Confirm your strategic axes for{" "}
                <span className="text-blue-600 font-bold">{company.name}</span>{" "}
                before generating plausible futures.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-4 bg-white border border-slate-200 text-[#0F172A] rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              <button
                onClick={handleRetry}
                className="px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all duration-300 bg-[#0F172A] text-white hover:shadow-2xl hover:-translate-y-1 active:scale-95 cursor-pointer"
              >
                Generate 4 Scenarios
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Mapping Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 px-4 items-start relative">
            {/* Left Column: Info Cards */}
            <div className="lg:col-span-3 flex flex-col gap-6 max-w-sm">
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
            <div className="lg:col-span-9 bg-slate-50/50 py-10 pl-48 pr-12 rounded-[2.5rem] border border-slate-100 flex items-center justify-end min-h-[600px] overflow-visible">
              <StrategicMatrixChart
                axisA={axes.axisA}
                axisB={axes.axisB}
                scenarios={axes.scenarios}
              />
            </div>
          </div>
        </div>
      ) : (
        /* ==========================================
           CASE 2: SCENARIO DISCOVERY BOARD
           ========================================== */
        <div key="discovery-view">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shadow-sm">
                  <LayoutGrid className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Strategic Output Phase
                </span>
              </div>
              <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter">
                Scenario Discovery Board
              </h1>
              <p className="text-slate-500 mt-2 font-medium max-w-2xl">
                Four plausible futures for{" "}
                <span className="text-blue-600 font-bold">{company.name}</span>{" "}
                based on the critical uncertainties of {axes?.axisA.label} vs{" "}
                {axes?.axisB.label}.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-4 bg-white border border-slate-200 text-[#0F172A] rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              <button
                onClick={handleFinalize}
                disabled={isFinalizing || scenarios.length === 0}
                className={`
              px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all duration-300
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

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 px-4 items-start">
            {scenarios
              .filter((s) => s.name && s.story) // Filter out metadata objects that aren't real scenarios
              .map((s, idx) => {
                const color = COLORS[idx % COLORS.length];
                const activeTab = activeTabs[s.id] || "narrative";

                return (
                  <div
                    key={s.id}
                    className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden flex flex-col group"
                  >
                    <div className={`h-2 w-full ${color.bg}`} />

                    <div className="p-10 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-8">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight group-hover:text-blue-600 transition-colors">
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
                      <div className="flex gap-1 bg-slate-50 p-1.5 rounded-2xl mb-8 border border-slate-100/50">
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
                        flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer
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
                      <div className="flex-1 min-h-[300px] flex flex-col">
                        {activeTab === "narrative" && (
                          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex-1 flex flex-col">
                            <div className="flex-1">
                              <p className="text-slate-600 text-sm leading-relaxed font-medium whitespace-pre-line text-justify italic border-l-4 border-slate-100 pl-6 py-2">
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
                            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex-1">
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
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(15,23,42,0.15)] overflow-hidden animate-in zoom-in-95 fade-in duration-500 flex flex-col border border-slate-100">
            {/* Modal Header */}
            <div className="px-8 py-8 border-b border-slate-50 flex items-center justify-between bg-white/80 sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shadow-inner border border-blue-100">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block">
                    Scenario Case Study • {modalData.scenarioLetter}
                  </span>
                  <h3 className="text-2xl font-black text-[#0F172A] tracking-tighter leading-none">
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
            <div className="px-8 py-8 overflow-y-auto flex-1 custom-scrollbar space-y-10">
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
                    className={`text-slate-600 text-base leading-relaxed font-medium text-justify italic border-l-4 border-slate-100 pl-8 transition-all duration-500 ${!expandedSections["story"] ? "line-clamp-[5]" : ""}`}
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
                <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 relative overflow-hidden group">
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
            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
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
