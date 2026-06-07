"use client";

import Image from "next/image";
import Link from "next/link";

export default function TestimonialGrid() {
  return (
    <section className="relative px-6 py-20  overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-100px] left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* 👇 FIXED WIDTH HERE */}
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-12 md:flex-row md:items-center">

          {/* Left Side */}
          <div className="md:w-1/2 text-center md:text-left">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              Trusted by Clients
            </span>
            {/* 
            <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-5xl leading-tight">
              Our Trusted Clients
            </h2> */}

            <p className="mt-6 max-w-xl text-sm md:text-[24px] font-semibold text-block leading-relaxed">
              Check our testimonials from our users working in top positions in their corporates
            </p>

            <div className="mt-8 flex justify-center md:justify-start gap-6">
              <div>
                <p className="text-2xl font-bold text-primary">100+</p>
                <p className="text-xs text-gray-500">Happy Clients</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">24/7</p>
                <p className="text-xs text-gray-500">Support</p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-3 rounded-2xl bg-primary/20 blur-xl" />

              <Link href="https://www.trustpilot.com/" target="_blank">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white">
                  <Image
                    src="/images/trust.jpeg"
                    alt="clients"
                    width={250}
                    height={250}
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}