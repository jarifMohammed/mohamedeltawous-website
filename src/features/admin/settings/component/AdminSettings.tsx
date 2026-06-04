"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  KeyRound,
  Settings,
} from "lucide-react";
import { changePassword } from "@/features/settings/api/settings.api";
import { toast } from "sonner";

// ─── Validation ────────────────────────────────────────────────────────────
const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormType = z.infer<typeof schema>;

// ─── Field Component ───────────────────────────────────────────────────────
type PasswordFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  show: boolean;
  onToggle: () => void;
};

const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, show, onToggle, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Lock className="h-4 w-4" />
        </div>
        <input
          ref={ref}
          type={show ? "text" : "password"}
          {...props}
          className={`w-full pl-11 pr-12 py-3 rounded-xl border bg-white text-slate-900 outline-none transition-all text-sm font-medium placeholder:text-slate-400 ${
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          }`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  )
);
PasswordField.displayName = "PasswordField";

export default function AdminSettings() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (values: FormType) => {
    setLoading(true);
    try {
      const res = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      if (res.success) {
        toast.success(res.message || "Password updated successfully!");
        reset();
      } else {
        toast.error(res.message || "Failed to update password.");
      }
    } catch (error: unknown) {
      console.error("Password update error:", error);
      const err = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to change password. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-slate-100 rounded-xl">
          <Settings size={22} className="text-slate-600" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Admin Settings
          </h1>
          <p className="text-sm text-slate-500">
            Configure system configurations, preferences and update password
          </p>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Change Admin Password
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your password to keep the admin panel secure.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
          <PasswordField
            label="Current Password"
            placeholder="Enter your current password"
            show={showCurrent}
            onToggle={() => setShowCurrent((p) => !p)}
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />

          {/* Divider */}
          <div className="border-t border-slate-100" />

          <PasswordField
            label="New Password"
            placeholder="Enter your new password"
            show={showNew}
            onToggle={() => setShowNew((p) => !p)}
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />

          <PasswordField
            label="Confirm New Password"
            placeholder="Confirm your new password"
            show={showConfirm}
            onToggle={() => setShowConfirm((p) => !p)}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          {/* Password rules hint */}
          <ul className="space-y-1">
            {[
              "At least 8 characters long",
              "Use a mix of letters, numbers, and symbols for strength",
            ].map((rule) => (
              <li
                key={rule}
                className="flex items-center gap-2 text-[11px] text-slate-400 font-medium"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                {rule}
              </li>
            ))}
          </ul>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
