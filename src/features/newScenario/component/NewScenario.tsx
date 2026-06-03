"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useScenarioContext, ScenarioProvider } from "../store/ScenarioContext";
import { useClassifyWorkshop, useGenerateAxes } from "../hooks/useNewScenario";
import ForceClassificationView from "./ForceClassificationView";
import ScenarioResultView from "./ScenarioResultView";
import ScenarioMatrixView from "./ScenarioMatrixView";
import {
  Check,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Building2,
  Globe,
  Search,
  Zap,
  Loader2,
  CheckCircle2,
  LayoutGrid,
} from "lucide-react";

const PREDEFINED_CATEGORIES = [
  "Society",
  "Technology",
  "Industry",
  "Resources",
  "Demographics",
  "Economics",
  "Environment",
  "Politics",
  "Energy",
  "Religion",
  "Geographic",
];

function NewScenarioContent() {
  const {
    currentStep,
    company,
    updateCompany,
    setStep,
    movingFactors,
    updateMovingFactors,
    addHistory,
    updateAxes,
    setClassification,
    classification,
    isClassificationModalOpen,
    isAxesModalOpen,
    setClassificationModal,
    setAxesModal,
    axes,
    conversationHistory,
  } = useScenarioContext();

  const { mutateAsync: classifyWorker, isPending: isClassifying } =
    useClassifyWorkshop();
  const { mutateAsync: generateAxes, isPending: isGeneratingAxes } =
    useGenerateAxes();

  const [dfError, setDfError] = useState("");
  const [customCatInput, setCustomCatInput] = useState("");

  const handleToggleCategory = (cat: string) => {
    const exists = movingFactors.find(
      (f) => f.category.toLowerCase() === cat.toLowerCase(),
    );
    if (exists) {
      updateMovingFactors(
        movingFactors.filter(
          (f) => f.category.toLowerCase() !== cat.toLowerCase(),
        ),
      );
    } else {
      updateMovingFactors([
        ...movingFactors,
        { category: cat, description: "" },
      ]);
    }
  };

  const handleAddCustomCategory = () => {
    if (!customCatInput.trim()) return;
    const catName = customCatInput.trim();
    const exists = movingFactors.find(
      (f) => f.category.toLowerCase() === catName.toLowerCase(),
    );
    if (exists) {
      setDfError(`"${catName}" is already in the list.`);
      return;
    }
    updateMovingFactors([
      ...movingFactors,
      { category: catName, description: "" },
    ]);
    setCustomCatInput("");
    setDfError("");
  };

  const handleRemoveFactor = (cat: string) => {
    updateMovingFactors(movingFactors.filter((f) => f.category !== cat));
  };

  const handleDescriptionChange = (cat: string, desc: string) => {
    let finalDesc = desc;
    if (desc.length > 0 && !desc.startsWith("•") && desc !== " ") {
      finalDesc = "• " + desc;
    }

    const updated = movingFactors.map((f) =>
      f.category === cat ? { ...f, description: finalDesc } : f,
    );
    updateMovingFactors(updated);
  };

  const handleDescriptionKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    cat: string,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const { selectionStart, selectionEnd, value } = textarea;

      const newValue =
        value.substring(0, selectionStart) +
        "\n• " +
        value.substring(selectionEnd);

      handleDescriptionChange(cat, newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 3;
      }, 0);
    }
  };

  const handleContinue = () => {
    setStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  };

  const isStepComplete = (stepNum: number) => currentStep > stepNum;
  const isStepActive = (stepNum: number) => currentStep === stepNum;

  const STEPS = [
    { label: "Strategic Question", icon: Search },
    { label: "Company Profile", icon: Building2 },
    { label: "Moving Factors", icon: Zap },
    { label: "Scenario Discovery", icon: Globe },
    { label: "Generate Report", icon: CheckCircle2 },
  ];

  return (
    <section className="bg-slate-50 min-h-screen py-20 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-[#0F172A] -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
              style={{
                width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
              }}
            />
            {STEPS.map((step, i) => {
              const stepNum = i + 1;
              const Icon = step.icon;
              const completed = isStepComplete(stepNum);
              const active = isStepActive(stepNum);

              return (
                <div
                  key={step.label}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2
                      ${completed ? "bg-[#0F172A] border-[#0F172A] text-white" : ""}
                      ${active ? "bg-white border-[#0F172A] text-[#0F172A] shadow-lg scale-110" : ""}
                      ${!completed && !active ? "bg-white border-slate-200 text-slate-400" : ""}
                    `}
                  >
                    {completed ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon
                        className={`w-5 h-5 ${active ? "animate-pulse" : ""}`}
                      />
                    )}
                  </div>
                  <span
                    className={`
                      absolute -bottom-8 whitespace-nowrap text-xs font-bold uppercase tracking-widest transition-colors duration-300
                      ${active ? "text-[#0F172A]" : "text-slate-400"}
                    `}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-10 border border-slate-100">
            <header className="mb-8">
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
                Define Your Strategic Question
              </h2>
              <p className="text-slate-500 mt-2 font-medium">
                Enter the key decision or focal issue you want to explore
                through scenario planning.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="projectTitle"
                  className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block"
                >
                  Project Title
                </label>
                <input
                  id="projectTitle"
                  type="text"
                  value={company.projectTitle}
                  onChange={(e) =>
                    updateCompany({ projectTitle: e.target.value })
                  }
                  placeholder="Example: Digital Banking Strategy 2030"
                  className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#0F172A] focus:bg-white focus:border-transparent transition-all"
                />
                <p className="text-[10px] text-slate-400 mt-2 font-medium italic">
                  This will be the internal name for your analysis report.
                </p>
              </div>

              <div>
                <label
                  htmlFor="companyName"
                  className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block"
                >
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={company.name}
                  onChange={(e) => updateCompany({ name: e.target.value })}
                  placeholder="Example: AlWasl Capital"
                  className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#0F172A] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="industry"
                  className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block"
                >
                  Industry
                </label>
                <input
                  id="industry"
                  type="text"
                  value={company.industry}
                  onChange={(e) => updateCompany({ industry: e.target.value })}
                  placeholder="Example: Finance"
                  className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#0F172A] focus:bg-white transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="focalQuestion"
                  className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block"
                >
                  Strategic Question (Focal Question)
                </label>
                <textarea
                  id="focalQuestion"
                  rows={4}
                  value={company.focalQuestion}
                  onChange={(e) =>
                    updateCompany({ focalQuestion: e.target.value })
                  }
                  placeholder="Example: Should AlWasl invest significantly in a retail digital wealth platform or double down on HNW relationships?"
                  className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-[#0F172A] focus:bg-white transition-all resize-none"
                />
                <p className="text-[10px] text-slate-400 mt-2 font-medium italic">
                  A good strategic question is open-ended and focused on
                  long-term value.
                </p>
              </div>
            </div>

            <div className="bg-[#ECFDF5] border border-emerald-100 rounded-4xl p-8 flex gap-6 items-start shadow-sm mt-10 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-sm">
                <p className="font-black text-emerald-900 mb-2 uppercase tracking-widest text-[10px]">
                  Strategic Formulation Tip
                </p>
                <p className="text-slate-700 leading-relaxed font-medium">
                  Try to include a specific timeframe and a core business
                  metric. For example:{" "}
                  <span className="italic">
                    “How will the rise of decentralized finance impact our
                    retail market share in the EU by 2032?”
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-10 flex justify-between items-center">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="text-slate-400 hover:text-[#0F172A] font-bold text-sm uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleContinue}
                className="bg-[#0F172A] text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-10 border border-slate-100">
            <header className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-black text-[#0F172A] tracking-tighter">
                Company Profiling
              </h2>
              <p className="text-slate-500 mt-3 font-medium">
                Provide a summary of your company to calibrate the AI model for
                your industry context.
              </p>
            </header>

            <div className="space-y-8">
              <div>
                <label
                  htmlFor="companySummary"
                  className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block"
                >
                  Strategic Company Summary
                </label>
                <div className="relative group">
                  <textarea
                    id="companySummary"
                    rows={8}
                    maxLength={500}
                    value={company.companySummary}
                    onChange={(e) =>
                      updateCompany({ companySummary: e.target.value })
                    }
                    placeholder="Briefly describe your company's core mission, market position, and major assets..."
                    className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-2xl px-6 py-5 text-sm outline-none focus:ring-2 focus:ring-[#0F172A] focus:bg-white transition-all resize-none leading-relaxed"
                  />
                  <div className="absolute bottom-4 right-5 px-2 py-1 bg-white rounded-md border border-slate-100 text-[10px] font-black text-slate-400 shadow-sm transition-opacity group-focus-within:opacity-100">
                    {company.companySummary.length} / 500
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="websiteUrl"
                    className="text-xs mt-4 font-bold text-slate-400 uppercase tracking-widest mb-3 block"
                  >
                    Company Website URL(Optional)
                  </label>
                  <input
                    id="websiteUrl"
                    type="text"
                    value={company.websiteUrl || ""}
                    onChange={(e) =>
                      updateCompany({ websiteUrl: e.target.value })
                    }
                    placeholder="https://www.example.com"
                    className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-2xl px-6 py-5 text-sm outline-none focus:ring-2 focus:ring-[#0F172A] focus:bg-white transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="horizonYear"
                  className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block"
                >
                  Scenario Horizon (Year)
                </label>
                <div className="flex gap-3">
                  {["2030", "2035", "2040", "2045", "2050"].map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => updateCompany({ horizonYear: year })}
                      className={`
                        flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all
                        ${
                          company.horizonYear === year
                            ? "bg-[#0F172A] border-[#0F172A] text-white shadow-lg"
                            : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                        }
                      `}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-12 flex justify-between items-center">
              <button
                type="button"
                onClick={handleBack}
                className="bg-slate-100 text-[#0F172A] px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              <button
                type="button"
                onClick={handleContinue}
                className="bg-[#0F172A] text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
        {/* Step 3 - Moving Factors */}
        {currentStep === 3 && !classification && (
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-10 border border-slate-100">
            {/* Header */}
            <header className="mb-10">
              <h2 className="text-3xl font-black text-[#0F172A] tracking-tighter">
                Add Moving Factors
              </h2>
              <p className="text-slate-500 mt-2 font-medium">
                Select the domains that apply to your scenario and describe
                their impact.
              </p>
            </header>

            <div className="space-y-12">
              {/* Quick Add Categories */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">
                  Quick Add Categories
                </span>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_CATEGORIES.map((cat) => {
                    const isSelected = movingFactors.some(
                      (f) => f.category.toLowerCase() === cat.toLowerCase(),
                    );
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleToggleCategory(cat)}
                        className={`
                          px-5 py-2 rounded-full border-2 text-xs font-black transition-all duration-300 flex items-center gap-2
                          ${
                            isSelected
                              ? "bg-[#0F172A] text-white border-[#0F172A] shadow-lg shadow-blue-900/20 scale-105"
                              : "bg-white text-slate-500 border-slate-100 hover:border-[#F1F5F9] hover:bg-slate-50 active:scale-95"
                          }
                        `}
                      >
                        {isSelected ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Plus className="w-3 h-3 text-slate-300" />
                        )}
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Category Input */}
              <div className="bg-slate-50 rounded-2xl p-6 border-2 border-dashed border-slate-200 group focus-within:border-[#0F172A] focus-within:bg-white transition-all">
                <label
                  htmlFor="custom-cat"
                  className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4"
                >
                  Can&apos;t find what you&apos;re looking for? Add a custom
                  factor
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      id="custom-cat"
                      type="text"
                      value={customCatInput}
                      onChange={(e) => setCustomCatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCustomCategory();
                        }
                      }}
                      placeholder="e.g., Regulatory Shifts, Market Entry..."
                      className="w-full bg-white border-2 border-transparent rounded-xl px-5 py-3 text-sm outline-none focus:border-[#0F172A] shadow-sm transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomCategory}
                    className="bg-[#0F172A] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Factor
                  </button>
                </div>
              </div>

              {/* Active Moving Factors List */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-widest">
                    Active Moving Factors ({movingFactors.length})
                  </h3>
                </div>

                {movingFactors.length === 0 ? (
                  <div className="py-20 text-center text-slate-300 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                    <Zap className="w-12 h-12 mx-auto mb-4 opacity-10" />
                    <p className="text-sm font-medium">
                      No factors added yet. Select from above or add a custom
                      one.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {movingFactors.map((factor) => (
                      <div
                        key={factor.category}
                        className="group relative bg-white border-2 border-slate-50 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:border-blue-50 transition-all duration-500 animate-in fade-in slide-in-from-top-4"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#DEF0FA] flex items-center justify-center">
                              <Zap className="w-5 h-5 text-[#0F172A]" />
                            </div>
                            <label
                              htmlFor={`desc-${factor.category}`}
                              className="text-xl font-black text-[#0F172A] tracking-tight"
                            >
                              {factor.category}
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFactor(factor.category)}
                            className="bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all p-2 rounded-xl cursor-pointer"
                            title="Remove factor"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <textarea
                          id={`desc-${factor.category}`}
                          value={factor.description}
                          onChange={(e) =>
                            handleDescriptionChange(
                              factor.category,
                              e.target.value,
                            )
                          }
                          onKeyDown={(e) =>
                            handleDescriptionKeyDown(e, factor.category)
                          }
                          placeholder={`Describe the specific dynamics and future implications of ${factor.category.toLowerCase()}... (Use Enter for bullet points)`}
                          className="w-full border-2 border-slate-50 bg-slate-50/30 rounded-2xl px-6 py-5 text-sm outline-none focus:ring-2 focus:ring-[#0F172A] focus:bg-white focus:border-transparent transition-all resize-none leading-relaxed min-h-[140px]"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Error */}
              {dfError && (
                <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl border border-red-100 text-sm font-bold flex items-center gap-3 animate-bounce">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  {dfError}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-12 flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-slate-100 text-[#0F172A] px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>

                {classification && (
                  <button
                    type="button"
                    onClick={() => {
                      // No-op for now, we show it inline anyway
                    }}
                    className="bg-blue-50 text-blue-700 px-8 py-4 rounded-xl font-bold flex items-center gap-2 border border-blue-100 opacity-0 pointer-events-none"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    Review Analysis
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={async () => {
                  if (movingFactors.length === 0) {
                    setDfError("Please select at least one category.");
                    return;
                  }

                  const missingDesc = movingFactors.find(
                    (f) => !f.description.trim(),
                  );
                  if (missingDesc) {
                    setDfError(
                      `Please provide a description for ${missingDesc.category}.`,
                    );
                    return;
                  }

                  setDfError("");

                  // If we already have classification, it's already showing inline
                  if (classification) {
                    return;
                  }

                  // 2) Get full data
                  const payload = {
                    company: {
                      projectTitle: company.projectTitle,
                      name: company.name,
                      industry: company.industry,
                      summary: company.websiteUrl
                        ? `${company.companySummary}\n\nCompany Website: ${company.websiteUrl}`
                        : company.companySummary,
                    },
                    focalQuestion: company.focalQuestion,
                    forces: movingFactors.map(
                      (f) =>
                        `${f.category}: ${f.description} ..... ${f.category}`,
                    ),
                    conversationHistory: conversationHistory,
                  };

                  // 3) Log and API Submission
                  console.log(
                    "Submitting Full Scenario Data with Moving Factors:",
                    payload,
                  );

                  try {
                    const response = await classifyWorker(payload);
                    console.log("Successfully submitted data to API.");
                    if (response?.sessionId) {
                      localStorage.setItem("sessionId", response.sessionId);
                    }
                    if (response?.data) {
                      // Update History
                      addHistory("user", "Classify forces.");
                      addHistory("assistant", JSON.stringify(response.data));

                      setClassification(response.data);
                    }
                  } catch (err: unknown) {
                    console.error("API submission failed:", err);
                    let errorMessage =
                      "Failed to submit moving factors. Please check your network and try again.";

                    if (err instanceof Error) {
                      errorMessage = err.message;
                    } else if (
                      typeof err === "object" &&
                      err !== null &&
                      "response" in err
                    ) {
                      const axiosError = err as {
                        response: { data?: { message?: string } };
                      };
                      errorMessage =
                        axiosError.response.data?.message || errorMessage;
                    }

                    if (
                      errorMessage.includes(
                        "Failed to parse AI response into JSON after retry",
                      )
                    ) {
                      setDfError(
                        "The AI encountered a complex data pattern. Please go back to Step 2 to refine your company description or try simplifying your factor descriptions here.",
                      );
                    } else {
                      setDfError(
                        `${errorMessage} Please check your connection or try simplifying your factor descriptions and try again.`,
                      );
                    }
                  }
                }}
                disabled={isClassifying}
                className="bg-[#0F172A] text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:scale-95 shadow-lg shadow-blue-900/10 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isClassifying ? (
                  <>
                    Processing...
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </>
                ) : (
                  <>
                    Add Moving Factors
                    <Zap className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 - Strategic Pulse Analysis Results */}
        {currentStep === 3 && classification && (
          <ForceClassificationView
            fullResponse={{
      
              success: true,
              data: classification,
              history: conversationHistory,
            }}
            generateAxes={generateAxes}
            isGeneratingAxes={isGeneratingAxes}
            onAxesGenerated={(data) => {
              updateAxes(data);
              setStep(4);
            }}
            onBack={() => setClassification(null)}
          />
        )}

        {/* Step 4: Scenario Results Deep Dive */}
        {currentStep === 4 && <ScenarioResultView />}
        {/* Step 5: Strategic Wind-tunnelling (Scenario Matrix) */}
        {currentStep === 5 && <ScenarioMatrixView />}
      </div>
    </section>
  );
}

export default function NewScenario() {
  return (
    <ScenarioProvider>
      <NewScenarioContent />
    </ScenarioProvider>
  );
}
