"use client";

import {
  User,
  UserCheck,
  Wallet,
  Lightbulb,
  Users,
  Scale,
  Landmark,
} from "lucide-react";
import { motion } from "framer-motion";

const roles = [
  {
    icon: User,
    title: "Startup owners",
    desc: "Transition from static annual plans to dynamic strategic foresight operations.",
  },
  {
    icon: UserCheck,
    title: "C-level executives",
    desc: "Make high-stakes capital allocation decisions with validated scenario data.",
  },
  {
    icon: Wallet,
    title: "Department Heads",
    desc: "Stress test portfolio companies against macro shocks and competitive shifts.",
  },
  {
    icon: Lightbulb,
    title: "Consultants",
    desc: "Deliver high-velocity intelligence projects with board-ready AI-powered outputs.",
  },
  {
    icon: Users,
    title: "Startup owners",
    desc: "Transition from static annual plans to dynamic strategic foresight operations.",
  },
  {
    icon: Scale,
    title: "Legal Evaluators",
    desc: "Make high-stakes capital allocation decisions with validated scenario data.",
  },
  {
    icon: Landmark,
    title: "Government Officials",
    desc: "Stress test portfolio companies against macro shocks and competitive shifts.",
  },
  {
    icon: User,
    title: "Directors",
    desc: "Deliver high-velocity intelligence projects with board-ready AI-powered outputs.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function WhoShouldUse() {
  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Heading & Subtitle */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-[34px] sm:text-[42px] md:text-[48px] font-extrabold text-[#0F172A] tracking-tight leading-[1.15]">
            Who should use Second Sight?
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#5B6B82] font-medium leading-relaxed">
            Empowering executives, strategists, and organizations to navigate
            uncertainty with confidence.
          </p>
        </div>

        {/* Roles Grid */}
        <motion.div
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="group flex flex-col items-start p-8 rounded-[24px] border border-[#E2E8F0]/80 bg-gradient-to-tr from-white via-white to-[#EBF6FC]/60 shadow-[0_4px_20px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] hover:border-[#DEF0FA] transition-all duration-300"
              >
                {/* Icon Container */}
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E2F0FA] mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Icon className="h-6 w-6 text-[#0F172A]" />
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-[20px] font-bold text-[#0F172A] tracking-tight">
                  {role.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm text-[#5B6B82] leading-relaxed font-medium">
                  {role.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
