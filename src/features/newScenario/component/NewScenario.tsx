"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useScenarioContext, ScenarioProvider } from "../store/ScenarioContext";
import {
  useClassifyWorkshop,
  useCreateWorkshopSession,
  useGenerateAxes,
  useSendScenarioInvite,
  useSubmitGuestFactor,
  useWorkshopBySession,
} from "../hooks/useNewScenario";
import ForceClassificationView from "./ForceClassificationView";
import ScenarioResultView from "./ScenarioResultView";
import ScenarioMatrixView from "./ScenarioMatrixView";
import { GuestContribution, MovingFactor } from "../types/newScenario.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
  Mail,
  AlertTriangle,
  RefreshCw,
  Users,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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

type CreditError = {
  message: string;
  availableCredits?: number;
  requiredCredits?: number;
  sessionId?: string;
};

type ApiErrorData = {
  message?: string;
  availableCredits?: number;
  requiredCredits?: number;
  sessionId?: string;
};

type ApiErrorWithResponse = {
  response?: {
    data?: ApiErrorData;
  };
};

function getApiErrorData(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    return (error as ApiErrorWithResponse).response?.data;
  }

  return undefined;
}

function isInsufficientCreditsError(data?: ApiErrorData) {
  return (
    Boolean(data) &&
    (data?.message?.toLowerCase().includes("insufficient credits") ||
      typeof data?.availableCredits === "number" ||
      typeof data?.requiredCredits === "number")
  );
}

function formatMovingFactor(factor: MovingFactor) {
  return `${factor.category}: ${factor.description} ..... ${factor.category}`;
}

function getGuestForceKey(email: string, force: string) {
  return `${email}::${force}`;
}

function NewScenarioContent() {
  const { data: session } = useSession();
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
    conversationHistory,
    isInviteMode,
    inviteToken,
    resetStore,
  } = useScenarioContext();

  const { mutateAsync: classifyWorker, isPending: isClassifying } =
    useClassifyWorkshop();
  const { mutateAsync: createWorkshop, isPending: isCreatingWorkshop } =
    useCreateWorkshopSession();
  const { mutateAsync: generateAxes, isPending: isGeneratingAxes } =
    useGenerateAxes();
  const { mutateAsync: sendInvite, isPending: isSendingInvite } =
    useSendScenarioInvite();
  const { mutateAsync: submitGuestFactor, isPending: isSubmittingGuestFactor } =
    useSubmitGuestFactor();
  const { mutateAsync: fetchWorkshopBySession, isPending: isFetchingWorkshop } =
    useWorkshopBySession();

  const [dfError, setDfError] = useState("");
  const [customCatInput, setCustomCatInput] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [creditError, setCreditError] = useState<CreditError | null>(null);
  const [sentInviteEmails, setSentInviteEmails] = useState<string[]>([]);
  const [guestContributions, setGuestContributions] = useState<
    GuestContribution[]
  >([]);
  const [selectedGuestForceKeys, setSelectedGuestForceKeys] = useState<
    string[]
  >([]);
  const [guestReviewError, setGuestReviewError] = useState("");
  const [workshopSessionId, setWorkshopSessionId] = useState(() => {
    if (typeof window === "undefined" || isInviteMode) return "";
    return localStorage.getItem("sessionId") || "";
  });

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

  const handleStartWorkshop = async () => {
    if (!company.name.trim()) {
      toast.error("Please enter a company name.");
      return;
    }

    if (!company.focalQuestion.trim()) {
      toast.error("Please enter a focal question.");
      return;
    }

    if (!company.horizonYear.trim()) {
      toast.error("Please choose a horizon year.");
      return;
    }

    if (workshopSessionId) {
      handleContinue();
      return;
    }

    try {
      const response = await createWorkshop({
        company: {
          projectTitle: company.projectTitle,
          name: company.name,
          industry: company.industry,
          summary: company.websiteUrl
            ? `${company.companySummary}\n\nCompany Website: ${company.websiteUrl}`
            : company.companySummary,
          focalQuestion: company.focalQuestion,
          horizonYear: company.horizonYear,
        },
        forces: [],
      });

      if (response?.sessionId) {
        setWorkshopSessionId(response.sessionId);
        localStorage.setItem("sessionId", response.sessionId);
        if (response.workshopId) {
          localStorage.setItem("workshopAnalysisId", response.workshopId);
        }
        toast.success("Workshop session created.");
        setStep(3);
      }
    } catch (error: unknown) {
      const message =
        getApiErrorData(error)?.message ||
        (error instanceof Error
          ? error.message
          : "Failed to create workshop session.");
      toast.error(message);
    }
  };

  const handleStartNewWorkshop = () => {
    resetStore();
    setWorkshopSessionId("");
    setSentInviteEmails([]);
    setGuestContributions([]);
    setSelectedGuestForceKeys([]);
    setGuestReviewError("");
    setInviteEmail("");
    setIsInviteDialogOpen(false);
    toast.success("Ready for a new workshop.");
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

  const visibleSteps = isInviteMode
    ? [{ label: "Moving Factors", icon: Zap, stepNumber: 3 }]
    : STEPS.map((step, index) => ({ ...step, stepNumber: index + 1 }));
  const showWorkshopHeader = currentStep === 3;

  const handleSendInvite = async () => {
    const email = inviteEmail.trim();
    const sessionId = workshopSessionId;
    const currentUserEmail = session?.user?.email?.toLowerCase();
    const normalizedEmail = email.toLowerCase();

    if (!email) {
      toast.error("Please enter a guest email.");
      return;
    }

    if (currentUserEmail && normalizedEmail === currentUserEmail) {
      toast.error("You cannot invite yourself to this workshop.");
      return;
    }

    if (!sessionId) {
      toast.error("Please start the workshop before inviting guests.");
      return;
    }

    if (
      sentInviteEmails.includes(normalizedEmail) &&
      !window.confirm(
        "This person was already invited. Resending will invalidate their previous link. Continue?",
      )
    ) {
      return;
    }

    try {
      await sendInvite({ email, sessionId });
      setSentInviteEmails((prev) =>
        prev.includes(normalizedEmail) ? prev : [...prev, normalizedEmail],
      );
      toast.success(`Invitation sent to ${email}.`);
      setInviteEmail("");
      setIsInviteDialogOpen(false);
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } })
          .response?.data?.message === "string"
          ? (error as { response: { data: { message: string } } }).response
              .data.message
          : "Failed to send invitation.";

      toast.error(message);
    }
  };

  const handleRefreshGuestContributions = async () => {
    const sessionId = workshopSessionId;

    if (!sessionId) {
      setGuestReviewError(
        "Workshop session not found. Please save your workshop first.",
      );
      return;
    }

    setGuestReviewError("");

    try {
      const response = await fetchWorkshopBySession(sessionId);
      const nextContributions = response.data.guestAdd || [];
      setGuestContributions(nextContributions);
      setSelectedGuestForceKeys((current) =>
        current.filter((key) =>
          nextContributions.some((entry) =>
            entry.forces.some(
              (force) => getGuestForceKey(entry.email, force) === key,
            ),
          ),
        ),
      );
    } catch (error: unknown) {
      const message =
        getApiErrorData(error)?.message ||
        (error instanceof Error
          ? error.message
          : "Failed to refresh guest contributions.");
      setGuestReviewError(message);
      toast.error(message);
    }
  };

  const handleToggleGuestForce = (
    email: string,
    force: string,
    checked: boolean,
  ) => {
    const key = getGuestForceKey(email, force);
    setSelectedGuestForceKeys((current) =>
      checked ? [...current, key] : current.filter((item) => item !== key),
    );
  };

  const getSelectedGuestForces = () =>
    guestContributions.flatMap((entry) =>
      entry.forces.filter((force) =>
        selectedGuestForceKeys.includes(getGuestForceKey(entry.email, force)),
      ),
    );

  const getMergedForcesForClassification = () => {
    const mergedForces = movingFactors.map(formatMovingFactor);

    getSelectedGuestForces().forEach((force) => {
      if (!mergedForces.includes(force)) {
        mergedForces.push(force);
      }
    });

    return mergedForces;
  };

  useEffect(() => {
    if (isInviteMode || currentStep !== 3 || classification || !workshopSessionId) {
      return;
    }

    const interval = window.setInterval(async () => {
      try {
        const response = await fetchWorkshopBySession(workshopSessionId);
        const nextContributions = response.data.guestAdd || [];

        setGuestContributions(nextContributions);
        setSelectedGuestForceKeys((current) =>
          current.filter((key) =>
            nextContributions.some((entry) =>
              entry.forces.some(
                (force) => getGuestForceKey(entry.email, force) === key,
              ),
            ),
          ),
        );
      } catch {
        // Manual refresh still reports errors; polling should stay quiet.
      }
    }, 15000);

    return () => window.clearInterval(interval);
  }, [
    classification,
    currentStep,
    fetchWorkshopBySession,
    isInviteMode,
    workshopSessionId,
  ]);

  return (
    <section className="bg-slate-50 min-h-screen px-3 py-6 font-sans sm:px-4 sm:py-10 lg:py-20">
      <div className="max-w-5xl mx-auto">
        {showWorkshopHeader && (
          <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {isInviteMode ? "Guest invitation" : "Scenario workshop"}
              </p>
              <h1 className="mt-1 text-xl font-black text-[#0F172A]">
                {isInviteMode ? "Complete invited Moving Factors" : "Moving Factors"}
              </h1>
              {isInviteMode && (
                <p className="mt-1 text-sm text-slate-500">
                  Invite token verified. You can submit moving factors for this
                  workshop.
                </p>
              )}
            </div>

            {!isInviteMode && (
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <button
                  type="button"
                  onClick={handleStartNewWorkshop}
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-[#0F172A] transition hover:bg-slate-50 sm:w-auto"
                >
                  Start New
                </button>
                <button
                  type="button"
                  onClick={() => setIsInviteDialogOpen(true)}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-5 text-sm font-bold text-white transition hover:opacity-90 sm:w-auto"
                >
                  <Mail className="h-4 w-4" />
                  Invite Guest
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mb-10 overflow-x-auto pb-8 sm:mb-16 sm:overflow-visible sm:pb-0">
          <div
            className={`relative flex items-center justify-between sm:min-w-0 ${
              isInviteMode ? "min-w-0" : "min-w-[680px]"
            }`}
          >
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-[#0F172A] -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
              style={{
                width: isInviteMode
                  ? "100%"
                  : `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
              }}
            />
            {visibleSteps.map((step) => {
              const stepNum = step.stepNumber;
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
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl shadow-slate-200/50 sm:rounded-3xl sm:p-8 lg:p-10">
            <header className="mb-6 sm:mb-8">
              <h2 className="text-xl font-black tracking-tight text-[#0F172A] sm:text-2xl">
                Define Your Strategic Question
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base">
                Enter the key decision or focal issue you want to explore
                through scenario planning.
              </p>
            </header>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
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

            <div className="mt-8 mb-6 flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-[#ECFDF5] p-5 shadow-sm sm:mt-10 sm:flex-row sm:gap-6 sm:p-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
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

            <div className="mt-8 flex flex-col-reverse gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex w-full items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 transition-all hover:text-[#0F172A] sm:w-auto"
              >
                <ChevronLeft className="w-4 h-4" />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleContinue}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-8 py-4 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 sm:w-auto sm:px-10"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl shadow-slate-200/50 sm:rounded-3xl sm:p-8 lg:p-10">
            <header className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
              <h2 className="text-2xl font-black tracking-tighter text-[#0F172A] sm:text-3xl">
                Company Profiling
              </h2>
              <p className="mt-3 text-sm font-medium text-slate-500 sm:text-base">
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
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
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
            <div className="mt-8 flex flex-col-reverse gap-3 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-8 py-4 font-bold text-[#0F172A] transition-all hover:bg-slate-200 active:scale-95 sm:w-auto"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              <button
                type="button"
                onClick={handleStartWorkshop}
                disabled={isCreatingWorkshop}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-8 py-4 font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-10"
              >
                {isCreatingWorkshop ? (
                  <>
                    Creating...
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </>
                ) : (
                  <>
                    Start Workshop
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        {/* Step 3 - Moving Factors */}
        {currentStep === 3 && !classification && (
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl shadow-slate-200/50 sm:rounded-3xl sm:p-8 lg:p-10">
            {/* Header */}
            <header className="mb-8 sm:mb-10">
              <h2 className="text-2xl font-black tracking-tighter text-[#0F172A] sm:text-3xl">
                Add Moving Factors
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base">
                Select the domains that apply to your scenario and describe
                their impact.
              </p>
            </header>

            <div className="space-y-8 sm:space-y-12">
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
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 transition-all group focus-within:border-[#0F172A] focus-within:bg-white sm:p-6">
                <label
                  htmlFor="custom-cat"
                  className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4"
                >
                  Can&apos;t find what you&apos;re looking for? Add a custom
                  factor
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
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
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95 sm:w-auto"
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
                        className="group relative animate-in rounded-2xl border-2 border-slate-50 bg-white p-5 shadow-sm transition-all duration-500 fade-in slide-in-from-top-4 hover:border-blue-50 hover:shadow-2xl hover:shadow-slate-200/50 sm:rounded-3xl sm:p-8"
                      >
                        <div className="mb-6 flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#DEF0FA] flex items-center justify-center">
                              <Zap className="w-5 h-5 text-[#0F172A]" />
                            </div>
                            <label
                              htmlFor={`desc-${factor.category}`}
                              className="break-words text-lg font-black tracking-tight text-[#0F172A] sm:text-xl"
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
                          className="min-h-[140px] w-full resize-none rounded-2xl border-2 border-slate-50 bg-slate-50/30 px-4 py-4 text-sm leading-relaxed outline-none transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#0F172A] sm:px-6 sm:py-5"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!isInviteMode && (
                <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-[#0F172A]" />
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          Guest Contributions
                        </p>
                      </div>
                      <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                        Refresh guest forces, choose what to include, then
                        proceed to AI classification with the merged list.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRefreshGuestContributions}
                      disabled={!workshopSessionId || isFetchingWorkshop}
                      className="w-full bg-white sm:w-auto"
                    >
                      {isFetchingWorkshop ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      Refresh
                    </Button>
                  </div>

                  {guestReviewError && (
                    <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                      {guestReviewError}
                    </div>
                  )}

                  {guestContributions.length === 0 ? (
                    <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-400">
                      No guest contributions yet. Share the invite link and
                      check back later.
                    </div>
                  ) : (
                    <div className="mt-5 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setSelectedGuestForceKeys(
                              guestContributions.flatMap((entry) =>
                                entry.forces.map((force) =>
                                  getGuestForceKey(entry.email, force),
                                ),
                              ),
                            )
                          }
                          className="bg-white"
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setSelectedGuestForceKeys([])}
                          className="bg-white"
                        >
                          Deselect All
                        </Button>
                      </div>

                      {guestContributions.map((entry) => (
                        <div
                          key={entry.inviteId}
                          className="rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <p className="break-words text-sm font-black text-[#0F172A]">
                            {entry.email} ({entry.forces.length}{" "}
                            {entry.forces.length === 1 ? "force" : "forces"})
                          </p>

                          {entry.forces.length === 0 ? (
                            <p className="mt-3 text-sm font-medium text-slate-400">
                              This guest has not added any forces.
                            </p>
                          ) : (
                            <div className="mt-3 space-y-3">
                              {entry.forces.map((force) => {
                                const key = getGuestForceKey(
                                  entry.email,
                                  force,
                                );
                                const isChecked =
                                  selectedGuestForceKeys.includes(key);

                                return (
                                  <label
                                    key={key}
                                    className="flex cursor-pointer items-start gap-3 rounded-lg bg-slate-50 p-3 text-sm font-medium leading-6 text-slate-700"
                                  >
                                    <Checkbox
                                      checked={isChecked}
                                      onCheckedChange={(checked) =>
                                        handleToggleGuestForce(
                                          entry.email,
                                          force,
                                          checked === true,
                                        )
                                      }
                                      className="mt-1"
                                    />
                                    <span className="min-w-0 flex-1 whitespace-pre-wrap break-words">
                                      {force}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* Error */}
              {dfError && (
                <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl border border-red-100 text-sm font-bold flex items-center gap-3 animate-bounce">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  {dfError}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full gap-3 sm:w-auto sm:gap-4">
                {!isInviteMode && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-8 py-4 font-bold text-[#0F172A] transition-all hover:bg-slate-200 active:scale-95 sm:w-auto"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                )}

                {!isInviteMode && classification && (
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

                  if (isInviteMode) {
                    if (!inviteToken) {
                      setDfError(
                        "Invitation token is missing. Please reopen the invite link.",
                      );
                      return;
                    }

                    try {
                      await Promise.all(
                        movingFactors.map((factor) =>
                          submitGuestFactor({
                            token: inviteToken,
                            data: {
                              factor: `${factor.category}: ${factor.description.trim()}`,
                            },
                          }),
                        ),
                      );

                      toast.success("Moving factors saved successfully.");
                    } catch (err: unknown) {
                      const apiErrorData = getApiErrorData(err);
                      const message =
                        apiErrorData?.message ||
                        (err instanceof Error
                          ? err.message
                          : "Failed to save moving factors.");

                      setDfError(message);
                    }

                    return;
                  }

                  // If we already have classification, it's already showing inline
                  if (classification) {
                    return;
                  }

                  if (!workshopSessionId) {
                    setDfError(
                      "Workshop session not found. Please go back and start the workshop first.",
                    );
                    return;
                  }

                  // 2) Get full data
                  const payload = {
                    sessionId: workshopSessionId,
                    company: {
                      projectTitle: company.projectTitle,
                      name: company.name,
                      industry: company.industry,
                      summary: company.websiteUrl
                        ? `${company.companySummary}\n\nCompany Website: ${company.websiteUrl}`
                        : company.companySummary,
                      focalQuestion: company.focalQuestion,
                      horizonYear: company.horizonYear,
                    },
                    focalQuestion: company.focalQuestion,
                    forces: getMergedForcesForClassification(),
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
                      setWorkshopSessionId(response.sessionId);
                      localStorage.setItem("sessionId", response.sessionId);
                    }
                    if (response?.workshopAnalysisId) {
                      localStorage.setItem(
                        "workshopAnalysisId",
                        response.workshopAnalysisId,
                      );
                    }
                    if (response?.data) {
                      // Update History
                      addHistory("user", "Classify forces.");
                      addHistory("assistant", JSON.stringify(response.data));

                      setClassification(response.data);
                    }
                  } catch (err: unknown) {
                    console.error("API submission failed:", err);
                    const apiErrorData = getApiErrorData(err);

                    if (isInsufficientCreditsError(apiErrorData)) {
                      setCreditError({
                        message:
                          apiErrorData?.message ||
                          "Insufficient credits to start new analysis",
                        availableCredits: apiErrorData?.availableCredits,
                        requiredCredits: apiErrorData?.requiredCredits,
                        sessionId: apiErrorData?.sessionId,
                      });
                      setDfError("");
                      return;
                    }

                    let errorMessage =
                      "Failed to submit moving factors. Please check your network and try again.";

                    if (apiErrorData?.message) {
                      errorMessage = apiErrorData.message;
                    } else if (err instanceof Error) {
                      errorMessage = err.message;
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
                disabled={isClassifying || isSubmittingGuestFactor}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-8 py-4 font-bold text-white shadow-lg shadow-blue-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-10"
              >
                {isClassifying || isSubmittingGuestFactor ? (
                  <>
                    {isInviteMode ? "Saving..." : "Processing..."}
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </>
                ) : (
                  <>
                    {isInviteMode
                      ? "Save Moving Factors"
                      : "Proceed to Classification"}
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

      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="max-w-[420px] bg-white p-6">
          <DialogHeader>
            <DialogTitle>Invite a guest</DialogTitle>
            <DialogDescription>
              Send a secure invitation link to let a guest access this scenario
              flow.
            </DialogDescription>
          </DialogHeader>

          <div>
            <label
              htmlFor="inviteEmail"
              className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400"
            >
              Guest email
            </label>
            <input
              id="inviteEmail"
              type="email"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
              placeholder="guest@example.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none transition focus:border-[#0F172A]"
            />
          </div>

          <DialogFooter className="mt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsInviteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSendInvite}
              disabled={isSendingInvite}
              className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90"
            >
              {isSendingInvite ? (
                <>
                  Sending...
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                "Send Invite"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(creditError)}
        onOpenChange={(open) => {
          if (!open) setCreditError(null);
        }}
      >
        <DialogContent className="max-w-[460px] border border-amber-100 bg-white p-0 shadow-2xl">
          <div className="border-b border-amber-100 bg-amber-50 px-6 py-5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>

          <div className="px-6 pb-6">
            <DialogHeader className="space-y-3 text-center">
              <DialogTitle className="text-2xl font-black text-[#0F172A]">
                Not enough credits
              </DialogTitle>
              <DialogDescription className="text-sm leading-6 text-slate-500">
                {creditError?.message ||
                  "You do not have enough credits to start a new analysis."}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Available
                </p>
                <p className="mt-2 text-2xl font-black text-[#0F172A]">
                  {creditError?.availableCredits ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Required
                </p>
                <p className="mt-2 text-2xl font-black text-[#0F172A]">
                  {creditError?.requiredCredits ?? 1}
                </p>
              </div>
            </div>

            {/* {creditError?.sessionId && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Session ID
                </p>
                <p className="mt-1 break-all text-xs font-semibold text-slate-600">
                  {creditError.sessionId}
                </p>
              </div>
            )} */}

            <DialogFooter className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreditError(null)}
              >
                Close
              </Button>
              <Button
                asChild
                className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90"
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default function NewScenario({ inviteToken }: { inviteToken?: string }) {
  return (
    <ScenarioProvider inviteToken={inviteToken}>
      <NewScenarioContent />
    </ScenarioProvider>
  );
}
