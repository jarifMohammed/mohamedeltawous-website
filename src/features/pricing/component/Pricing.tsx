"use client";

import { MouseEvent } from "react";
import { Check } from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

const plans = [
  {
    name: "Starter",
    price: "AED 499",
    features: [
      "3 different strategic questions to analyze",
      "12 scenarios generated (4 per 1 strategic question)",
      "Invite team members to brainstorm moving factors",
      "Financial impact on each scenario with % probability of happening",
      "PDF summary report generated per each strategic question analyzed",
      "24 hours support",
    ],
    buttonText: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "AED 999",
    features: [
      "8 different strategic questions to analyze",
      "32 scenarios generated (4 per 1 strategic question)",
      "Invite team members to brainstorm moving factors",
      "Financial impact on each scenario with % probability of happening",
      "PDF summary report generated per each strategic question analyzed",
      "24 hours support",
    ],
    buttonText: "Get Started",
    popular: true,
  },
  {
    name: "Strategic",
    price: "AED 1,499",
    features: [
      "15 different strategic questions to analyze",
      "60 scenarios generated (4 per 1 strategic question)",
      "Invite team members to brainstorm moving factors",
      "Financial impact on each scenario with % probability of happening",
      "PDF summary report generated per each strategic question analyzed",
      "24 hours support",
    ],
    buttonText: "Get Started",
    popular: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Custom plan based on your need",
      "Negotiated rate",
      "All features included",
      "Live demo",
      "24 hours support",
    ],
    buttonText: "Contact Us",
    popular: false,
  },
];

function PricingCard({
  plan,
  index,
  onSubscribe,
  isPending,
}: {
  plan: (typeof plans)[0];
  index: number;
  onSubscribe: (tier: string) => void;
  isPending: boolean;
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col p-8 rounded-3xl bg-white dark:bg-neutral-900 border transition-all duration-300 hover:shadow-xl ${plan.popular
        ? "border-blue-500 shadow-blue-500/10 shadow-xl lg:-translate-y-4"
        : "border-neutral-200 dark:border-neutral-800"
        }`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300"
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
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300"
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

      {plan.popular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center z-20">
          <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            Most Popular
          </span>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-8 mt-2">
          <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{plan.price}</span>
          </div>
        </div>

        <div className="flex-1">
          <ul className="space-y-4 mb-8">
            {plan.features.map((feature, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-300"
              >
                <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                  <Check
                    className="w-3.5 h-3.5 text-blue-500"
                    strokeWidth={3}
                  />
                </div>

                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          disabled={isPending}
          onClick={() =>
            onSubscribe(plan.name.toLowerCase())
          }
          className={`w-full py-3.5 px-4 rounded-xl font-medium transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${plan.popular
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
            : "bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white"
            }`}
        >
          {isPending ? "Redirecting..." : plan.buttonText}
        </button>
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const session = useSession()
  const token = session.data?.accessToken
  console.log(session)
  const { mutate: initializePayment, isPending } = useMutation({
    mutationFn: async (tier: string) => {
      const response = await axios.post(
        `${baseURL}/subscription/initialize-payment`,
        {
          tier,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },

    onSuccess: (data) => {
      const checkoutUrl =
        data?.checkoutUrl ||
        data?.checkouturl ||
        data?.data?.checkoutUrl ||
        data?.data?.checkouturl;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    },

    onError: (error) => {
      console.error("Payment initialization failed:", error);
    },
  });

  return (
    <section className="py-40 relative  dark:bg-neutral-950 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Simple, transparent pricing
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-neutral-600 dark:text-neutral-400"
          >
            Choose the perfect plan for your strategic needs.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              index={index}
              isPending={isPending}
              onSubscribe={(tier) => initializePayment(tier)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}