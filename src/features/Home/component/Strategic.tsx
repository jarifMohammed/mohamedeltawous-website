"use client";

import { BarChart3, Zap, Gavel, Network } from "lucide-react";

const data = [
  {
    icon: BarChart3,
    title: "Market Volatility",
    desc: "Swift shifts in consumer behavior and macro trends rendering last month’s data obsolete.",
  },
  {
    icon: Zap,
    title: "Tech Disruption",
    desc: "AI and emerging tech rewriting industry playbooks overnight across every sector.",
  },
  {
    icon: Gavel,
    title: "Regulation",
    desc: "Complex global regulatory frameworks and ESG requirements increasing compliance risk.",
  },
  {
    icon: Network,
    title: "Fragmented Data",
    desc: "Decision makers drowning in signals but thirsting for actionable strategic narrative.",
  },
];

export default function Strategic() {
  return (
    <section className=" py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mx-auto container">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1f2937]">
            Strategic decisions are harder than ever.
          </h2>

          <p className="mt-4 text-sm md:text-lg text-[#6b7280]">
            Traditional planning methods fail in the face of modern complexity.
            Move beyond linear forecasts and spreadsheets.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="rounded-2xl border border-[#DEF0FA] bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf2f9]">
                  <Icon className="h-5 w-5 text-[#1f2937]" />
                </div>

                {/* Title */}
                <h3 className="mt-5 text-lg font-semibold text-[#1f2937]">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
