// "use client";

// import {
//   User,
//   UserCheck,
//   Wallet,
//   Lightbulb,
//   Users,
//   Scale,
//   Landmark,
//   User2,
//   UsersRound,
// } from "lucide-react";
// import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
// import { MouseEvent } from "react";

// const roles = [
//   {
//     icon: User,
//     title: "Startup owners",
//     desc: "Transition from static annual plans to dynamic strategic foresight operations.",
//   },
//   {
//     icon: UserCheck,
//     title: "C-level executives",
//     desc: "Make high-stakes capital allocation decisions with validated scenario data.",
//   },
//   {
//     icon: Wallet,
//     title: "Department Heads",
//     desc: "Stress test portfolio companies against macro shocks and competitive shifts.",
//   },
//   {
//     icon: Lightbulb,
//     title: "Consultants",
//     desc: "Deliver high-velocity intelligence projects with board-ready AI-powered outputs.",
//   },
//   // {
//   //   icon: Users,
//   //   title: "Startup owners",
//   //   desc: "Transition from static annual plans to dynamic strategic foresight operations.",
//   // },
//   {
//     icon: Scale,
//     title: "Legal Evaluators",
//     desc: "Make high-stakes capital allocation decisions with validated scenario data.",
//   },
//   {
//     icon: Landmark,
//     title: "Government Officials",
//     desc: "Stress test portfolio companies against macro shocks and competitive shifts.",
//   },
//   {
//     icon: User,
//     title: "Directors",
//     desc: "Deliver high-velocity intelligence projects with board-ready AI-powered outputs.",
//   },
//     {
//     icon: UsersRound ,
//     title: "PMO",
//     desc: "Deliver high-velocity intelligence projects with board-ready AI-powered outputs.",
//   },
// ];

// const containerVariants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.08,
//     },
//   },
// };

// const cardVariants = {
//   hidden: { opacity: 0, y: 20 },
//   show: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.5 },
//   },
// };

// // আলাদা কার্ড কম্পোনেন্ট যাতে প্রতিটি কার্ডের মাউস পজিশন সতন্ত্রভাবে ট্র্যাক হয়
// function RoleCard({ role }: { role: (typeof roles)[0] }) {
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);

//   function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
//     const { left, top } = currentTarget.getBoundingClientRect();
//     mouseX.set(clientX - left);
//     mouseY.set(clientY - top);
//   }

//   const Icon = role.icon;

//   return (
//     <motion.div
//       variants={cardVariants}
//       whileHover={{ y: -6 }}
//       onMouseMove={handleMouseMove}
//       transition={{ duration: 0.2 }}
//       className="group relative flex flex-col items-start p-8 rounded-[24px] border border-[#E2E8F0]/80 bg-gradient-to-tr from-white via-white to-[#EBF6FC]/60 shadow-[0_4px_20px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 overflow-hidden"
//     >
//       {/* Dynamic Background Hover Glow Effect */}
//       <motion.div
//         className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 group-hover:opacity-100 transition duration-300"
//         style={{
//           background: useMotionTemplate`
//             radial-gradient(
//               350px circle at ${mouseX}px ${mouseY}px,
//               rgba(14, 165, 233, 0.15),
//               transparent 80%
//             )
//           `,
//         }}
//       />

//       {/* Dynamic Border Glow Effect */}
//       <motion.div
//         className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 group-hover:opacity-100 transition duration-300"
//         style={{
//           background: useMotionTemplate`
//             radial-gradient(
//               120px circle at ${mouseX}px ${mouseY}px,
//               #0ea5e9,
//               transparent 80%
//             )
//           `,
//           maskImage: useMotionTemplate`
//             radial-gradient(
//               120px circle at ${mouseX}px ${mouseY}px,
//               black,
//               transparent 80%
//             )
//           `,
//           WebkitMaskImage: useMotionTemplate`
//             radial-gradient(
//               120px circle at ${mouseX}px ${mouseY}px,
//               black,
//               transparent 80%
//             )
//           `,
//         }}
//       />

//       {/* Content Container (Z-index ensures it stays above the glow) */}
//       <div className="relative z-10 w-full flex flex-col items-center">
//         {/* Icon Container */}
//         <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E2F0FA] mb-6 group-hover:scale-105 transition-transform duration-300">
//           <Icon className="h-6 w-6 text-[#0F172A]" />
//         </div>

//         {/* Title */}
//         <h3 className="text-lg md:text-[20px] font-bold text-[#0F172A] tracking-tight">
//           {role.title}
//         </h3>

//         {/* Description */}
//         {/* <p className="mt-3 text-sm text-[#5B6B82] leading-relaxed font-medium">
//           {role.desc}
//         </p> */}
//       </div>
//     </motion.div>
//   );
// }

// export default function WhoShouldUse() {
//   return (
//     <section className="py-20 md:py-28 bg-white relative overflow-hidden">
//       <div className="container mx-auto px-4 md:px-6 relative z-10">
//         {/* Heading & Subtitle */}
//         <div className="text-center max-w-3xl mx-auto">
//           <h2 className="text-[34px] sm:text-[42px] md:text-[48px] font-extrabold text-[#0F172A] tracking-tight leading-[1.15]">
//             Who should use Second Sight?
//           </h2>
//           <p className="mt-4 text-base md:text-lg text-[#5B6B82] font-medium leading-relaxed">
//             Empowering executives, strategists, and organizations to navigate
//             uncertainty with confidence.
//           </p>
//         </div>

//         {/* Roles Grid */}
//         <motion.div
//           className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true, margin: "-100px" }}
//         >
//           {roles.map((role, index) => (
//             <RoleCard key={index} role={role} />
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   );
// }


"use client";

import {
  User,
  UserCheck,
  Wallet,
  Lightbulb,
  Scale,
  Landmark,
  UsersRound,
} from "lucide-react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";

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
  {
    icon: UsersRound,
    title: "PMO",
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

function RoleCard({ role }: { role: (typeof roles)[0] }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const Icon = role.icon;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6 }}
      onMouseMove={handleMouseMove}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col items-start p-8 rounded-[24px] border border-[#E2E8F0]/80 bg-gradient-to-tr from-white via-white to-[#EBF6FC]/60 shadow-[0_4px_20px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 overflow-hidden"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 group-hover:opacity-100 transition duration-300"
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
        className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 group-hover:opacity-100 transition duration-300"
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

      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E2F0FA] mb-6 group-hover:scale-105 transition-transform duration-300">
          <Icon className="h-6 w-6 text-[#0F172A]" />
        </div>

        <h3 className="text-lg md:text-[20px] font-bold text-[#0F172A] tracking-tight">
          {role.title}
        </h3>
      </div>
    </motion.div>
  );
}

export default function WhoShouldUse() {
  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 ">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/secondSight.mp4" type="video/mp4" />
        </video>
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-[24px] sm:text-[42px] md:text-[48px] font-extrabold text-white tracking-tight leading-[1.15] text-nowrap">
            Who should use Second Sight?
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#ced1d6] font-medium leading-relaxed">
            Empowering executives, strategists, and organizations to navigate
            uncertainty with confidence.
          </p>
        </div>

        <motion.div
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {roles.map((role, index) => (
            <RoleCard key={index} role={role} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}