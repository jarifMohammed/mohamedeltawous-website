
"use client";

import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { Star } from "lucide-react";
import { MouseEvent } from "react";

const testimonials = [
  {
    id: 1,
    brand: "hulu",
    rating: "4.9",
    name: "Kate Davis",
    username: "friable_captain_8",
    review:
      "The progress tracker is fantastic. It's motivating to see how much I've improved over time. The app has a great mix of",
  },
  {
    id: 2,
    brand: "HBOMax",
    rating: "3.2",
    name: "Martin Kazlauskas",
    username: "sartorial_statue_59",
    review:
      "The progress tracker is fantastic. It's motivating to see how much I've improved over time. The app has a great mix of",
  },
  {
    id: 3,
    brand: "Disney+",
    rating: "4.9",
    name: "Sanjay Sharma",
    username: "voracious_rainbows_68",
    review:
      "The progress tracker is fantastic. It's motivating to see how much I've improved over time. The app has a great mix of",
  },
  {
    id: 4,
    brand: "STARZ",
    rating: "3.2",
    name: "Tawanna Afumba",
    username: "intransigent_toejam_15",
    review:
      "The progress tracker is fantastic. It's motivating to see how much I've improved over time. The app has a great mix of",
  },
  {
    id: 5,
    brand: "Vix",
    rating: "4.9",
    name: "Larry King",
    username: "pendulous_unicorn_46",
    review:
      "The progress tracker is fantastic. It's motivating to see how much I've improved over time. The app has a great mix of",
  },
  {
    id: 6,
    brand: "prime video",
    rating: "3.2",
    name: "Fatima Mohamed",
    username: "salubrious_artist_72",
    review:
      "The progress tracker is fantastic. It's motivating to see how much I've improved over time. The app has a great mix of",
  },
];

function TestimonialCard({
  item,
}: {
  item: (typeof testimonials)[0];
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      whileHover={{
        rotate: 1,
        scale: 1.02,
        y: -10,
      }}
      onMouseMove={handleMouseMove}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className="group relative overflow-hidden rounded-[16px] border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md"
    >
      {/* Glow Background */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[16px] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              rgba(0, 211, 169, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      {/* Cursor Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[16px] opacity-0 transition duration-300 group-hover:opacity-100"
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
        <div className="mb-6 flex items-center justify-between">
          <span className="text-2xl font-bold uppercase italic tracking-tight text-[#0ea5e9]">
            {item.brand}
          </span>

          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1E293B]">
              {item.rating}
            </span>

            <Star className="h-5 w-5 fill-[#0f172a] text-[#0f172a]" />
          </div>
        </div>

        <p className="mb-8 text-[15px] font-semibold leading-relaxed text-[#475569]">
          {item.review}
        </p>

        <div>
          <h4 className="text-xl font-bold text-[#1E293B]">
            {item.name}
          </h4>

          <p className="text-sm font-medium text-[#475569]">
            {item.username}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialGrid() {
  return (
    <section className="px-6 pb-10">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="flex items-center justify-center gap-3 text-3xl font-bold text-primary md:text-5xl">
            Our Trusted Clients
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm font-semibold leading-relaxed text-gray-500 md:text-base">
            Our mission is to drive progress and enhance the lives of our
            customers by delivering superior products and services that exceed
            expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

