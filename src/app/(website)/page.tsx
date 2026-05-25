import SectionReveal from "@/components/shared/SectionReveal";
import Banner from "@/features/Home/component/Banner";
import MeetSecondSight from "@/features/Home/component/MeetSecondSight";
import StartExploring from "@/features/Home/component/StartExploring";
import Strategic from "@/features/Home/component/Strategic";
import SupportSection from "@/features/Home/component/SupportSection";
import WhoShouldUse from "@/features/Home/component/WhoShouldUse";
import BestBrands from "@/features/Home/component/BestBrands";

export default function page() {
  return (
    <div>
      <SectionReveal delay={0.02}>
        <Banner />
      </SectionReveal>

      <SectionReveal delay={0.06}>
        <Strategic />
      </SectionReveal>

      <SectionReveal delay={0.1}>
        <MeetSecondSight />
      </SectionReveal>

      <SectionReveal delay={0.14}>
        <WhoShouldUse />
      </SectionReveal>

      <SectionReveal delay={0.18}>
        <BestBrands />
      </SectionReveal>

      <SectionReveal delay={0.22}>
        <StartExploring />
      </SectionReveal>

      <SectionReveal delay={0.26}>
        <SupportSection />
      </SectionReveal>
    </div>
  );
}
