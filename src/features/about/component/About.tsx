"use client";

import { motion, Variants } from "framer-motion";
import { XCircle, ArrowRight, Quote } from "lucide-react";
import styles from "./About.module.css";
import Link from "next/link";
import ParticlesBackground from "@/components/shared/ParticlesBackground";
import Image from "next/image";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function About() {
  return (
    <div className={styles.container}>
      {/* Hero Section with Particles Background */}
      <div className={styles.backgroundWrap}>
        <div className="absolute inset-0 z-0">
          <ParticlesBackground />
        </div>

        <motion.header
          className={styles.hero}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className={styles.label}>Strategic Foresight</span>
          <h1 className={styles.title}>
            The Intelligence Layer for High-Stakes Planning
          </h1>
          <p className={styles.subtitle}>
            Empowering boardroom leaders and strategy teams to navigate modern
            complexity with unmatched clarity and conviction.
          </p>
        </motion.header>
      </div>


      <div className={styles.mainContent}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Our Mission Section */}
          <motion.section className={styles.section} variants={itemVariants}>
            <aside className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Our Mission</h2>
              <div className="h-1 w-16 bg-[#0F172A]/10 rounded-full" />
            </aside>

            <div className={styles.contentBlock}>
              <motion.p
                className={styles.highlightedParagraph}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Second Sight exists to give every strategic leader the
                intelligence needed to make decisions with conviction.
              </motion.p>

              <p className={styles.paragraph}>
                Businesses suffer from a shortage of clarity. Every boardroom, every strategy team, every leadership table is drowning in signals, like market reports, competitor moves, regulatory shifts, macro tremors, with no reliable framework for translating that noise into decisive action.
              </p>

              <p className={styles.paragraph}>
                We built Second Sight to change that.
              </p>

              <p className={styles.paragraph}>
                By combining the analytical power of LLMs with a rigorous, battle-tested scenario planning methodology, Second Sight transforms uncertainty from a liability into a strategic asset. In minutes your team can explore multiple futures, stress-test your current strategy against thousands of edge cases and produce board-ready intelligence that drives high-conviction decision making.
              </p>

              <p className={styles.paragraph}>
                This is not your normal forecasting or prediction. This is scenario intelligence, a discipline that separates the organizations that merely react to the future from the ones that shape it.
              </p>

            </div>
          </motion.section>

          {/* The Founder Section */}
          <motion.section className={styles.section} variants={itemVariants}>
            <aside className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>The Founder</h2>
              <div className="h-1 w-16 bg-[#0F172A]/10 rounded-full mb-6" />
              
              {/* Founder Avatar Card for Desktop/Large Screens */}
              <div className="mt-8 hidden lg:block">
                <div className={styles.founderCard}>
                  <div className={styles.founderImageWrapper}>
                    <Image
                      src="/images/MohamedEltawous.jpg"
                      alt="Mohamed Eltawous"
                      fill
                      sizes="140px"
                      priority
                      className={styles.founderImage}
                    />
                  </div>
                  <div>
                    <h3 className={styles.founderName}>Mohamed Eltawous</h3>
                    <p className={styles.founderTitle}>Founder & CEO</p>
                    <span className={styles.founderCompany}>Second Sight</span>
                  </div>
                </div>
              </div>
            </aside>

            <div className={styles.contentBlock}>
              {/* Founder Avatar for Mobile Screens */}
              <div className={styles.founderMobileHeader}>
                <div className={styles.founderMobileImageWrapper}>
                  <Image
                    src="/images/MohamedEltawous.jpg"
                    alt="Mohamed Eltawous"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">Mohamed Eltawous</h3>
                  <p className="text-xs text-slate-500 font-medium">Founder & CEO, Second Sight</p>
                </div>
              </div>

              <p className={styles.paragraph}>
                Mohamed Eltawous spent around 10 years at the intersection of strategy, operations, and project delivery in some of the GCC&apos;s most dynamic financial services organizations. He was part of programs that most strategy teams only read about in case studies, like a post-acquisition integration spanning ten workstreams and five departments, a digital wallet rollout, and partner onboarding programs generating over $200 million in new revenue.
              </p>

              <p className={styles.paragraph}>
                Across every one of those initiatives, he worked closely with leadership teams making decisions under genuine uncertainty, including regulatory direction, digital adoption curves, competitor moves, and the pace of organizational change. He observed, repeatedly, that the tools available to those leadership teams were not adequate for the complexity of the decisions they were making. The spreadsheets, slide decks, consultant reports that arrived after the decision window had closed and strategy frameworks that produced a single forecast and called it a plan.
              </p>

              <p className={styles.paragraph}>
                There was no platform that helped leadership teams think rigorously about multiple futures simultaneously and connect that thinking directly to the decisions on the table.
              </p>

              <p className="text-xl font-bold text-[#0F172A] mt-6 mb-8 border-l-2 border-[#0F172A]/20 pl-4">
                That gap is what Second Sight is built to close.
              </p>

              {/* Elegant Blockquote for the Quote */}
              <div className={styles.quoteBlock}>
                {/* Decorative Quote Icon */}
                <div className={styles.quoteIconBg}>
                  <Quote size={100} strokeWidth={1} />
                </div>
                
                <blockquote className={styles.quoteText}>
                  &ldquo;Every big strategic decision I have seen made was made under uncertainty. It was never whether the future was uncertain, it was whether the leadership team had thought carefully about what that uncertainty meant for their choices. Second Sight exists to make that thinking structured, accessible, and actionable.&rdquo;
                </blockquote>
                
                <div className={styles.quoteAuthor}>
                  <div className={styles.quoteAuthorLine} />
                  <span className={styles.quoteAuthorName}>Mohamed Eltawous, Founder & CEO</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* The Problem We Solve Section */}
          <motion.section className={styles.section} variants={itemVariants}>
            <aside className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>The Problem We Solve</h2>
              <div className="h-1 w-16 bg-[#0F172A]/10 rounded-full" />
            </aside>

            <div className={styles.contentBlock}>
              <p className={styles.paragraph}>
                Traditional strategic planning was built for a world that no
                longer exists:
              </p>

              <ul className={styles.problemList}>
                {[
                  "Annual planning cycles",
                  "Static SWOT analyses",
                  "Linear forecasting",
                  "Rigid budgeting",
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    className={styles.problemItem}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)",
                      borderColor: "#0F172A",
                    }}
                  >
                    <XCircle className={styles.checkIcon} size={22} />
                    {item}
                  </motion.li>
                ))}
              </ul>

              <p className={styles.paragraph}>
                In an era of accelerating technological disruption, geopolitical
                volatility, regulatory complexity, and compressed decision
                timelines, these tools actively mislead.
              </p>

              <p className={styles.paragraph}>
                The organizations that suffered most during recent market shocks
                were the ones with brittle strategies; plans built on a single
                assumed future that never arrived.
              </p>

              <p className={styles.paragraph}>
                The organizations that thrived were the ones that had already
                mapped multiple futures. That had already asked:{" "}
                <span className={styles.italic}>
                  What if? What then? How do we respond?
                </span>
              </p>

              <div className={styles.ctaCard}>
                <p className={styles.ctaTitle}>Democratizing Excellence</p>
                <p className={styles.paragraph}>
                  Scenario intelligence has historically been the exclusive
                  domain of large enterprises with access to elite multi-month
                  consulting engagements.
                </p>
                <p className={styles.paragraph}>
                  Second Sight democratizes it. We put that same rigour, that
                  same analytical depth, into the hands of every strategic
                  leader, instantly, affordably, and when it is needed most.
                </p>
                <Link href="/how-it-works" className={styles.ctaLink}>
                  Explore our methodology <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
