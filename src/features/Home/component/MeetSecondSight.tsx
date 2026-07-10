// "use client";

// import {
//   Brain,
//   Globe,
//   Bell,
//   TrendingUp,
//   FileText,
//   Layers,
//   Binoculars,
//   Sparkles,
//   Settings,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import ParticlesBackground from "@/components/shared/ParticlesBackground";
// import Image from "next/image";
// import CountUp from "@/components/shared/CountUp";

// const features = [
//   {
//     icon: Brain,
//     title: "AI Scenario Planning",
//     desc: "Predictive simulations",
//   },
//   {
//     icon: Globe,
//     title: "Environmental Scanning",
//     desc: "Continuous monitoring",
//   },
//   {
//     icon: Bell,
//     title: "Strategic Alerts",
//     desc: "Real-time signals",
//   },
//   {
//     icon: TrendingUp,
//     title: "Predictive Forecasting",
//     desc: "Future-state modeling",
//   },
//   {
//     icon: FileText,
//     title: "Executive Reports",
//     desc: "Boardroom-ready",
//   },
//   {
//     icon: Layers,
//     title: "Multi-Scenario AI",
//     desc: "Parallel intelligence",
//   },
// ];

// export default function MeetSecondSight() {
//   return (
//     <section className="relative overflow-hidden bg-secondary py-20 md:py-28">
//       {/* Network Particle Background */}
//       <div className="absolute inset-0 -z-0 opacity-40 pointer-events-none">
//         <ParticlesBackground id="particles-meet" />
//       </div>

//       <div className="relative z-10 container mx-auto px-4 md:px-6">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
//           {/* Left Column: Text & Features Grid */}
//           <div className="lg:col-span-7 flex flex-col items-start">
//             {/* Pill Badge */}
//             <div className="inline-block bg-white border border-[#E2E8F0] shadow-[0_2px_10px_rgba(0,0,0,0.03)] px-5 py-2.5 rounded-xl text-sm md:text-base font-bold text-[#0F172A] tracking-tight">
//               Meet Second Sight
//             </div>

//             {/* Heading */}
//             <h2 className="text-[34px] sm:text-[42px] md:text-[48px] font-extrabold text-[#0F172A] mt-6 leading-[1.15] tracking-tight max-w-xl">
//               Built for Executive-Level Strategic Decision Making.
//             </h2>

//             {/* Description */}
//             <p className="mt-6 text-[15px] sm:text-[17px] leading-relaxed text-[#5B6B82] max-w-[620px] font-medium">
//               Second Sight combines AI-powered forecasting, environmental
//               scanning, and strategic intelligence to help organizations
//               anticipate future risks, opportunities, and market shifts.
//             </p>

//             {/* Features Grid */}
//             <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 w-full">
//               {features.map((feature, index) => {
//                 const Icon = feature.icon;
//                 return (
//                   <div key={index} className="flex items-center gap-4">
//                     <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
//                       <Icon className="h-5 w-5 text-[#0F172A]" />
//                     </div>
//                     <div>
//                       <h4 className="text-[15px] font-bold text-[#0F172A] leading-tight">
//                         {feature.title}
//                       </h4>
//                       <p className="mt-1 text-[13px] font-semibold text-[#64748B] leading-tight">
//                         {feature.desc}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Right Column: Concentric Circles Visual */}
//           <div className="lg:col-span-5 flex justify-center items-center relative py-12 md:py-16">
//             <div className="relative flex items-center justify-center w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px]">
//               {/* Concentric Circle 4 (Outer) */}
//               <motion.div
//                 className="absolute rounded-full border border-[#BCE1F5]/30 w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px]"
//                 animate={{ scale: [1, 1.015, 1], rotate: 360 }}
//                 transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
//               />
//               {/* Concentric Circle 3 */}
//               <motion.div
//                 className="absolute rounded-full border border-[#BCE1F5]/40 w-[250px] h-[250px] sm:w-[320px] sm:h-[320px] md:w-[370px] md:h-[370px]"
//                 animate={{ scale: [1, 1.02, 1], rotate: -360 }}
//                 transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
//               />
//               {/* Concentric Circle 2 */}
//               <motion.div
//                 className="absolute rounded-full border border-[#BCE1F5]/50 w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] md:w-[300px] md:h-[300px]"
//                 animate={{ scale: [1, 1.025, 1] }}
//                 transition={{
//                   duration: 6,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                 }}
//               />
//               {/* Concentric Circle 1 (Inner) */}
//               <motion.div
//                 className="absolute rounded-full border border-[#BCE1F5]/70 w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[230px] md:h-[230px]"
//                 animate={{
//                   scale: [1, 1.03, 1],
//                 }}
//                 transition={{
//                   duration: 5,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                   delay: 0.5,
//                 }}
//               />

//               {/* Central Core */}
//               <div className="relative z-10 w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] rounded-full bg-[#C2E5F7] flex items-center justify-center shadow-[inset_0_2px_8px_rgba(255,255,255,0.6),0_12px_36px_rgba(15,23,42,0.08)]">
//                 {/* <Binoculars className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-[#0F172A]" /> */}
//                 <Image
//                   src="/images/logo.png"
//                   alt="Second Sight Logo"
//                   width={110}
//                   height={60}
//                   className="h-auto w-[100px] sm:w-[110px] md:w-[130px]"
//                   priority
//                 />
//               </div>

//               {/* Floating Badge 1: Neural Layer */}
//               <motion.div
//                 className="absolute top-[8%] left-[2%] sm:left-[5%] md:left-[8%] z-20 flex items-center gap-2 bg-white border border-[#E2E8F0] shadow-[0_6px_20px_rgba(15,23,42,0.05)] px-3 py-2 rounded-xl whitespace-nowrap"
//                 animate={{ y: [0, -6, 0] }}
//                 transition={{
//                   duration: 4,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                 }}
//               >
//                 <Sparkles className="h-3.5 w-3.5 text-[#0F172A]" />
//                 <span className="text-[11px] sm:text-xs font-bold text-[#0F172A] tracking-tight">
//                   Neural Layer
//                 </span>
//               </motion.div>

//               {/* Floating Badge 2: Signals: 1,247 */}
//               <motion.div
//                 className="absolute top-[40%] -right-2 sm:-right-4 md:-right-6 z-20 flex items-center gap-2 bg-white border border-[#E2E8F0] shadow-[0_6px_20px_rgba(15,23,42,0.05)] px-3 py-2 rounded-xl whitespace-nowrap"
//                 animate={{ y: [0, 6, 0] }}
//                 transition={{
//                   duration: 4.5,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                   delay: 0.5,
//                 }}
//               >
//                 <div className="relative flex h-2 w-2 mr-0.5">
//                   <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
//                   <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
//                 </div>
//                 <span className="text-[11px] sm:text-xs font-bold text-[#0F172A] tracking-tight">
//                   Signals: <CountUp end={1247} />
//                 </span>
//               </motion.div>

//               {/* Floating Badge 3: AI Core Active */}
//               <motion.div
//                 className="absolute bottom-[8%] left-[10%] sm:left-[15%] md:left-[20%] z-20 flex items-center gap-2 bg-white border border-[#E2E8F0] shadow-[0_6px_20px_rgba(15,23,42,0.05)] px-3 py-2 rounded-xl whitespace-nowrap"
//                 animate={{ y: [0, -5, 0] }}
//                 transition={{
//                   duration: 3.8,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                   delay: 1,
//                 }}
//               >
//                 <Settings className="h-3.5 w-3.5 text-[#0F172A] animate-[spin_10s_linear_infinite]" />
//                 <span className="text-[11px] sm:text-xs font-bold text-[#0F172A] tracking-tight">
//                   AI Core Active
//                 </span>
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import {
  Brain,
  Globe,
  Bell,
  TrendingUp,
  FileText,
  Layers,
  Sparkles,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import ParticlesBackground from "@/components/shared/ParticlesBackground";
import Image from "next/image";
import CountUp from "@/components/shared/CountUp";

const features = [
  {
    icon: Brain,
    title: "AI Scenario Planning",
    desc: "Predictive simulations",
  },
  {
    icon: Globe,
    title: "Environmental Scanning",
    desc: "Continuous monitoring",
  },
  { icon: Bell, title: "Strategic Alerts", desc: "Real-time signals" },
  {
    icon: TrendingUp,
    title: "Predictive Forecasting",
    desc: "Future-state modeling",
  },
  { icon: FileText, title: "Executive Reports", desc: "Boardroom-ready" },
  { icon: Layers, title: "Multi-Scenario AI", desc: "Parallel intelligence" },
];

export default function MeetSecondSight() {
  return (
    <section className="relative overflow-hidden bg-secondary py-20 md:py-28">
      {/* Network Particle Background */}
      <div className="absolute inset-0 -z-0 opacity-40 pointer-events-none">
        <ParticlesBackground id="particles-meet" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text & Features Grid */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Pill Badge */}
            <div className="inline-block bg-white border border-[#E2E8F0] shadow-[0_2px_10px_rgba(0,0,0,0.03)] px-5 py-2.5 rounded-xl text-sm md:text-base font-bold text-[#0F172A] tracking-tight">
              Meet Second Sight
            </div>

            {/* Heading */}
            <h2 className="text-[34px] sm:text-[42px] md:text-[48px] font-extrabold text-[#0F172A] mt-6 leading-[1.15] tracking-tight max-w-xl">
              Built for Executive-Level Strategic Decision Making.
            </h2>

            {/* Description */}
            <p className="mt-6 text-[15px] sm:text-[17px] leading-relaxed text-[#5B6B82] max-w-[620px] font-semibold">
              Second Sight combines AI-powered forecasting, environmental
              scanning, and strategic intelligence to help organizations
              anticipate future risks, opportunities, and market shifts.
            </p>

            {/* Features Grid */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 w-full">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                      <Icon className="h-5 w-5 text-[#0F172A]" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-[#0F172A] leading-tight">
                        {feature.title}
                      </h4>
                      <p className="mt-1 text-[13px] font-semibold text-[#64748B] leading-tight">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Exclusive Premium Visual System */}
          <div className="lg:col-span-5 flex justify-center items-center relative py-12 md:py-16 perspective-[1000px]">
            <div className="relative flex items-center justify-center w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[460px] md:h-[460px]">
              {/* Outer Glowing Cyber Ring */}
              <motion.div
                className="absolute rounded-full border border-dashed border-[#BCE1F5]/40 w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[460px] md:h-[460px]"
                animate={{ rotate: 360, scale: [1, 1.02, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />

              {/* Middle Scanning Ring (Tech Radar Mesh) */}
              <motion.div
                className="absolute rounded-full border-2 border-[#BCE1F5]/20 bg-gradient-to-tr from-transparent via-[#C2E5F7]/5 to-transparent w-[260px] h-[260px] sm:w-[330px] sm:h-[330px] md:w-[380px] md:h-[380px]"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />

              {/* Inner Dynamic Wave Ring (Pulse-to-Heartbeat) */}
              <motion.div
                className="absolute rounded-full border border-[#BCE1F5] shadow-[0_0_30px_rgba(194,229,247,0.3)] w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] md:w-[300px] md:h-[300px]"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(194,229,247,0.2)",
                    "0 0 40px rgba(194,229,247,0.6)",
                    "0 0 20px rgba(194,229,247,0.2)",
                  ],
                  scale: [1, 1.04, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Core Wrapper with Breathing Glow */}
              <motion.div
                className="relative z-10 p-1 rounded-full bg-white/40 backdrop-blur-md shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
                animate={{ y: [-6, 6, -6] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Central Core Glassmorphic Capsule */}
                <div className="w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] md:w-[150px] md:h-[150px] rounded-full bg-gradient-to-br from-[#C2E5F7] to-[#9AD1F0] flex items-center justify-center shadow-[inset_0_4px_12px_rgba(255,255,255,0.7)]">
                  <Image
                    src="/images/logo1-removebg.png"
                    alt="Second Sight Logo"
                    width={110}
                    height={60}
                    className="h-auto w-[95px] sm:w-[110px] md:w-[120px] filter drop-shadow-[0_4px_6px_rgba(15,23,42,0.1)]"
                    priority
                  />
                </div>
              </motion.div>

              {/* ================= FLOATING premium BADGES WITH ORBITAL FLOATING ================= */}

              {/* Floating Badge 1: Neural Layer */}
              <motion.div
                className="absolute top-[5%] left-[5%] z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-[#E2E8F0] shadow-[0_8px_24px_rgba(15,23,42,0.06)] px-3.5 py-2 rounded-xl whitespace-nowrap"
                animate={{
                  y: [0, -10, 0],
                  x: [0, 5, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="p-1 rounded-md bg-[#F1F5F9]">
                  <Sparkles className="h-3.5 w-3.5 text-[#0F172A]" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-[#0F172A] tracking-tight">
                  Neural Layer
                </span>
              </motion.div>

              {/* Floating Badge 2: Real-time Signal Tracking */}
              <motion.div
                className="absolute top-[42%] -right-4 sm:-right-8 z-20 flex items-center gap-2.5 bg-white/90 backdrop-blur-md border border-[#E2E8F0] shadow-[0_8px_24px_rgba(15,23,42,0.06)] px-3.5 py-2 rounded-xl whitespace-nowrap"
                animate={{
                  y: [0, 12, 0],
                  x: [0, -4, 0],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              >
                <div className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-[#0F172A] tracking-tight flex items-center gap-1">
                  Signals:{" "}
                  <span className="text-emerald-600 font-extrabold">
                    <CountUp end={1247} />
                  </span>
                </span>
              </motion.div>

              {/* Floating Badge 3: AI Core Process Status */}
              <motion.div
                className="absolute bottom-[8%] left-[12%] z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-[#E2E8F0] shadow-[0_8px_24px_rgba(15,23,42,0.06)] px-3.5 py-2 rounded-xl whitespace-nowrap"
                animate={{
                  y: [0, -8, 0],
                  x: [0, -6, 0],
                }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6,
                }}
              >
                <Settings className="h-3.5 w-3.5 text-[#0F172A] animate-[spin_12s_linear_infinite]" />
                <span className="text-[11px] sm:text-xs font-bold text-[#0F172A] tracking-tight">
                  AI Core Active
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
