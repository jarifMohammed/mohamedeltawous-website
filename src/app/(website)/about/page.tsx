import SectionReveal from "@/components/shared/SectionReveal";
import About from "@/features/about/component/About";
import React from "react";

export default function page() {
  return (
    <SectionReveal delay={0.08}>
      <About />
    </SectionReveal>
  );
}
