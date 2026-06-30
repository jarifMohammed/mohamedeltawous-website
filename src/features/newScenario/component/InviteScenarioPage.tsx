"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import NewScenario from "./NewScenario";
import { getScenarioInvite, type InviteInfo } from "../api/newScenario.api";

type InviteState =
  | { status: "loading"; invite: null; message: string }
  | { status: "success"; invite: InviteInfo; message: string }
  | { status: "error"; invite: null; message: string };

function getInviteErrorMessage(message?: string) {
  const normalized = message?.toLowerCase() || "";

  if (normalized.includes("revoked")) {
    return "This invitation is no longer available.";
  }

  if (normalized.includes("expired")) {
    return "This invitation has expired.";
  }

  if (normalized.includes("not found")) {
    return "Invitation Not Found";
  }

  return "Something went wrong. Please try again later.";
}

export default function InviteScenarioPage({ token }: { token: string }) {
  const [state, setState] = useState<InviteState>({
    status: "loading",
    invite: null,
    message: "Loading invitation...",
  });

  const cleanToken = useMemo(() => token?.trim(), [token]);

  useEffect(() => {
    let isMounted = true;

    const verifyInvite = async () => {
      if (!cleanToken) {
        setState({
          status: "error",
          invite: null,
          message: "Invitation Not Found",
        });
        return;
      }

      try {
        const response = await getScenarioInvite(cleanToken);

        if (!isMounted) return;

        if (response.success && response.data) {
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

        const apiMessage =
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: { data?: { message?: string } } })
            .response?.data?.message === "string"
            ? (error as { response: { data: { message: string } } }).response
                .data.message
            : undefined;

        setState({
          status: "error",
          invite: null,
          message: getInviteErrorMessage(apiMessage),
        });
      }
    };

    verifyInvite();

    return () => {
      isMounted = false;
    };
  }, [cleanToken]);

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
            Please check your invitation link or ask the sender to share a new
            one.
          </p>
        </div>
      </div>
    );
  }

  return <NewScenario inviteToken={state.invite.token} />;
}
