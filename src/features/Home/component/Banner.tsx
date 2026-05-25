"use client";

import { motion } from "framer-motion";
import ParticlesBackground from "@/components/shared/ParticlesBackground";
import CountUp from "@/components/shared/CountUp";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const scenarios = [
  {
    title: "Scenario A: Acceleration Economy",
    subtitle:
      "Rapid growth. Disrupted markets. Expanding opportunity. Signals AI adoption surges Capital flows increase New entrants reshape industries",
    bordered: true,
  },
  {
    title: "Scenario B: Controlled Stability",
    subtitle:
      "Predictable markets. Slower innovation. Operational optimization. Signals Regulatory balance Moderate growth Industry maturity",
  },
  {
    title: "Scenario C: Fractured Landscape",
    subtitle:
      "Volatility rises. Markets diverge. Uncertainty intensifies. Signals Geopolitical instability Consumer fragmentation Supply chain disruption",
  },
  {
    title: "Scenario D: Power Concentration",
    subtitle:
      "Market consolidation. Dominant platforms. Reduced flexibility. Signals Mergers accelerate",
  },
];

export default function Banner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"Week" | "Month">("Month");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <section className="relative overflow-hidden bg-secondary px-4 pb-24 pt-28 md:pt-48">
      {/* Particles Background */}
      <div className="absolute inset-0 -z-0 pointer-events-none">
        <ParticlesBackground />
      </div>

      <div className="relative z-10 container mx-auto">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col items-start">
            <h1 className="text-[38px] sm:text-5xl lg:text-[58px] font-extrabold leading-[1.1] tracking-tight text-[#0F172A]">
              AI-Powered Scenario
              <br />
              Planning Platform.
            </h1>

            <p className="mt-6 text-[16px] sm:text-[17px] leading-relaxed text-[#5B6B82] font-medium max-w-[480px]">
              Enabling Businesses and Organizations to Create High-Quality,
              Professional Scenario Plans with AI
            </p>

            <div className="mt-9">
              <Link
                href="/dashboard/new-scenario"
                className="inline-flex h-[52px] items-center justify-center rounded-xl bg-[#0F172A] px-8 text-[15px] font-bold text-white transition hover:opacity-90 shadow-xl shadow-blue-900/10 cursor-pointer"
              >
                Start Scenario Analysis
              </Link>
            </div>

            {/* Trusted by */}
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {["bg-[#F472B6]", "bg-[#60A5FA]", "bg-[#34D399]"].map(
                  (color, i) => (
                    <div
                      key={i}
                      className={`h-8 w-8 rounded-full border-2 border-secondary ${color} flex items-center justify-center text-white text-[10px] font-bold`}
                    >
                      {["M", "A", "K"][i]}
                    </div>
                  ),
                )}
              </div>
              <p className="text-[14px] font-medium text-[#5B6B82]">
                Trusted by{" "}
                <span className="font-bold text-[#0F172A]">
                  <CountUp end={2400} suffix="+" fromTop duration={3.6} />
                </span>{" "}
                teams
              </p>
            </div>
          </div>

          {/* ── RIGHT COLUMN – Video + Floating Cards ── */}
          <div className="relative mt-10 sm:mt-0">
            {/* Video */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(15,23,42,0.16)] border border-white/60">
              <video
                ref={videoRef}
                src="/videos/banner.mp4"
                className="w-full h-full object-cover aspect-video"
                loop
                autoPlay
                muted
                playsInline
                onEnded={() => setPlaying(false)}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />

              <button
                onClick={togglePlay}
                className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
                aria-label={playing ? "Pause video" : "Play video"}
              >
                {playing ? (
                  <svg
                    className="w-4 h-4 text-[#0F172A]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-[#0F172A] ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            </div>
            {/* Floating Card: Risk Forecast – top left */}
            <div className="absolute -top-5 -left-6 hidden sm:block z-10 opacity-90 backdrop-blur-md ">
              <div className="bg-white/80 rounded-2xl shadow-xl px-4 py-3 min-w-[150px] border border-gray-100">
                <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] font-medium">
                  <span>Risk Forecast</span>
                  <svg
                    className="w-3.5 h-3.5 text-[#94A3B8]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#22C55E] flex-shrink-0" />
                  <span className="text-[18px] font-extrabold text-[#0F172A]">
                    Low · <CountUp end={12} suffix="%" fromTop duration={3.2} />
                  </span>
                </div>
              </div>
            </div>
            {/* Floating Card: Market Trend – top right */}
            <div className="absolute -top-5 -right-6 hidden sm:block z-10 opacity-90 backdrop-blur-md">
              <div className="bg-white/80 rounded-2xl shadow-xl px-4 py-3 min-w-[140px] border border-gray-100">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-[#64748B] font-medium">
                      Market Trend
                    </p>
                    <p className="mt-1 text-[18px] font-extrabold text-[#0F172A]">
                      <CountUp
                        end={24.8}
                        decimals={1}
                        prefix="+"
                        suffix="%"
                        fromTop
                        duration={3.8}
                      />
                    </p>
                    <p className="text-[10px] text-[#94A3B8] font-medium">
                      QoQ
                    </p>
                  </div>
                  <div className="flex items-end gap-0.5 h-8">
                    {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 rounded-sm bg-[#3B82F6] origin-bottom"
                        style={{ height: `${h}%` }}
                        initial={{ scaleY: 0.1, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        transition={{
                          duration: 1.25,
                          delay: 0.35 + i * 0.14,
                          ease: "easeOut",
                        }}
                        aria-hidden
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Floating Card: AI Prediction – bottom center */}
            <div className="absolute -bottom-5 left-10 -translate-x-1/2 hidden sm:block w-max z-10 opacity-90 backdrop-blur-sm">
              <div className="bg-white/80 rounded-2xl shadow-xl px-5 py-3 border border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-[#3B82F6]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#0F172A]">
                      AI Prediction Accuracy
                    </p>
                    <p className="text-[20px] font-extrabold text-[#0F172A] leading-tight">
                      <CountUp
                        end={96.4}
                        decimals={1}
                        suffix="%"
                        fromTop
                        duration={4}
                      />
                    </p>
                    <p className="text-[11px] text-[#94A3B8]">
                      Across <CountUp end={1284} fromTop duration={3.4} />{" "}
                      simulations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* DASHBOARD — Scenario Intelligence Matrix */}

      <div className="mx-auto mt-24 rounded-[32px] font-sora relative z-20">
        <div className="rounded-[31px] border border-[#111827]/20 shadow-[0_32px_80px_rgba(15,23,42,0.12)] bg-white/80 overflow-hidden container mx-auto ">
          <div className="p-5 md:p-10 z-50">
            <div className="rounded-[24px] bg-secondary p-6 md:p-8">
              {/* Header row */}
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <h3 className="text-[22px] font-extrabold text-primary">
                  Scenario Intelligence Matrix
                </h3>
                {/* Week / Month toggle */}
                <div className="inline-flex w-fit items-center rounded-xl border border-gray-200 bg-white/60 p-1.5 backdrop-blur-sm">
                  {(["Week", "Month"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-lg px-5 py-2 text-[14px] font-bold cursor-pointer transition ${
                        activeTab === tab
                          ? "bg-[#0F172A] text-white shadow-lg"
                          : "text-[#0F172A]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scenario cards grid */}
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {scenarios.map((item) => (
                  <div
                    key={item.title}
                    className={`flex min-h-[140px] flex-col items-center justify-center rounded-[24px] bg-white px-6 py-8 text-center transition hover:shadow-xl hover:shadow-gray-200/50 ${
                      item.bordered
                        ? "border-[3px] border-dashed border-[#E2E8F0]"
                        : ""
                    }`}
                  >
                    <h4 className="text-[20px] font-extrabold text-[#0F172A]">
                      {item.title}
                    </h4>
                    <p className="mt-2.5 text-[14px] font-medium text-[#64748B]">
                      {item.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
