"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Plus, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";
import {
  deleteGuestFactor,
  getScenarioInvite,
  submitGuestFactor,
  type InviteInfo,
} from "../api/newScenario.api";

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

type InviteState =
  | { status: "loading"; invite: null; message: string }
  | { status: "success"; invite: InviteInfo; message: string }
  | { status: "error"; invite: null; message: string };

type GuestMovingFactor = {
  id: string;
  category: string;
  description: string;
  savedForce?: string;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getInviteErrorMessage(message?: string) {
  const normalized = message?.toLowerCase() || "";

  if (normalized.includes("revoked")) {
    return "This invitation is no longer available.";
  }

  if (normalized.includes("expired")) {
    return "This invitation has expired.";
  }

  if (normalized.includes("not found") || normalized.includes("invalid")) {
    return "This invitation link is invalid or has expired.";
  }

  return "Something went wrong. Please try again later.";
}

function getApiMessage(error: unknown, fallback = "Something went wrong.") {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response
      ?.data?.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response.data
      .message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function parseSavedForce(force: string): GuestMovingFactor {
  const [rawCategory, ...rest] = force.split(":");
  const category = rawCategory?.trim() || "Custom Factor";
  const description = rest.join(":").trim() || force;

  return {
    id: createId(),
    category,
    description,
    savedForce: force,
  };
}

function formatGuestForce(factor: GuestMovingFactor) {
  return `${factor.category}: ${factor.description.trim()}`;
}

export default function InviteScenarioPage({ token }: { token: string }) {
  const [state, setState] = useState<InviteState>({
    status: "loading",
    invite: null,
    message: "Loading invitation...",
  });
  const [movingFactors, setMovingFactors] = useState<GuestMovingFactor[]>([]);
  const [customCatInput, setCustomCatInput] = useState("");
  const [dfError, setDfError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingForce, setDeletingForce] = useState<string | null>(null);

  const cleanToken = useMemo(() => token?.trim(), [token]);

  useEffect(() => {
    let isMounted = true;

    const verifyInvite = async () => {
      if (!cleanToken) {
        setState({
          status: "error",
          invite: null,
          message: "This invitation link is invalid or has expired.",
        });
        return;
      }

      try {
        const response = await getScenarioInvite(cleanToken);

        if (!isMounted) return;

        if (response.success && response.data) {
          const guestEntry =
            response.data.workshopAnalysisId?.guestAdd?.find(
              (entry) => entry.inviteId === response.data._id,
            ) ||
            response.data.workshopAnalysisId?.guestAdd?.find(
              (entry) =>
                entry.email?.toLowerCase() ===
                response.data.inviteEmail?.toLowerCase(),
            );

          setMovingFactors((guestEntry?.forces || []).map(parseSavedForce));
          setState({
            status: "success",
            invite: response.data,
            message: response.message,
          });
          return;
        }

        setState({
          status: "error",
          invite: null,
          message: getInviteErrorMessage(response.message),
        });
      } catch (error: unknown) {
        if (!isMounted) return;

        setState({
          status: "error",
          invite: null,
          message: getInviteErrorMessage(getApiMessage(error, undefined)),
        });
      }
    };

    verifyInvite();

    return () => {
      isMounted = false;
    };
  }, [cleanToken]);

  const context = state.invite?.workshopAnalysisId;
  const company = context?.company;

  const syncSavedForces = (forces?: string[]) => {
    if (forces) {
      setMovingFactors(forces.map(parseSavedForce));
    }
  };

  const handleToggleCategory = (cat: string) => {
    const exists = movingFactors.find(
      (factor) => factor.category.toLowerCase() === cat.toLowerCase(),
    );

    if (exists) {
      handleRemoveFactor(exists);
      return;
    }

    setMovingFactors((current) => [
      ...current,
      { id: createId(), category: cat, description: "" },
    ]);
    setDfError("");
  };

  const handleAddCustomCategory = () => {
    const catName = customCatInput.trim();

    if (!catName) return;

    const exists = movingFactors.find(
      (factor) => factor.category.toLowerCase() === catName.toLowerCase(),
    );

    if (exists) {
      setDfError(`"${catName}" is already in the list.`);
      return;
    }

    setMovingFactors((current) => [
      ...current,
      { id: createId(), category: catName, description: "" },
    ]);
    setCustomCatInput("");
    setDfError("");
  };

  const handleDescriptionChange = (id: string, desc: string) => {
    let finalDesc = desc;
    if (desc.length > 0 && !desc.startsWith("•") && desc !== " ") {
      finalDesc = "• " + desc;
    }

    setMovingFactors((current) =>
      current.map((factor) =>
        factor.id === id ? { ...factor, description: finalDesc } : factor,
      ),
    );
  };

  const handleDescriptionKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    factorId: string,
  ) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    const textarea = event.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;
    const newValue =
      value.substring(0, selectionStart) +
      "\n• " +
      value.substring(selectionEnd);

    handleDescriptionChange(factorId, newValue);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = selectionStart + 3;
    }, 0);
  };

  const handleRemoveFactor = async (factor: GuestMovingFactor) => {
    if (!factor.savedForce) {
      setMovingFactors((current) =>
        current.filter((item) => item.id !== factor.id),
      );
      return;
    }

    setDeletingForce(factor.id);
    try {
      const response = await deleteGuestFactor({
        token: cleanToken,
        data: { factor: factor.savedForce },
      });
      const guestEntry = response.data?.find(
        (entry) =>
          entry.inviteId === state.invite?._id ||
          entry.email?.toLowerCase() === state.invite?.inviteEmail.toLowerCase(),
      );

      syncSavedForces(guestEntry?.forces || []);
      toast.success("Moving factor removed.");
    } catch (error: unknown) {
      toast.error(getApiMessage(error, "Failed to remove this moving factor."));
    } finally {
      setDeletingForce(null);
    }
  };

  const handleSaveFactors = async () => {
    if (movingFactors.length === 0) {
      setDfError("Please select at least one category.");
      return;
    }

    const missingDesc = movingFactors.find(
      (factor) => !factor.description.trim(),
    );
    if (missingDesc) {
      setDfError(`Please provide a description for ${missingDesc.category}.`);
      return;
    }

    const formattedForces = movingFactors.map(formatGuestForce);
    const duplicateForce = formattedForces.find(
      (force, index) =>
        formattedForces.findIndex(
          (item) => item.toLowerCase() === force.toLowerCase(),
        ) !== index,
    );

    if (duplicateForce) {
      setDfError(`You've already added "${duplicateForce}".`);
      return;
    }

    setDfError("");
    setIsSaving(true);

    try {
      let latestForces: string[] | undefined;

      for (const factor of movingFactors) {
        const nextForce = formatGuestForce(factor);

        if (factor.savedForce === nextForce) {
          continue;
        }

        if (factor.savedForce) {
          await deleteGuestFactor({
            token: cleanToken,
            data: { factor: factor.savedForce },
          });
        }

        const response = await submitGuestFactor({
          token: cleanToken,
          data: { factor: nextForce },
        });
        const guestEntry = response.data?.find(
          (entry) =>
            entry.inviteId === state.invite?._id ||
            entry.email?.toLowerCase() ===
              state.invite?.inviteEmail.toLowerCase(),
        );
        latestForces = guestEntry?.forces;
      }

      syncSavedForces(latestForces || formattedForces);
      toast.success("Moving factors saved successfully.");
    } catch (error: unknown) {
      setDfError(getApiMessage(error, "Failed to save moving factors."));
    } finally {
      setIsSaving(false);
    }
  };

  if (state.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0F172A]" />
          <p className="text-sm font-semibold text-slate-600">
            Loading invitation...
          </p>
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-[#0F172A]">
            {state.message}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Please ask the host for a new invitation link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-6 font-sans sm:px-4 sm:py-10 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Guest invitation
            </p>
            <h1 className="mt-1 text-xl font-black text-[#0F172A]">
              Complete invited Moving Factors
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {company?.name
                ? `${company.name}${company?.focalQuestion ? ` - ${company.focalQuestion}` : ""}`
                : "Invite token verified. You can submit moving factors for this workshop."}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl shadow-slate-200/50 sm:rounded-3xl sm:p-8 lg:p-10">
          <header className="mb-8 sm:mb-10">
            <h2 className="text-2xl font-black tracking-tighter text-[#0F172A] sm:text-3xl">
              Add Moving Factors
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base">
              Select the domains that apply to your scenario and describe their
              impact.
            </p>
          </header>

          <div className="space-y-8 sm:space-y-12">
            <div>
              <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-slate-400">
                Quick Add Categories
              </span>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_CATEGORIES.map((cat) => {
                  const isSelected = movingFactors.some(
                    (factor) =>
                      factor.category.toLowerCase() === cat.toLowerCase(),
                  );

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleToggleCategory(cat)}
                      className={`
                        flex items-center gap-2 rounded-full border-2 px-5 py-2 text-xs font-black transition-all duration-300
                        ${
                          isSelected
                            ? "scale-105 border-[#0F172A] bg-[#0F172A] text-white shadow-lg shadow-blue-900/20"
                            : "border-slate-100 bg-white text-slate-500 hover:border-[#F1F5F9] hover:bg-slate-50 active:scale-95"
                        }
                      `}
                    >
                      {isSelected ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Plus className="h-3 w-3 text-slate-300" />
                      )}
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="group rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 transition-all focus-within:border-[#0F172A] focus-within:bg-white sm:p-6">
              <label
                htmlFor="custom-cat"
                className="mb-4 block text-xs font-bold uppercase tracking-widest text-slate-400"
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
                    onChange={(event) => setCustomCatInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleAddCustomCategory();
                      }
                    }}
                    placeholder="e.g., Regulatory Shifts, Market Entry..."
                    className="w-full rounded-xl border-2 border-transparent bg-white px-5 py-3 text-sm shadow-sm outline-none transition-all focus:border-[#0F172A]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95 sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add Factor
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#0F172A]">
                  Active Moving Factors ({movingFactors.length})
                </h3>
              </div>

              {movingFactors.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/50 py-20 text-center text-slate-300">
                  <Zap className="mx-auto mb-4 h-12 w-12 opacity-10" />
                  <p className="text-sm font-medium">
                    No factors added yet. Select from above or add a custom one.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {movingFactors.map((factor) => (
                    <div
                      key={factor.id}
                      className="group relative rounded-2xl border-2 border-slate-50 bg-white p-5 shadow-sm transition-all duration-500 animate-in fade-in slide-in-from-top-4 hover:border-blue-50 hover:shadow-2xl hover:shadow-slate-200/50 sm:rounded-3xl sm:p-8"
                    >
                      <div className="mb-6 flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DEF0FA]">
                            <Zap className="h-5 w-5 text-[#0F172A]" />
                          </div>
                          <label
                            htmlFor={`desc-${factor.id}`}
                            className="break-words text-lg font-black tracking-tight text-[#0F172A] sm:text-xl"
                          >
                            {factor.category}
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFactor(factor)}
                          disabled={deletingForce === factor.id || isSaving}
                          className="cursor-pointer rounded-xl bg-slate-50 p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                          title="Remove factor"
                        >
                          {deletingForce === factor.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <textarea
                        id={`desc-${factor.id}`}
                        value={factor.description}
                        onChange={(event) =>
                          handleDescriptionChange(factor.id, event.target.value)
                        }
                        onKeyDown={(event) =>
                          handleDescriptionKeyDown(event, factor.id)
                        }
                        placeholder={`Describe the specific dynamics and future implications of ${factor.category.toLowerCase()}... (Use Enter for bullet points)`}
                        className="min-h-[140px] w-full resize-none rounded-2xl border-2 border-slate-50 bg-slate-50/30 px-4 py-4 text-sm leading-relaxed outline-none transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#0F172A] sm:px-6 sm:py-5"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {dfError && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-6 py-4 text-sm font-bold text-red-600">
                <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                {dfError}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end sm:mt-12">
            <button
              type="button"
              onClick={handleSaveFactors}
              disabled={isSaving}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-8 py-4 font-bold text-white shadow-lg shadow-blue-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-10"
            >
              {isSaving ? (
                <>
                  Saving...
                  <Loader2 className="h-5 w-5 animate-spin" />
                </>
              ) : (
                <>
                  Save Moving Factors
                  <Zap className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
