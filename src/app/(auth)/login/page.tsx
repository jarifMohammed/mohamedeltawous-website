"use client";

import React, { MouseEvent, Suspense, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ParticlesBackground from "@/components/shared/ParticlesBackground";

// ======================
// Validation Schemas
// ======================

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type LoginFormType = z.infer<typeof loginSchema>;
type RegisterFormType = z.infer<typeof registerSchema>;

function AnimatedAuth() {
  const [isLogin, setIsLogin] = useState(true);

  // Login states
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register states
  const [registerLoading, setRegisterLoading] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const safeCallbackUrl =
    callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : null;

  const toggleForm = () => setIsLogin(!isLogin);

  // ======================
  // Login Form
  // ======================

  const loginForm = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (payload: LoginFormType) => {
    try {
      setLoginLoading(true);

      const res = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Login successful!");

      const session = await getSession();
      const role = (session?.user as { role?: string })?.role;
      if (safeCallbackUrl) {
        router.push(safeCallbackUrl);
      } else if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard/new-scenario");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoginLoading(false);
    }
  };

  // ======================
  // Register Form
  // ======================

  const registerForm = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegister = async (values: RegisterFormType) => {
    try {
      setRegisterLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.fullName,
            email: values.email,
            password: values.password,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Registration failed");
      }

      toast.success("Account created successfully!");

      const accessToken = data?.data?.accessToken;
      if (!accessToken) {
        throw new Error("Verification token missing from server response");
      }

      localStorage.setItem("registration_verification_token", accessToken);
      localStorage.setItem("registration_verification_email", values.email);

      const params = new URLSearchParams({ email: values.email });
      if (safeCallbackUrl) {
        params.set("callbackUrl", safeCallbackUrl);
      }

      router.push(`/verify-email?${params.toString()}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed",
      );
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-6 sm:p-6">
      {/* Main Container */}
      <div className="relative w-full max-w-6xl bg-white rounded-3xl lg:rounded-[40px] shadow-2xl overflow-hidden min-h-0 lg:min-h-[700px] flex border border-slate-100">
        {/* Sliding Overlay Section */}
        <motion.div
          animate={{ x: isLogin ? "100%" : "0%" }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
          className="absolute top-0 left-0 w-1/2 h-full bg-secondary z-20 hidden lg:flex flex-col items-center justify-center text-white p-12 text-center overflow-hidden"
        >
          {/* Dotted particles background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <ParticlesBackground id="auth-particles" />
          </div>

          <motion.div
            key={isLogin ? "signup-txt" : "login-txt"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10"
          >
            <h2 className="text-4xl font-bold mb-4 text-[#0F172A]">
              {isLogin ? "Hello, Chief!" : "Welcome Back!"}
            </h2>

            <p className="text-[#475569] mb-8 leading-relaxed">
              {isLogin
                ? "Enter your personal details and start your journey with us."
                : "To keep connected with us please login with your personal info."}
            </p>

            <button
              onClick={toggleForm}
              className="px-10 py-3 border-2 border-[#0F172A] text-[#0F172A] cursor-pointer rounded-[8px] font-bold hover:bg-[#0F172A] hover:text-white transition-all duration-300 cursor-pointer"
            >
              {isLogin ? "SIGN UP" : "LOG IN"}
            </button>
          </motion.div>
        </motion.div>

        {/* ======================
            Login Section
        ====================== */}

        <AuthSpotlightPanel
          className={`w-full lg:w-1/2 px-5 py-8 sm:p-10 md:p-16 flex-col justify-center transition-opacity duration-500 ${isLogin ? "flex" : "hidden lg:flex lg:opacity-0"
            }`}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Login to Account
          </h2>

          <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">
            Use your email for login
          </p>

          <form
            onSubmit={loginForm.handleSubmit(handleLogin)}
            className="space-y-4"
          >
            <AuthInput
              icon={<Mail size={18} />}
              type="email"
              placeholder="Email"
              {...loginForm.register("email")}
            />

            {loginForm.formState.errors.email && (
              <p className="text-red-500 text-sm">
                {loginForm.formState.errors.email.message}
              </p>
            )}

            <AuthInput
              icon={<Lock size={18} />}
              type={showLoginPassword ? "text" : "password"}
              placeholder="Password"
              {...loginForm.register("password")}
              showPassword={showLoginPassword}
              setShowPassword={setShowLoginPassword}
            />

            {loginForm.formState.errors.password && (
              <p className="text-red-500 text-sm">
                {loginForm.formState.errors.password.message}
              </p>
            )}

            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-sm text-slate-500 hover:text-pink-500 transition-colors cursor-pointer"
            >
              Forgot password?
            </button>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#0F172A] text-white py-4 rounded-[8px] font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Logging in...
                </>
              ) : (
                "LOG IN"
              )}
            </button>
          </form>

          <button
            onClick={toggleForm}
            className="lg:hidden mt-6 text-[#0F172A] font-bold text-sm cursor-pointer"
          >
            New here? Sign Up
          </button>
        </AuthSpotlightPanel>

        {/* ======================
            Register Section
        ====================== */}

        <AuthSpotlightPanel
          className={`w-full lg:w-1/2 px-5 py-8 sm:p-10 md:p-16 flex-col justify-center transition-opacity duration-500 ${isLogin ? "hidden lg:flex lg:opacity-0" : "flex"
            }`}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Create Account
          </h2>

          <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">
            Join our community today
          </p>

          <form
            onSubmit={registerForm.handleSubmit(handleRegister)}
            className="space-y-4"
          >
            <AuthInput
              icon={<User size={18} />}
              type="text"
              placeholder="Full Name"
              {...registerForm.register("fullName")}
            />

            {registerForm.formState.errors.fullName && (
              <p className="text-red-500 text-sm">
                {registerForm.formState.errors.fullName.message}
              </p>
            )}

            <AuthInput
              icon={<Mail size={18} />}
              type="email"
              placeholder="Email"
              {...registerForm.register("email")}
            />

            {registerForm.formState.errors.email && (
              <p className="text-red-500 text-sm">
                {registerForm.formState.errors.email.message}
              </p>
            )}

            <AuthInput
              icon={<Lock size={18} />}
              type={showRegisterPassword ? "text" : "password"}
              placeholder="Password"
              {...registerForm.register("password")}
              showPassword={showRegisterPassword}
              setShowPassword={setShowRegisterPassword}
            />

            {registerForm.formState.errors.password && (
              <p className="text-red-500 text-sm">
                {registerForm.formState.errors.password.message}
              </p>
            )}

            <AuthInput
              icon={<Lock size={18} />}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...registerForm.register("confirmPassword")}
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
            />

            {registerForm.formState.errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {registerForm.formState.errors.confirmPassword.message}
              </p>
            )}

            <button
              type="submit"
              disabled={registerLoading}
              className="w-full bg-[#0F172A] text-white py-4 rounded-[8px] font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {registerLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Creating Account...
                </>
              ) : (
                "SIGN UP"
              )}
            </button>
          </form>

          <button
            onClick={toggleForm}
            className="lg:hidden mt-6 text-[#0F172A] font-bold text-sm cursor-pointer"
          >
            Have an account? Log In
          </button>
        </AuthSpotlightPanel>
      </div>
    </section>
  );
}

export default function AnimatedAuthPage() {
  return (
    <Suspense
      fallback={
        <section className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin text-slate-700" />
        </section>
      }
    >
      <AnimatedAuth />
    </Suspense>
  );
}

type AuthSpotlightPanelProps = {
  children: React.ReactNode;
  className?: string;
};

function AuthSpotlightPanel({ children, className }: AuthSpotlightPanelProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden bg-white ${className ?? ""}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 blur-[22px] transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              190px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.18),
              transparent 72%
            )
          `,
        }}
      />

      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              340px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.14),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
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
    const isPassword = type === "password" || type === "text";

    return (
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <input
          ref={ref}
          type={type}
          {...props}
          className="w-full pl-11 pr-12 py-3.5 sm:pl-12 sm:pr-14 sm:py-4 rounded-[14px] sm:rounded-[16px] border border-black/10 bg-white text-sm sm:text-base focus:ring-1 focus:ring-black outline-none transition-all"
        />

        {setShowPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    );
  },
);

AuthInput.displayName = "AuthInput";
