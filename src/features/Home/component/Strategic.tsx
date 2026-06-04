"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Image from "next/image";
import { MouseEvent } from "react";


const data = [
  {
    icon: "/images/value.gif",
    title: "Market Volatility",
    desc: "Swift shifts in consumer behavior and macro trends rendering last month’s data obsolete.",
  },
  {
    icon: "/images/thunder.gif",
    title: "Tech Disruption",
    desc: "AI and emerging tech rewriting industry playbooks overnight across every sector.",
  },
  {
    icon: "/images/legal.gif",
    title: "Regulation",
    desc: "Complex global regulatory frameworks and ESG requirements increasing compliance risk.",
  },
  {
    icon: "/images/business-network.gif",
    title: "Fragmented Data",
    desc: "Decision makers drowning in signals but thirsting for actionable strategic narrative.",
  },
];

function StrategicCard({ item }: { item: (typeof data)[0] }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      onMouseMove={handleMouseMove}
      transition={{ duration: 0.2 }}
      className="group relative rounded-2xl border border-[#DEF0FA] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              120px circle at ${mouseX}px ${mouseY}px,
              #0ea5e9,
              transparent 80%
            )
          `,
          maskImage: useMotionTemplate`
            radial-gradient(
              120px circle at ${mouseX}px ${mouseY}px,
              black,
              transparent 80%
            )
          `,
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              120px circle at ${mouseX}px ${mouseY}px,
              black,
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-full  p-2">
          <Image
            src={item.icon}
            alt={item.title}
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            unoptimized
          />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-[#1f2937] text-[22px]">
          {item.title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-[#6b7280] font-semibold">
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function Strategic() {
  return (
    <section className=" py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mx-auto container">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1f2937]">
            Strategic decisions are harder than ever.
          </h2>

          <p className="mt-4 text-sm md:text-lg text-[#6b7280] font-semibold">
            Traditional planning methods fail in the face of modern complexity.
            Move beyond linear forecasts and spreadsheets.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((item, index) => {
            return <StrategicCard key={index} item={item} />;
          })}
        </div>
      </div>
    </section>
  );
}
