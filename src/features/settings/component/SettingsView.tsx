"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
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
  UserRound,
  Mail,
  BadgeCheck,
} from "lucide-react";
import { useChangePassword } from "../hooks/useSettings";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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
      <label className="text-xs font-black uppercase tracking-wider text-slate-400">
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
          className={`w-full pl-11 pr-12 py-3 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none transition-all text-sm font-medium placeholder:text-slate-400 ${error
              ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30"
              : "border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400/20"
            }`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  )
);
PasswordField.displayName = "PasswordField";

// ─── Main Component ────────────────────────────────────────────────────────
export default function SettingsView() {
  const { data: session, status } = useSession();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate: changePassword, isPending } = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = (values: FormType) => {
    changePassword(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      { onSuccess: () => reset() }
    );
  };

  const userInfo = [
    {
      label: "Name",
      value: session?.user?.name || "Not provided",
      icon: UserRound,
    },
    {
      label: "Email",
      value: session?.user?.email || "Not provided",
      icon: Mail,
    },
    {
      label: "Role",
      value: session?.user?.role || "Not provided",
      icon: BadgeCheck,
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 max-w-4xl mx-auto w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Manage your account security and preferences.
        </p>
      </div>

      <Tabs defaultValue="information" className="w-full gap-6">
        <TabsList className="h-auto w-full justify-start rounded-xl bg-slate-100 p-1 dark:bg-slate-900 sm:w-fit">
          <TabsTrigger
            value="information"
            className="h-10 px-5 text-sm font-bold"
          >
            <UserRound className="h-4 w-4" />
            Information
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="h-10 px-5 text-sm font-bold"
          >
            <KeyRound className="h-4 w-4" />
            Change Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value="information">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/20">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                  User Information
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  View your current account details.
                </p>
              </div>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
              {userInfo.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40"
                  >
                    <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    <p className="mt-4 text-xs font-black uppercase tracking-wider text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-1 break-words text-sm font-bold text-slate-900 dark:text-white">
                      {status === "loading" ? "Loading..." : item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="password">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-950">
            {/* Card Header */}
            <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/20">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                  Change Password
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Update your password to keep your account secure.
                </p>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 p-6 md:p-8"
            >
              <PasswordField
                label="Current Password"
                placeholder="Enter your current password"
                show={showCurrent}
                onToggle={() => setShowCurrent((p) => !p)}
                error={errors.currentPassword?.message}
                {...register("currentPassword")}
              />

              {/* Divider */}
              <div className="border-t border-slate-100 dark:border-slate-800" />

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
                    className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500"
                  >
                    <ShieldCheck className="h-3 w-3 shrink-0 text-emerald-400" />
                    {rule}
                  </li>
                ))}
              </ul>

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-black uppercase tracking-wider text-white transition-all hover:shadow-lg disabled:opacity-60 dark:bg-white dark:text-slate-950"
                >
                  {isPending ? (
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
