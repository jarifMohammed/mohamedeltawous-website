"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { generatePdfFromMarkdown } from "../utils/generatePdfFromMarkdown";
import { useScenarioContext } from "../store/ScenarioContext";
import {
  Trophy,
  ShieldCheck,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  LayoutDashboard,
  ArrowLeft,
  Download,
  X,
  Loader2,
} from "lucide-react";
import { useExportReport } from "../hooks/useNewScenario";
import {
  ReportPayload,
  AxisResult,
  WindtunnelResult,
  WindtunnelScenarioEvaluation,
  WindtunnelCell,
} from "../types/newScenario.types";
import { ChevronLeft } from "lucide-react";
import { useSession } from "next-auth/react";

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

/**
 * Helper to ensure a value is a string array.
 * Robustly handles AI-generated stringified arrays with single quotes.
 */
const ensureArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];

  try {
    // Attempt to parse as JSON (handles double quotes)
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Fallback for single-quoted stringified arrays like AI often produces
    try {
      // Replace single quotes surrounding items with double quotes
      // and remove the surrounding brackets if needed
      const normalized = value
        .trim()
        .replace(/^\[|\]$/g, "") // Remove brackets
        .split(/','|', '|' ,/) // Split by common variants of AI-generated separators
        .map((item) => item.replace(/^'|'$/g, "").trim()); // Trim individual quotes and whitespace

      if (normalized.length > 0) return normalized;
    } catch {
      return [value]; // Return as single-item array as last resort
    }
  }
  return [value];
};

/**
 * Normalize windtunnel results into a standard cell array for a specific option.
 * Correctly handles both Option-major 2D arrays and Scenario-major object arrays.
 */
const normalizeWindtunnelData = (
  windtunnelData: WindtunnelResult,
  optIdx: number,
  strategicOptions: string[],
): WindtunnelCell[] => {
  const { windTunnel } = windtunnelData;
  if (!windTunnel || windTunnel.length === 0) return [];

  // 1. Check if it's the 2D array structure (Option-major)
  if (Array.isArray(windTunnel[0])) {
    return (windTunnel as WindtunnelCell[][])[optIdx] || [];
  }

  // 2. Check if it's the Scenario-major object array structure
  const scenarioObjs = windTunnel as WindtunnelScenarioEvaluation[];
  return scenarioObjs.map((scenarioObj) => {
    // Try to match by option string first for robustness
    const matchingEval = scenarioObj.evaluations.find(
      (e) => e.option === strategicOptions[optIdx],
    );
    // Fallback to the same index if the string match fails
    return matchingEval || scenarioObj.evaluations[optIdx];
  });
};

const ScenarioMatrixView: React.FC = () => {
  const sesessio = useSession();
  const token = sesessio.data?.accessToken;
  console.log(token);
  const {
    windtunnelData,
    strategicOptions,
    axes,
    company,
    setStep,
    classification,
    scenarios,
    resetStore,
  } = useScenarioContext();

  const { mutateAsync: exportReport, isPending: isExporting } =
    useExportReport();

  const [exportError, setExportError] = useState<string | null>(null);
  const [streamedMarkdown, setStreamedMarkdown] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic for the streaming markdown
  useEffect(() => {
    if (scrollRef.current && isStreaming) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [streamedMarkdown, isStreaming]);

  const handleDownloadPdf = async () => {
    if (!streamedMarkdown) return;

    const safeCompanyName = company.name
      ? company.name.replaceAll(/[^a-z0-9]/gi, "_")
      : "Report";
    const filename = `${safeCompanyName}_Strategic_Report_${company.horizonYear || "2030"}.pdf`;

    await generatePdfFromMarkdown(streamedMarkdown, filename);
    resetStore();
    setStreamedMarkdown("");
    setGenerationComplete(false);
  };

  const handleExport = async () => {
    if (!axes || !classification || !scenarios || !windtunnelData) {
      setExportError("Missing workshop data. Please complete all steps first.");
      return;
    }

    setExportError(null);
    setStreamedMarkdown("");
    setIsStreaming(true);
    setGenerationComplete(false);

    // 1. Mandatory Data Guarantee for Report
    const pA1 = axes.axisA.poleA1 || axes.axisA.pole1 || "";
    const pA2 = axes.axisA.poleA2 || axes.axisA.pole2 || "";
    const pB1 = axes.axisB.poleB1 || axes.axisB.pole1 || "";
    const pB2 = axes.axisB.poleB2 || axes.axisB.pole2 || "";

    if (!pA1 || !pA2 || !pB1 || !pB2) {
      setExportError(
        "Strategic poles are missing. Please re-check the Discovery step.",
      );
      setIsStreaming(false);
      return;
    }

    // 2. Full Matrix Normalization for Report
    const normalizedFullMatrix: WindtunnelCell[][] = strategicOptions.map(
      (_, optIdx) =>
        normalizeWindtunnelData(windtunnelData, optIdx, strategicOptions),
    );

    const sessionId = localStorage.getItem("sessionId") || "";

    const payload: ReportPayload = {
      sessionId,
      workshopState: {
        company: {
          name: company.name,
          industry: company.industry,
          summary: company.companySummary,
          focalQuestion: company.focalQuestion,
          horizonYear: company.horizonYear,
        },
        classification: {
          predetermined: classification.predetermined.map((p) =>
            typeof p === "string" ? p : p.force,
          ),
          uncertainties: classification.uncertainties.map((u) =>
            typeof u === "string" ? u : u.force,
          ),
        },
        axes: {
          axisA: {
            label: axes.axisA.label,
            poleA1: pA1,
            poleA2: pA2,
            reason: axes.axisA.reason,
          } as AxisResult,
          axisB: {
            label: axes.axisB.label,
            pole1: pB1,
            pole2: pB2,
            reason: axes.axisB.reason,
          } as AxisResult,
        },
        scenarios: {
          scenarios: scenarios.map((s) => ({
            id: s.id,
            name: s.name,
            story:
              s.story ||
              (s as unknown as { narrative?: string }).narrative ||
              "",
            implications: s.implications,
            signposts: s.signposts,
          })),
        },
        windTunnelResult: {
          windTunnel: normalizedFullMatrix,
          robustMoves: windtunnelData.robustMoves,
          strategicConclusion: windtunnelData.strategicConclusion,
          recommendedOption: windtunnelData.recommendedOption,
        },
      },
    };

    try {
      // Use native fetch for streaming
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/workshop/report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) throw new Error("Server communication failed.");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Binary stream not available.");

      const decoder = new TextDecoder();
      let streamBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        streamBuffer += chunk;

        // Strip the technical marker if it appears
        const cleanMarkdown = streamBuffer.split("###JSON_DATA###")[0];
        setStreamedMarkdown(cleanMarkdown.trim());
      }

      setIsStreaming(false);
      setGenerationComplete(true);
    } catch (err) {
      console.error("Export report failed:", err);
      setExportError("Failed to generate the report. Please try again.");
      setIsStreaming(false);
    }
  };

  // Modal State for Performance Matrix Details
  const [matrixModal, setMatrixModal] = useState<{
    isOpen: boolean;
    optionTitle: string;
    scenarioName: string;
    reasoning: string;
    rating: string;
  }>({
    isOpen: false,
    optionTitle: "",
    scenarioName: "",
    reasoning: "",
    rating: "",
  });

  const openMatrixModal = (
    optionTitle: string,
    scenarioName: string,
    reasoning: string,
    rating: string,
  ) => {
    setMatrixModal({
      isOpen: true,
      optionTitle,
      scenarioName,
      reasoning,
      rating,
    });
  };

  const closeMatrixModal = () => {
    setMatrixModal({ ...matrixModal, isOpen: false });
  };

  if (!windtunnelData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm sm:p-12">
        <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6">
          <HelpCircle className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-black text-[#0F172A] mb-2">
          No Analysis Data Available
        </h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
          Please complete the Scenario Discovery step and click &quot;Continue
          to Finalize&quot; to generate the Strategic Wind-tunnelling.
        </p>
        <button
          onClick={() => setStep(4)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-8 py-3 font-bold text-white transition-all hover:shadow-lg active:scale-95 sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Discovery
        </button>
      </div>
    );
  }

  // Helper for rating colors
  const getRatingStyles = (rating: string) => {
    const r = rating.toLowerCase();
    if (r === "excellent")
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        iconCol: "text-emerald-500",
      };
    if (r === "good")
      return {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        iconCol: "text-blue-500",
      };
    if (r === "moderate")
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        iconCol: "text-amber-500",
      };
    if (r === "poor")
      return {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        iconCol: "text-rose-500",
      };
    return {
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
      iconCol: "text-slate-500",
    };
  };

  // Extract labels directly from the `scenarios` store if available
  const scenarioLabels = Array.from({ length: 4 }).map((_, idx) => {
    return scenarios?.[idx]?.name || `Scenario ${idx + 1}`;
  });

  return (
    <div className="mx-auto w-full max-w-[1600px] pb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 sm:pb-20">
      {/* Header Area */}
      <div className="mb-8 flex flex-col justify-between gap-5 px-1 sm:mb-12 sm:px-4 md:flex-row md:items-end md:gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 sm:text-[11px] sm:tracking-[0.3em]">
              Final Strategic Conclusion
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-[#0F172A] sm:text-4xl">
            Strategic Wind-tunnelling
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500 sm:text-base">
            Stress-testing your strategic options for{" "}
            <span className="text-blue-600 font-bold">{company.name}</span>{" "}
            across all plausible futures.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <button
            onClick={() => setStep(4)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-black uppercase tracking-widest text-[#0F172A] shadow-sm transition-all hover:bg-slate-50 active:scale-95 sm:w-auto"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex flex-col gap-2 text-left sm:items-end sm:text-right">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-[#0F172A] px-6 py-4 text-sm font-black text-white shadow-xl shadow-blue-900/20 transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Preparing Report...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 group-hover:bounce" />
                  Export Full Strategic Report
                </>
              )}
            </button>
            {exportError && (
              <p className="max-w-[260px] text-xs font-bold text-rose-500 sm:text-right">
                {exportError}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 px-1 sm:gap-8 sm:px-4">
        {/* RECOMMENDED OPTION FEATURE */}
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-6 text-white shadow-2xl shadow-blue-900/20 sm:rounded-[3rem] sm:p-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
            {/* <div className="shrink-0 w-24 h-24 rounded-3xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-12 h-12 text-blue-400" />
            </div> */}

            <div className="flex-1 text-center lg:text-left">
              <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 sm:tracking-[0.4em]">
                Executive recommendation
              </span>
              <h2 className="mb-4 text-2xl font-black leading-tight tracking-tighter sm:text-3xl">
                {windtunnelData.recommendedOption}
              </h2>
              <p className="max-w-4xl text-sm font-medium italic leading-relaxed text-slate-300 sm:text-lg">
                &quot;{windtunnelData.strategicConclusion}&quot;
              </p>
            </div>
          </div>
        </div>

        {/* WIND TUNNEL MATRIX */}
        <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm sm:rounded-[3rem]">
          <div className="flex flex-col gap-4 border-b border-slate-50 p-5 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0F172A] tracking-tight">
                  Performance Matrix
                </h3>
                <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                  Options vs. Scenarios Stress Test
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
              {["Excellent", "Good", "Moderate", "Poor"].map((r) => (
                <div key={r} className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${getRatingStyles(r).bg} border ${getRatingStyles(r).border}`}
                  />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {r}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="min-w-[240px] border-r border-slate-100 p-5 text-left sm:min-w-[300px] sm:p-10">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Strategic Options
                    </span>
                  </th>
                  {scenarioLabels.map((s, idx) => (
                    <th
                      key={idx}
                      className="min-w-[180px] border-r border-slate-100 p-5 text-center sm:min-w-[200px] sm:p-10"
                    >
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                        Scenario {idx + 1}
                      </span>
                      <span className="text-sm font-black text-[#0F172A] tracking-tight">
                        {s}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(strategicOptions.length > 0
                  ? strategicOptions
                  : windtunnelData.generatedOptions || []
                ).map((option, optIdx) => (
                  <tr
                    key={optIdx}
                    className="border-t border-slate-50 group hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="border-r border-slate-100 p-5 sm:p-10">
                      <p className="text-sm font-bold text-slate-700 leading-relaxed">
                        {option}
                      </p>
                    </td>
                    {windtunnelData?.windTunnel ? (
                      normalizeWindtunnelData(
                        windtunnelData,
                        optIdx,
                        strategicOptions.length > 0
                          ? strategicOptions
                          : windtunnelData.generatedOptions || [],
                      ).map((cell, sceIdx) => {
                        if (!cell) return null;

                        const styles = getRatingStyles(cell.rating);

                        return (
                          <td
                            key={sceIdx}
                            className="border-r border-slate-100 p-4 text-center transition-all duration-300 sm:p-6"
                          >
                            <div className="flex flex-col items-center gap-4">
                              <span
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles.bg} ${styles.text} ${styles.border} shadow-sm`}
                              >
                                {cell.rating}
                              </span>
                              <div className="space-y-2">
                                <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-[180px]">
                                  {truncateText(cell.reasoning, 25).truncated}
                                </p>
                                {truncateText(cell.reasoning, 25).needsMore && (
                                  <button
                                    onClick={() =>
                                      openMatrixModal(
                                        option,
                                        scenarioLabels[sceIdx],
                                        cell.reasoning,
                                        cell.rating,
                                      )
                                    }
                                    className={`text-[10px] font-black uppercase tracking-widest ${styles.text} hover:opacity-70 transition-all cursor-pointer`}
                                  >
                                    See Analysis
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        );
                      })
                    ) : (
                      <td
                        colSpan={4}
                        className="p-6 text-center text-slate-400 italic"
                      >
                        No analysis data for this option.
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROBUST STRATEGIC MOVES */}
        <div className="grid grid-cols-1 gap-5 sm:gap-8 xl:grid-cols-3">
          {/* No Regret Moves */}
          <div className="group flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-xl sm:rounded-[2.5rem] sm:p-10">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <h4 className="text-xl font-black text-[#0F172A] tracking-tighter mb-2">
              No-Regret Moves
            </h4>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">
              High Value in all futures
            </p>

            <ul className="space-y-6 flex-1">
              {ensureArray(windtunnelData.robustMoves.noRegret).map(
                (move, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 leading-relaxed">
                      {move}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Keep-Open Options */}
          <div className="group flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-xl sm:rounded-[2.5rem] sm:p-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Eye className="w-7 h-7 text-blue-600" />
            </div>
            <h4 className="text-xl font-black text-[#0F172A] tracking-tighter mb-2">
              Strategic Options
            </h4>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">
              Maintain optionality
            </p>

            <ul className="space-y-6 flex-1">
              {ensureArray(windtunnelData.robustMoves.keepOpen).map(
                (move, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Eye className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 leading-relaxed">
                      {move}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Defer Moves */}
          <div className="group flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-xl sm:rounded-[2.5rem] sm:p-10">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7 text-rose-600" />
            </div>
            <h4 className="text-xl font-black text-[#0F172A] tracking-tighter mb-2">
              Deferred Actions
            </h4>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">
              Wait for higher certainty
            </p>

            <ul className="space-y-6 flex-1">
              {ensureArray(windtunnelData.robustMoves.defer).map(
                (move, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertCircle className="w-3 h-3 text-rose-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 leading-relaxed">
                      {move}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* EXPORT MODAL & STREAMING VIEW */}
      {(isStreaming || streamedMarkdown) && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-xl animate-in fade-in duration-500 sm:p-6">
          <div className="flex h-[90vh] w-full max-w-4xl flex-col space-y-6 rounded-3xl border border-white/20 bg-white p-5 shadow-2xl animate-in zoom-in-95 duration-500 sm:h-[85vh] sm:space-y-8 sm:rounded-[3rem] sm:p-8 md:p-12">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3 sm:gap-6">
                <div className="relative hidden h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg sm:flex">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tighter text-[#0F172A] sm:text-2xl">
                    {isStreaming ? "Drafting Report..." : "Generation Complete"}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-blue-600">
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      AI Strategic Synthesis
                    </span>
                    <span className="w-1 h-1 rounded-full bg-blue-200" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      7 Strategic Sections
                    </span>
                  </div>
                </div>
              </div>

              {/* Close button only when NOT streaming */}
              {!isStreaming && (
                <button
                  onClick={() => {
                    setStreamedMarkdown("");
                    setIsStreaming(false);
                  }}
                  className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500 active:scale-95 sm:h-12 sm:w-12"
                >
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              )}
            </div>

            {/* Markdown Stream Content */}
            <div
              ref={scrollRef}
              className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-1 py-2 sm:px-4"
            >
              <div className="prose prose-slate prose-sm md:prose-base max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-blue-600 prose-strong:font-bold prose-ul:list-none prose-ul:pl-0 prose-li:mb-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {streamedMarkdown ||
                    "> Gathering insights and preparing your strategic synthesis..."}
                </ReactMarkdown>
                {/* Download PDF Button - Appears after streaming is complete */}
                {generationComplete && (
                  <div className="mt-8 flex justify-center border-t border-slate-100 p-4 animate-in fade-in slide-in-from-bottom-4 duration-700 sm:p-8">
                    <button
                      onClick={handleDownloadPdf}
                      className="group relative flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95 sm:w-auto sm:px-8"
                    >
                      <Download className="w-5 h-5 group-hover:bounce transition-all" />
                      Download Strategic PDF Report
                    </button>
                  </div>
                )}
                {/* Visual Cursor */}
                {isStreaming && (
                  <span className="inline-block w-2 h-5 bg-blue-600 ml-1 animate-pulse rounded-full align-middle" />
                )}
              </div>
            </div>

            {/* Footer Status */}
            <div className="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 md:flex-row">
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-blue-600 rounded-full transition-all duration-1000 ${isStreaming ? "w-2/3 animate-pulse-slow origin-left" : "w-full"}`}
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                  {isStreaming
                    ? "Streaming from AI Core"
                    : "Synthesis Complete"}
                </span>
              </div>

              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${isStreaming ? "text-rose-500 bg-rose-50" : "text-emerald-600 bg-emerald-50"}`}
              >
                {isStreaming ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest font-bold">
                  {isStreaming
                    ? "Please don't close this tab"
                    : "Ready for Download"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REASONING MODAL */}
      {matrixModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 overflow-hidden">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 w-full h-full bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500 cursor-default border-none outline-none"
            onClick={closeMatrixModal}
          />

          {/* Modal Content */}
          <div className="relative flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-500 sm:rounded-[2.5rem]">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-50 bg-white/80 px-5 py-5 sm:px-8 sm:py-8">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 shadow-inner sm:flex">
                  <LayoutDashboard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block">
                    Strategic Analysis Insight
                  </span>
                  <h3 className="text-xl font-black text-[#0F172A] tracking-tighter leading-none">
                    Performance Details
                  </h3>
                </div>
              </div>
              <button
                onClick={closeMatrixModal}
                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition-all active:scale-95 group"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300 cursor-pointer" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
              {/* Context Header */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest leading-none flex items-center h-6">
                    Option Analysis
                  </span>
                  <span
                    className={`px-3 py-1 ${getRatingStyles(matrixModal.rating).bg} ${getRatingStyles(matrixModal.rating).text} rounded-full text-[10px] font-black uppercase tracking-widest leading-none border ${getRatingStyles(matrixModal.rating).border} flex items-center h-6`}
                  >
                    Rating: {matrixModal.rating}
                  </span>
                </div>
                <h4 className="text-[16px] font-semibold text-[#0F172A]">
                  {matrixModal.optionTitle}
                </h4>
                <div className="flex items-center gap-2 text-blue-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Testing against: {matrixModal.scenarioName}
                  </span>
                </div>
              </div>

              {/* Reasoning Content */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-[#0F172A] rounded-full" />
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Detailed Strategic Reasoning
                  </h5>
                </div>
                <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 p-5 italic sm:p-8">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <ShieldCheck className="w-16 h-16 text-[#0F172A]" />
                  </div>
                  <p className="relative z-10 text-left text-sm font-medium leading-relaxed text-slate-600 sm:text-base sm:text-justify">
                    {matrixModal.reasoning}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-slate-50 bg-slate-50/50 px-5 py-5 sm:px-8 sm:py-6">
              {/* <button
                onClick={closeMatrixModal}
                className="px-8 py-3 bg-[#0F172A] text-white rounded-xl font-bold text-sm hover:shadow-2xl transition-all active:scale-95 cursor-pointer shadow-lg shadow-blue-900/10"
              >
                Close Analysis
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioMatrixView;
