"use client";

import { Brain, Radar, BarChart3 } from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: Brain,
    image: "/meet.png",
    title: "AI Scenario Generator",
    desc: "Leverage LLMs and proprietary data models to instantly visualize multiple divergent futures.",
  },
  {
    icon: Radar,
    image: "/meet2.png",
    title: "Strategy Stress Testing",
    desc: "Run your current roadmap against 10,000+ edge cases to identify hidden vulnerabilities.",
  },
  {
    icon: BarChart3,
    image: "/meet3.png",
    title: "Board-Ready Reports",
    desc: "Synthesize complex data into executive-grade presentations and strategy memos in seconds.",
  },
];

export default function MeetSecondSight() {
  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-primary">
            Meet Second Sight
          </h2>

          <p className="mt-4 text-sm md:text-lg text-[#6b7280]">
            The ultimate toolkit for high-stakes strategic foresight.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((item, index) => {
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
              >
                {/* Image/Illustration Container */}
                <div className="relative overflow-hidden rounded-xl bg-[#f1f5f9] aspect-[16/10] flex items-center justify-center">
                  <Image
                    width={500}
                    height={500}
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                {/* Text Content */}
                <div className="pt-5 px-1">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#0f172a] tracking-tight">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
