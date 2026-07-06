"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { useSession } from "next-auth/react";
import { MousePointer2 } from "lucide-react";
import AuthRequiredDialog from "@/components/shared/AuthRequiredDialog";

export default function StartExploring() {
  const { status } = useSession();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const scenarioHref = "/dashboard/new-scenario";

  const handleScenarioClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (status === "loading") {
      event.preventDefault();
      return;
    }

    if (status === "unauthenticated") {
      event.preventDefault();
      setIsAuthDialogOpen(true);
    }
  };

  return (
    <section className="relative w-full h-[600px] overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/StartExploring.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
        <div className="max-w-4xl">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Start Exploring Strategic <br />
            Futures Today.
          </h2>

          <p className="mt-5 text-sm md:text-lg text-white/80 max-w-2xl mx-auto">
            Join elite strategy teams using Second Sight to navigate uncertainty
            with clarity and conviction.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={scenarioHref}
              onClick={handleScenarioClick}
              className="relative inline-flex h-[52px] cursor-default items-center justify-center rounded-xl bg-[#0F172A] px-8 text-[15px] font-bold text-white shadow-xl shadow-blue-900/10 transition hover:-translate-y-0.5 hover:shadow-2xl active:scale-95"
            >
              <span className="relative z-10">Start Scenario Analysis</span>
              <motion.span
                className="pointer-events-none absolute z-20 text-white drop-shadow-[0_3px_5px_rgba(0,0,0,0.28)]"
                initial={{ x: 76, y: 42, opacity: 0 }}
                animate={{
                  x: [76, 38, 38, 76],
                  y: [42, 18, 18, 42],
                  opacity: [0, 1, 1, 0],
                  scale: [1, 1, 0.9, 1],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  repeatDelay: 0.8,
                  ease: "easeInOut",
                }}
              >
                <MousePointer2
                  size={30}
                  strokeWidth={2.4}
                  className="-rotate-12 fill-white/95 text-[#0F172A]"
                />
                <motion.span
                  className="absolute -right-1 -top-1 h-3 w-3 rounded-full border border-white/80 bg-sky-300/80"
                  animate={{
                    scale: [0.6, 1.8, 0.6],
                    opacity: [0, 0.75, 0],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    repeatDelay: 0.8,
                    ease: "easeInOut",
                  }}
                />
              </motion.span>
            </Link>
          </div>
        </div>
      </div>
      <AuthRequiredDialog
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
      />
    </section>
  );
}
