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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
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
          className="px-8 py-3 bg-[#0F172A] text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
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
    <div className="w-full max-w-[1600px] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Area */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Final Strategic Conclusion
            </span>
          </div>
          <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter">
            Strategic Wind-tunnelling
          </h1>
          <p className="text-slate-500 mt-2 font-medium max-w-2xl">
            Stress-testing your strategic options for{" "}
            <span className="text-blue-600 font-bold">{company.name}</span>{" "}
            across all plausible futures.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setStep(4)}
            className="px-6 py-4 bg-white border border-slate-200 text-[#0F172A] rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex flex-col items-end gap-2 text-right">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-6 py-4 bg-[#0F172A] text-white rounded-2xl font-black text-sm flex items-center gap-3 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-blue-900/20 group cursor-pointer"
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
              <p className="text-xs font-bold text-rose-500 max-w-[260px] text-right">
                {exportError}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 px-4">
        {/* RECOMMENDED OPTION FEATURE */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[3rem] p-12 text-white shadow-2xl shadow-blue-900/20 group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
            {/* <div className="shrink-0 w-24 h-24 rounded-3xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-12 h-12 text-blue-400" />
            </div> */}

            <div className="flex-1 text-center lg:text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-4 block">
                Executive recommendation
              </span>
              <h2 className="text-3xl font-black mb-4 tracking-tighter leading-tight">
                {windtunnelData.recommendedOption}
              </h2>
              <p className="text-slate-300 text-lg font-medium leading-relaxed max-w-4xl italic">
                &quot;{windtunnelData.strategicConclusion}&quot;
              </p>
            </div>
          </div>
        </div>

        {/* WIND TUNNEL MATRIX */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-10 border-b border-slate-50 flex items-center justify-between">
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
            <div className="flex gap-4">
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
                  <th className="p-10 text-left border-r border-slate-100 min-w-[300px]">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Strategic Options
                    </span>
                  </th>
                  {scenarioLabels.map((s, idx) => (
                    <th
                      key={idx}
                      className="p-10 text-center border-r border-slate-100 min-w-[200px]"
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
                    <td className="p-10 border-r border-slate-100">
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
                            className="p-6 border-r border-slate-100 text-center transition-all duration-300"
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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* No Regret Moves */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 flex flex-col shadow-sm hover:shadow-xl transition-all duration-500 group">
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
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 flex flex-col shadow-sm hover:shadow-xl transition-all duration-500 group">
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
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 flex flex-col shadow-sm hover:shadow-xl transition-all duration-500 group">
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white rounded-[3rem] p-8 md:p-12 max-w-4xl w-full h-[85vh] shadow-2xl border border-white/20 flex flex-col space-y-8 animate-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6">
                <div className="relative w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#0F172A] tracking-tighter">
                    {isStreaming ? "Drafting Report..." : "Generation Complete"}
                  </h3>
                  <div className="flex items-center gap-2 text-blue-600 mt-1">
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
                  className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-95 group"
                >
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              )}
            </div>

            {/* Markdown Stream Content */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar space-y-6"
            >
              <div className="prose prose-slate prose-sm md:prose-base max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-blue-600 prose-strong:font-bold prose-ul:list-none prose-ul:pl-0 prose-li:mb-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {streamedMarkdown ||
                    "> Gathering insights and preparing your strategic synthesis..."}
                </ReactMarkdown>
                {/* Download PDF Button - Appears after streaming is complete */}
                {generationComplete && (
                  <div className="mt-8 p-8 border-t border-slate-100 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <button
                      onClick={handleDownloadPdf}
                      className="group relative flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200 cursor-pointer"
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
            <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
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
          <div className="relative bg-white w-full max-w-xl max-h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-500 flex flex-col border border-slate-100">
            {/* Modal Header */}
            <div className="px-8 py-8 border-b border-slate-50 flex items-center justify-between bg-white/80 sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shadow-inner border border-blue-100">
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
            <div className="px-8 py-8 overflow-y-auto flex-1 custom-scrollbar space-y-8">
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
                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 italic relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <ShieldCheck className="w-16 h-16 text-[#0F172A]" />
                  </div>
                  <p className="text-slate-600 text-base leading-relaxed font-medium text-justify relative z-10">
                    {matrixModal.reasoning}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex justify-end">
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
