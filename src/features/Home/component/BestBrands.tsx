"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import ParticlesBackground from "@/components/shared/ParticlesBackground";
import CountUp from "@/components/shared/CountUp";

const brandImages = [
  { label: "Brand 1", src: "/images/brand-1.jpg" },
  { label: "Brand 2", src: "/images/brand-2.png" },
  { label: "Brand 3", src: "/images/brand-3.png" },
  { label: "Brand 4", src: "/images/brand-4.png" },
  { label: "Brand 5", src: "/images/brand-5.webp" },
];

// Duplicate slides so loop looks continuous and never feels like it ends.
const slides = [...brandImages, ...brandImages, ...brandImages];

function LogoCard({ src, label }: { src: string; label: string }) {
  return (
    <div
      className="w-[180px] h-[96px] sm:w-[210px] sm:h-[104px] shrink-0 flex items-center justify-center bg-white border border-[#E2E8F0] rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300"
      aria-label={label}
    >
      <Image
        src={src}
        alt={label}
        width={136}
        height={64}
        className="max-w-[136px] max-h-[64px] h-auto w-auto object-contain"
      />
    </div>
  );
}

export default function BestBrands() {
  const autoplay = React.useRef(
    Autoplay({ delay: 1800, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [autoplay.current],
  );

  const scrollPrev = React.useCallback(() => {
    emblaApi?.scrollPrev();
    autoplay.current.play();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    emblaApi?.scrollNext();
    autoplay.current.play();
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden bg-secondary py-20 md:py-28">
      <div className="absolute inset-0 -z-0 opacity-40 pointer-events-none">
        <ParticlesBackground id="particles-brands" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
          <h2 className="text-[26px] sm:text-[32px] md:text-[38px] font-extrabold text-[#0F172A] tracking-tight leading-snug max-w-2xl">
            Over <CountUp end={2600} /> of the world&apos;s best
            <br />
            brands plan with Second Sight. Be the next.
          </h2>

          <div className="flex gap-3 shrink-0 mt-1">
            <button
              onClick={scrollPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#E2E8F0] shadow-sm hover:bg-[#f8fafc] hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label="Previous brand"
            >
              <ArrowLeft className="h-4 w-4 text-[#0F172A]" />
            </button>
            <button
              onClick={scrollNext}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#E2E8F0] shadow-sm hover:bg-[#f8fafc] hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label="Next brand"
            >
              <ArrowRight className="h-4 w-4 text-[#0F172A]" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5 select-none cursor-grab active:cursor-grabbing">
            {slides.map((item, idx) => (
              <div key={`${item.src}-${idx}`} className="shrink-0">
                <LogoCard src={item.src} label={item.label} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
