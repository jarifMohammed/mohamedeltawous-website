"use client";

import ParticlesBackground from "@/components/shared/ParticlesBackground";
import Link from "next/link";

const riskIndicators = [
  { name: "Market Crash", level: "HIGH", color: "bg-[#FF6B6B] text-white" },
  {
    name: "Regulatory Shift",
    level: "MED",
    color: "bg-[#F5C451] text-[#1f2937]",
  },
  { name: "Talent War", level: "LOW", color: "bg-[#7ED957] text-[#1f2937]" },
];

const scenarios = [
  {
    title: "Scenario A: Acceleration Economy",
    subtitle:
      "Rapid growth. Disrupted markets. Expanding opportunity. Signals AI ",
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
  return (
    <section className="relative overflow-hidden bg-secondary px-4 pb-16 pt-32 md:pb-24 md:pt-40">
      {/* Dynamic Particles Background */}
      <div className="absolute inset-0 z-0">
        <ParticlesBackground />
      </div>

      <div className="relative z-10 container mx-auto">
        {/* Top content */}
        <div className="mx-auto text-center container">
          <div className="inline-flex items-center rounded-full border border-[#111827]/10 bg-white/40 px-5 py-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-[#111827] backdrop-blur-md">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#111827]" />
            Intelligence Reimagined
          </div>

          <h1 className="mt-8 text-[40px] font-extrabold leading-[1.1] text-[#0F172A] sm:text-6xl lg:text-[76px] tracking-tight">
            AI-Powered Scenario
            <br className="hidden md:block" />
            Planning Platform.
          </h1>

          <p className="mx-auto mt-8 max-w-4xl text-[17px] leading-relaxed text-[#5B6B82] sm:text-xl font-medium">
            Analyze uncertainty, explore multiple futures, and stress-test
            strategic decisions in minutes, not months.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Link
              href="/dashboard/new-scenario"
              className="inline-flex h-[60px] items-center justify-center rounded-xl bg-[#0F172A] px-10 text-[16px] font-bold text-white transition hover:opacity-95 shadow-xl shadow-blue-900/10 cursor-pointer"
            >
              Start Scenario Analysis
            </Link>

            <Link
              href={"/pdf/secondsight.pdf"}
              target="_blank"
              className="inline-flex h-[60px] items-center justify-center rounded-xl border-2 border-[#0F172A] bg-transparent px-10 text-[16px] font-bold text-[#0F172A] transition hover:bg-white/40 cursor-pointer"
            >
              View Sample Report
            </Link>
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="mx-auto mt-16  container rounded-[32px] font-sora">
          <div className="rounded-[31px] border border-[#111827]/20 shadow-[0_32px_80px_rgba(15,23,42,0.12)] bg-white overflow-hidden">
            {/* Window top bar */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-[#FF6B6B]" />
                <span className="h-3 w-3 rounded-full bg-[#F5C451]" />
                <span className="h-3 w-3 rounded-full bg-[#36C690]" />
              </div>

              <div className="h-4 w-32 rounded-full bg-[#F1F5F9]" />
            </div>

            <div className="p-5 md:p-10">
              {/* <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]"> */}
              <div className="">
                {/* Left sidebar */}
                {/* <div className="space-y-6">
                  <div className="rounded-[24px] bg-secondary p-7">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#4B5E7D]">
                      Robustness Score
                    </p>

                    <div className="mt-6 flex items-baseline gap-2">
                      <span className="text-[56px] font-extrabold leading-none text-[#0F172A]">
                        84
                      </span>
                      <span className="text-[15px] font-bold text-[#16A34A]">
                        +12%
                      </span>
                    </div>

                    <div className="mt-6 h-2 w-full rounded-full bg-[#D1E4F3]">
                      <div className="h-2 w-[84%] rounded-full bg-[#0F172A]" />
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-secondary p-7">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#4B5E7D]">
                      Risk Indicators
                    </p>

                    <div className="mt-5 space-y-4">
                      {riskIndicators.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="text-[15px] font-semibold text-[#1F2937]">
                            {item.name}
                          </span>
                          <span
                            className={`rounded px-2.5 py-1 text-[11px] font-bold ${item.color}`}
                          >
                            {item.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div> */}

                {/* Right matrix */}
                <div className="rounded-[24px] bg-secondary p-6 md:p-8">
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-[22px] font-extrabold text-primary">
                      Scenario Intelligence Matrix
                    </h3>

                    {/* <div className="inline-flex w-fit items-center rounded-xl border border-gray-200 bg-white/60 p-1.5 backdrop-blur-sm">
                      <button className="rounded-lg px-5 py-2 text-[14px] font-bold text-[#0F172A] cursor-pointer">
                        Week
                      </button>
                      <button className="rounded-lg bg-[#0F172A] px-5 py-2 text-[14px] font-bold text-white shadow-lg cursor-pointer">
                        Month
                      </button>
                    </div> */}
                  </div>

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
        </div>
      </div>
    </section>
  );
}
