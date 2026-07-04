"use client";

import React, { Suspense, useEffect, useState } from "react";
import { ArrowLeft, KeyRound, Loader2, Mail, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const verifyEmailSchema = z.object({
  otp: z
    .string()
    .trim()
    .min(6, "6-digit OTP code is required")
    .max(6, "OTP must be 6 digits"),
});

type VerifyEmailFormType = z.infer<typeof verifyEmailSchema>;

function VerifyEmailForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<VerifyEmailFormType>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    const queryEmail = searchParams.get("email") || "";
    const storedEmail =
      typeof window !== "undefined"
        ? localStorage.getItem("registration_verification_email") || ""
        : "";

    setEmail(queryEmail || storedEmail);
  }, [searchParams]);

  const getVerificationToken = () =>
    typeof window !== "undefined"
      ? localStorage.getItem("registration_verification_token") || ""
      : "";

  const handleVerifyEmail = async (values: VerifyEmailFormType) => {
    try {
      setLoading(true);

      const token = getVerificationToken();
      if (!token) {
        throw new Error("Verification session expired. Please register again.");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ otp: values.otp }),
        },
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Invalid or expired OTP");
      }

      localStorage.removeItem("registration_verification_token");
      localStorage.removeItem("registration_verification_email");

      toast.success("Email verified successfully. Please log in.");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResending(true);

      const token = getVerificationToken();
      if (!token) {
        throw new Error("Verification session expired. Please register again.");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to resend OTP");
      }

      toast.success("A new OTP has been sent to your email.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-6 sm:p-6">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl lg:rounded-[40px] shadow-2xl overflow-hidden min-h-0 lg:min-h-[700px] flex border border-slate-100">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-[#DEF0FA] z-20 hidden lg:flex flex-col items-center justify-center p-12 text-center">
          <Mail className="mb-6 text-[#0F172A]" size={48} />
          <h2 className="text-4xl font-bold mb-4 text-[#0F172A]">
            Verify Email
          </h2>
          <p className="text-[#475569] mb-8 leading-relaxed max-w-sm">
            We sent a verification code to your email. Enter it here to activate your account.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-10 py-3 border-2 border-[#0F172A] text-[#0F172A] cursor-pointer rounded-[8px] font-bold hover:bg-[#0F172A] hover:text-white transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={16} />
            BACK TO LOG IN
          </button>
        </div>

        <div className="w-full lg:w-1/2 lg:ml-auto px-5 py-8 sm:p-10 md:p-16 flex flex-col justify-center lg:min-h-[700px]">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Enter OTP Code
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">
            We&apos;ve sent a 6-digit code
            {email ? (
              <>
                {" "}
                to <span className="font-bold text-slate-700">{email}</span>
              </>
            ) : null}
            .
          </p>

          <form
            onSubmit={form.handleSubmit(handleVerifyEmail)}
            className="space-y-4"
          >
            <div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <KeyRound size={18} />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter 6-digit OTP"
                  {...form.register("otp")}
                  className="w-full pl-11 pr-4 py-3.5 sm:pl-12 sm:py-4 rounded-[14px] sm:rounded-[16px] border border-black/10 bg-white text-sm sm:text-base focus:ring-1 focus:ring-black outline-none transition-all text-slate-900"
                />
              </div>

              {form.formState.errors.otp && (
                <p className="text-red-500 text-sm mt-2">
                  {form.formState.errors.otp.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F172A] text-white py-4 rounded-[8px] font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Verifying...
                </>
              ) : (
                "VERIFY EMAIL"
              )}
            </button>
          </form>

          <button
            type="button"
            disabled={resending}
            onClick={handleResendOtp}
            className="mt-5 text-sm text-slate-500 hover:text-pink-500 transition-colors cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {resending ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <RefreshCw size={16} />
            )}
            Resend OTP
          </button>

          <button
            onClick={() => router.push("/login")}
            className="lg:hidden mt-6 text-[#0F172A] font-bold text-sm cursor-pointer"
          >
            Back to Log In
          </button>
        </div>
      </div>
    </section>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <section className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin text-slate-700" />
        </section>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
