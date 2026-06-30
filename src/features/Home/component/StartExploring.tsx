"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { useSession } from "next-auth/react";
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
              className="inline-flex h-[52px] items-center justify-center rounded-xl bg-[#0F172A] px-8 text-[15px] font-bold text-white transition hover:opacity-90 shadow-xl shadow-blue-900/10 cursor-pointer"
            >
              Start Scenario Analysis
            </Link>
            <motion.div
              className="absolute pointer-events-none z-20"
              initial={{ x: 60, y: 60, opacity: 0 }}
              animate={{
                x: [60, 35, 35, 60],
                y: [60, 14, 14, 60],
                opacity: [0, 1, 1, 0],
                scale: [1, 1, 0.88, 1],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                repeatDelay: 0.8,
                ease: "easeInOut",
              }}
            >
              {/* Exact Pointer Hand Cursor SVG */}
              <svg
                width="35"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-[0_3px_5px_rgba(0,0,0,0.25)]"
              >
                <path
                  d="M8.5 11V3.5a1.5 1.5 0 0 1 3 0V11h.5a1.5 1.5 0 0 1 3 0h.5a1.5 1.5 0 0 1 3 0h.5a1.5 1.5 0 0 1 1.5 1.5v4c0 3.5-2.5 6-6 6H12c-2.5 0-4.5-1.5-5.5-3.5L4.1 14.2a1.2 1.2 0 0 1 .4-1.6 1.2 1.2 0 0 1 1.6.4l1.4 2.5V11h1z"
                  fill="white"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
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
