"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Key, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ParticlesBackground from "@/components/shared/ParticlesBackground";

// ======================
// Validation Schemas
// ======================

const step1Schema = z.object({
  email: z.string().email("Valid email is required"),
});

const step2Schema = z.object({
  otp: z.string().min(4, "OTP code is required"),
});

const step3Schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type Step1FormType = z.infer<typeof step1Schema>;
type Step2FormType = z.infer<typeof step2Schema>;
type Step3FormType = z.infer<typeof step3Schema>;

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  // ======================
  // Step 1: Request OTP Form
  // ======================
  const step1Form = useForm<Step1FormType>({
    resolver: zodResolver(step1Schema),
    defaultValues: { email: "" },
  });

  const handleRequestOtp = async (values: Step1FormType) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to send OTP code");
      }

      // Store the token returned by the API for use in subsequent steps
      const token = data?.data?.accessToken;
      if (token) {
        localStorage.setItem("fp_token", token);
      }

      toast.success("Verification code sent to your email!");
      setEmail(values.email);
      setStep(2);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to request code"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // Step 2: Verify OTP Form
  // ======================
  const step2Form = useForm<Step2FormType>({
    resolver: zodResolver(step2Schema),
    defaultValues: { otp: "" },
  });

  const handleVerifyOtp = async (values: Step2FormType) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("fp_token") || "";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ otp: values.otp }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Invalid or expired OTP");
      }

      toast.success("OTP verification successful!");
      setStep(3);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // Step 3: Reset Password Form
  // ======================
  const step3Form = useForm<Step3FormType>({
    resolver: zodResolver(step3Schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const handleResetPassword = async (values: Step3FormType) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("fp_token") || "";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPassword: values.password }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to reset password");
      }

      // Clean up token after successful reset
      localStorage.removeItem("fp_token");
      toast.success("Password reset successfully! Please log in.");
      router.push("/login");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      {/* Main Container */}
      <div className="relative w-full max-w-6xl bg-white rounded-[40px] shadow-2xl overflow-hidden min-h-[700px] flex border border-slate-100">
        {/* Left Info Section */}
        <div className="w-1/2 h-full bg-secondary absolute top-0 left-0 z-20 hidden lg:flex flex-col items-center justify-center p-12 text-center min-h-[700px] overflow-hidden">
          {/* Dotted particles background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <ParticlesBackground id="forgot-password-particles" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold mb-4 text-[#0F172A]">
              Forgot Password?
            </h2>
            <p className="text-[#475569] mb-8 leading-relaxed max-w-sm">
              Don&apos;t worry! We will help you retrieve your account access in three simple steps.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="px-10 py-3 border-2 border-[#0F172A] text-[#0F172A] cursor-pointer rounded-[8px] font-bold hover:bg-[#0F172A] hover:text-white transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={16} />
              BACK TO LOG IN
            </button>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full lg:w-1/2 lg:ml-auto p-10 md:p-16 flex flex-col justify-center min-h-[700px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Retrieve Password
                </h2>
                <p className="text-slate-500 mb-8">
                  Enter your registered email address to receive an OTP verification code.
                </p>

                <form
                  onSubmit={step1Form.handleSubmit(handleRequestOtp)}
                  className="space-y-4"
                >
                  <AuthInput
                    icon={<Mail size={18} />}
                    type="email"
                    placeholder="Email"
                    {...step1Form.register("email")}
                  />

                  {step1Form.formState.errors.email && (
                    <p className="text-red-500 text-sm">
                      {step1Form.formState.errors.email.message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0F172A] text-white py-4 rounded-[8px] font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Sending...
                      </>
                    ) : (
                      "SEND CODE"
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => setStep(1)}
                    className="text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-3xl font-bold text-slate-900">
                    Verify Code
                  </h2>
                </div>
                <p className="text-slate-500 mb-8">
                  We&apos;ve sent a 6-digit OTP code to <span className="font-bold text-slate-700">{email}</span>. Please enter it below.
                </p>

                <form
                  onSubmit={step2Form.handleSubmit(handleVerifyOtp)}
                  className="space-y-4"
                >
                  <AuthInput
                    icon={<Key size={18} />}
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    {...step2Form.register("otp")}
                  />

                  {step2Form.formState.errors.otp && (
                    <p className="text-red-500 text-sm">
                      {step2Form.formState.errors.otp.message}
                    </p>
                  )}

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
                      "VERIFY CODE"
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Reset Password
                </h2>
                <p className="text-slate-500 mb-8">
                  Choose a strong new password for your account.
                </p>

                <form
                  onSubmit={step3Form.handleSubmit(handleResetPassword)}
                  className="space-y-4"
                >
                  <AuthInput
                    icon={<Lock size={18} />}
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    {...step3Form.register("password")}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />

                  {step3Form.formState.errors.password && (
                    <p className="text-red-500 text-sm">
                      {step3Form.formState.errors.password.message}
                    </p>
                  )}

                  <AuthInput
                    icon={<Lock size={18} />}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    {...step3Form.register("confirmPassword")}
                    showPassword={showConfirmPassword}
                    setShowPassword={setShowConfirmPassword}
                  />

                  {step3Form.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {step3Form.formState.errors.confirmPassword.message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0F172A] text-white py-4 rounded-[8px] font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Resetting Password...
                      </>
                    ) : (
                      "RESET PASSWORD"
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => router.push("/login")}
            className="lg:hidden mt-6 text-[#0F172A] font-bold hover:underline transition-all cursor-pointer"
          >
            Back to Log In
          </button>
        </div>
      </div>
    </section>
  );
}

// ======================
// Reusable Input
// ======================

type AuthInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
  showPassword?: boolean;
  setShowPassword?: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ icon, showPassword, setShowPassword, type, ...props }, ref) => {
    return (
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <input
          ref={ref}
          type={type}
          {...props}
          className="w-full pl-12 pr-14 py-4 rounded-[16px] border border-black/10 bg-white focus:ring-1 focus:ring-black outline-none transition-all text-slate-900"
        />

        {setShowPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
