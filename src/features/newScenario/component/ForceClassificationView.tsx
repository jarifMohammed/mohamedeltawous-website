"use client";

import React from "react";
import {
  Target,
  AlertCircle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import {
  AxesPayload,
  AxesResponse,
  AxesData,
  ClassifyResponse,
  UncertaintyItem,
  PredeterminedItem,
} from "../types/newScenario.types";
import { useScenarioContext } from "../store/ScenarioContext";
import { UseMutateAsyncFunction } from "@tanstack/react-query";

interface ForceClassificationViewProps {
  fullResponse: ClassifyResponse;
  generateAxes: UseMutateAsyncFunction<
    AxesResponse,
    Error,
    AxesPayload,
    unknown
  >;
  isGeneratingAxes: boolean;
  onAxesGenerated: (data: AxesData) => void;
  onBack: () => void;
}

const ForceClassificationView: React.FC<ForceClassificationViewProps> = ({
  fullResponse,
  generateAxes,
  isGeneratingAxes,
  onAxesGenerated,
  onBack,
}) => {
  const { data } = fullResponse;
  const { company, setStep, addHistory } = useScenarioContext();
  const [error, setError] = React.useState<string | null>(null);

  const predeterminedCount = data.predetermined.length;
  const uncertaintiesCount = data.uncertainties.length;

  return (
    <div className="w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col border border-slate-100">
      {/* Header */}
      <header className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Step 3 Analysis • Strategic Pulse
            </span>
          </div>
          <h2 className="text-3xl font-black text-[#0F172A] tracking-tighter">
            Strategic Force Classification
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Analyzing identified patterns and critical uncertainties for your
            scenario planning.
          </p>
        </div>
      </header>

      {/* Summary Bar */}
      <div className="bg-slate-50/50 px-10 py-5 border-b border-slate-100 flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <span className="text-[11px] font-black text-[#0F172A] uppercase tracking-widest">
            {predeterminedCount} Predetermined{" "}
            {predeterminedCount === 1 ? "Force" : "Forces"}
          </span>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <span className="text-[11px] font-black text-[#0F172A] uppercase tracking-widest">
            {uncertaintiesCount} Critical{" "}
            {uncertaintiesCount === 1 ? "Uncertainty" : "Uncertainties"}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-10 space-y-16">
        {error && (
          <div className="bg-rose-50 border border-rose-100 rounded-[2rem] p-10 flex flex-col items-center text-center animate-in slide-in-from-top-4 duration-500 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-rose-600" />
            </div>
            <h4 className="text-xl font-black text-rose-900 uppercase tracking-tighter mb-2">
              Mapping Synthesis Failed
            </h4>
            <p className="text-slate-600 font-medium leading-relaxed max-w-md">
              {error}
            </p>
            <div className="mt-8 flex gap-4 w-full justify-center">
              <button
                onClick={onBack}
                className="px-8 py-4 bg-white border-2 border-rose-100 text-rose-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                Back to factors
              </button>
            </div>
          </div>
        )}

        {/* Predetermined Forces Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shadow-inner border border-emerald-100">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0F172A] tracking-tight">
                Predetermined Forces
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Low Uncertainty • High Impact
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.predetermined.map((item, idx) => (
              <ForceCard
                key={typeof item === "string" ? item : item.force + idx}
                item={item}
                type="predetermined"
              />
            ))}
          </div>
        </section>

        {/* Critical Uncertainties Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shadow-inner border border-amber-100">
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0F172A] tracking-tight">
                Critical Uncertainties
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                High Uncertainty • High Potential Impact
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.uncertainties.map((item, idx) => (
              <ForceCard
                key={typeof item === "string" ? item : item.force + idx}
                item={item}
                type="uncertainty"
              />
            ))}
          </div>
        </section>
      </div>

      {/* Footer sticky bar */}
      <footer className="px-10 py-8 border-t border-slate-100 bg-slate-50/30 flex justify-end gap-5 items-center">
        <button
          onClick={onBack}
          disabled={isGeneratingAxes}
          className="px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest text-slate-500 hover:text-[#0F172A] hover:bg-white border border-transparent hover:border-slate-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to factors
        </button>
        <button
          disabled={isGeneratingAxes}
          onClick={async () => {
            
            setError(null);
            try {
                  const sessionId = localStorage.getItem("sessionId");

              const payload = {
                sessionId,
                company: {
                  name: company.name,
                  industry: company.industry,
                  summary: company.companySummary,
                },
                focalQuestion: company.focalQuestion,
                horizonYear: company.horizonYear,
                classification: fullResponse.data,
                conversationHistory: fullResponse.history,
              };

              const response = await generateAxes(payload);

              if (response?.data) {
                addHistory("user", "Select axes.");
                addHistory("assistant", JSON.stringify(response.data));
                onAxesGenerated(response.data);
              }
            } catch (err: unknown) {
              console.error("Axes generation failed:", err);
              setError(
                "We encountered an issue while mapping your strategic axes. Typically, this happens when uncertainties are too conceptually linked. Try simplifying or differentiating your moving factors.",
              );
            }
          }}
          className="px-10 py-4 rounded-xl text-sm font-black uppercase tracking-widest bg-[#0F172A] text-white flex items-center gap-3 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed min-w-[240px] justify-center cursor-pointer shadow-lg shadow-blue-900/10"
        >
          {isGeneratingAxes ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Mapping Matrix...
            </>
          ) : (
            <>
              Confirm & Generate Matrix
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </footer>
    </div>
  );
};

interface ForceCardProps {
  item: string | UncertaintyItem | PredeterminedItem;
  type: "predetermined" | "uncertainty";
}

const ForceCard: React.FC<ForceCardProps> = ({ item, type }) => {
  const isUncertainty = type === "uncertainty";

  let title = "";
  let text = "";
  let impact = "";

  if (typeof item === "string") {
    const colonIndex = item.indexOf(":");
    if (colonIndex !== -1) {
      title = item.slice(0, colonIndex).trim();
      text = item.slice(colonIndex + 1).trim();
    } else {
      title = item;
    }
  } else if ("unpredictability" in item) {
    title = (item as UncertaintyItem).force;
    text = (item as UncertaintyItem).unpredictability;
    impact = (item as UncertaintyItem).impact;
  } else {
    title = (item as PredeterminedItem).force;
    text = (item as PredeterminedItem).rationale;
  }

  return (
    <div
      className={`
      group relative rounded-3xl p-8 border-2 transition-all duration-500 hover:shadow-2xl
      ${
        isUncertainty
          ? "bg-white border-slate-50 shadow-sm hover:border-amber-100/50 hover:shadow-amber-900/5"
          : "bg-slate-50/30 border-slate-50 hover:bg-white hover:border-emerald-100/50 hover:shadow-emerald-900/5"
      }
    `}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-1">
          <span
            className={`
            px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border
            ${
              isUncertainty
                ? "bg-amber-50 text-amber-700 border-amber-100"
                : "bg-emerald-50 text-emerald-700 border-emerald-100"
            }
          `}
          >
            {isUncertainty ? "Critical Uncertainty" : "Predetermined"}
          </span>
          <h4 className="text-xl font-black text-[#0F172A] tracking-tighter mt-3 line-clamp-2">
            {title}
          </h4>
        </div>
      </div>

      {text && (
        <p className="text-slate-600 text-sm leading-relaxed font-semibold whitespace-pre-wrap italic">
          {text}
        </p>
      )}

      {isUncertainty && impact && (
        <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4 items-start shadow-inner">
          <div className="mt-1 w-2 h-2 rounded-full bg-amber-500 shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          <div>
            <span className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest block mb-1.5 opacity-60">
              Future Strategic Impact
            </span>
            <p className="text-xs text-slate-500 font-bold leading-relaxed">
              {impact}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForceClassificationView;
