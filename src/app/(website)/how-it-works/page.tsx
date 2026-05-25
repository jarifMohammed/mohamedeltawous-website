"use client";

import SectionReveal from "@/components/shared/SectionReveal";
import HowItWorksPage from "@/features/HowItWorksPage/component/HowItWorksPage";

export default function page() {
  return (
    <SectionReveal delay={0.08}>
      <HowItWorksPage />
    </SectionReveal>
  );
}
