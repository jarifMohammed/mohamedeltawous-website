"use client";

import { motion, Variants } from "framer-motion";
import ParticlesBackground from "@/components/shared/ParticlesBackground";
import { Shield, FileText, CheckCircle, Scale, HelpCircle } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

export default function Terms() {
  const sections = [
    { id: "acceptance", label: "01. Acceptance of Terms" },
    { id: "definitions", label: "02. Definitions" },
    { id: "services", label: "03. Description of Services" },
    { id: "security", label: "04. Registration & Security" },
    { id: "license", label: "05. License & Permitted Use" },
    { id: "intellectual-property", label: "06. Intellectual Property" },
    { id: "data-confidentiality", label: "07. Data & Confidentiality" },
    { id: "payment", label: "08. Payment & Billing" },
    { id: "disclaimers", label: "09. Disclaimers" },
    { id: "liability", label: "10. Limitation of Liability" },
    { id: "termination", label: "11. Termination" },
    { id: "governing-law", label: "12. Governing Law & Disputes" },
    { id: "changes", label: "13. Changes to Terms" },
    { id: "contact", label: "14. Contact Information" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-secondary pb-8">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <ParticlesBackground id="terms-particles" />
        </div>

        <motion.header
          className="relative z-10 text-center pt-32 pb-16 px-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-flex items-center text-slate-800 text-[11px] font-bold tracking-widest uppercase mb-4 bg-[#0F172A]/5 px-3.5 py-1.5 rounded-full border border-[#0F172A]/10">
            <span className="w-1.5 h-1.5 bg-[#0F172A] rounded-full mr-2" />
            LEGAL DOCUMENTATION
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] leading-tight tracking-tight mb-5">
            Terms and Conditions
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-semibold">
            Please read these terms carefully before using the Second Sight platform.
          </p>
        </motion.header>
      </div>

      {/* Main Content Layout */}
      <div className="bg-[#fcfbf8] py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-16">
          {/* Left Sidebar - Sticky TOC and Metadata */}
          <aside className="flex flex-col gap-8 lg:sticky lg:top-28 lg:h-fit">
            {/* Metadata Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-slate-100/50">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-3">
                Document Info
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Effective Date</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5">1 June 2025</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Updated</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5">1 June 2025</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Version</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5">1.1</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Licensed Entity</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5">Second Sight FZE</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Licensing Authority</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5">AFZA (Ajman Free Zone)</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jurisdiction</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5">Ajman, UAE</span>
                </div>
              </div>
            </div>

            {/* Sticky Table of Contents */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm shadow-slate-100/50 hidden lg:block">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-3">
                Table of Contents
              </h3>
              <nav className="space-y-2.5">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block text-[13px] font-bold text-slate-500 hover:text-[#0F172A] hover:translate-x-1 transition-all duration-200"
                  >
                    {sec.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Right Column - Terms Content */}
          <motion.div
            className="space-y-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* SECTION 01 — Acceptance of Terms */}
            <motion.section id="acceptance" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <CheckCircle size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 01 — Acceptance of Terms
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                These Terms and Conditions (“Terms”) constitute a legally binding agreement between you (“User,” “you,” or “your”) and Second Sight FZE (“Second Sight,” “we,” “us,” or “our”), a company licensed under the Ajman Free Zone Authority (“AFZA”), United Arab Emirates, holding an e-commerce trade licence.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                By accessing, registering for, or using the Second Sight platform, website, or any associated services (collectively, the “Platform”), you acknowledge that you have read, understood, and agree to be bound by these Terms in their entirety.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                If you are entering into this agreement on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.
              </p>
              <div className="flex gap-4 bg-gradient-to-br from-white to-rose-50/10 border border-rose-100 border-l-4 border-rose-500 rounded-2xl p-6 shadow-sm shadow-slate-100/50 mt-4">
                <Shield size={22} className="text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-950 mb-1">Disagreement & Account Deletion</h4>
                  <p className="text-xs sm:text-sm text-rose-900/80 leading-relaxed">
                    If you do not agree to these Terms, you must immediately discontinue your use of the Platform and delete any associated accounts.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* SECTION 02 — Definitions */}
            <motion.section id="definitions" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <FileText size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 02 — Definitions
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                For the purposes of these Terms, the following definitions apply:
              </p>
              <ul className="space-y-3.5 pl-1">
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  <strong className="text-slate-800 font-bold">“Platform”</strong> means the Second Sight web application, APIs, and all associated tools, features, and services.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  <strong className="text-slate-800 font-bold">“Content”</strong> means all text, data, scenarios, analyses, reports, outputs, and other materials generated through or uploaded to the Platform.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  <strong className="text-slate-800 font-bold">“User Data”</strong> means all information, data, and materials submitted by you to the Platform, including driving forces, organizational information, strategic inputs, and financial data.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  <strong className="text-slate-800 font-bold">“Scenario Output”</strong> means any scenario narrative, axis framework, wind tunnel analysis, signpost framework, or strategic recommendation generated by the Platform.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  <strong className="text-slate-800 font-bold">“Subscription”</strong> means a paid or trial access plan granting use of the Platform for a defined period.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  <strong className="text-slate-800 font-bold">“Enterprise Agreement”</strong> means a separate written agreement between Second Sight and an organizational customer governing specific terms of use.
                </li>
              </ul>
            </motion.section>

            {/* SECTION 03 — Description of Services */}
            <motion.section id="services" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <Scale size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 03 — Description of Services
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Second Sight is operated under an e-commerce trade licence issued by the Ajman Free Zone Authority, and the Platform is offered, sold, and delivered exclusively online through our website and associated digital channels.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Second Sight is a strategic scenario planning platform that enables organizations to construct, analyze, and monitor multiple plausible future scenarios. The Platform provides tools including but not limited to:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pl-1">
                {[
                  "AI-assisted driving forces identification",
                  "Scenario axis construction & narrative generation",
                  "Wind tunnel analysis & strategic option testing",
                  "Quantitative scenario financial modeling",
                  "Signpost monitoring & alert systems",
                  "Collaborative workshop facilitation tools",
                  "Board-ready report & presentation generation",
                ].map((feature, idx) => (
                  <li key={idx} className="relative pl-6 text-xs sm:text-sm text-slate-600 leading-relaxed before:content-['✓'] before:absolute before:left-1 before:text-slate-800 before:font-extrabold">
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex gap-4 bg-white border border-slate-100 border-l-4 border-slate-900 rounded-2xl p-6 shadow-sm shadow-slate-100/50 mt-6">
                <HelpCircle size={22} className="text-[#0F172A] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Decision Support Only</h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    The Platform is intended for professional strategic planning purposes. Scenario Outputs are analytical tools to support decision-making and do not constitute financial, legal, investment, or professional advice of any kind.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* SECTION 04 — Account Registration and Security */}
            <motion.section id="security" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <CheckCircle size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 04 — Account Registration and Security
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                To access the Platform, you must register for an account using accurate, complete, and current information. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-semibold">
                You agree to:
              </p>
              <ul className="space-y-2.5 pl-1">
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Provide truthful and accurate registration information.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Promptly update your information to keep it current and accurate.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Maintain the security of your password and not share credentials with unauthorized parties.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Notify us immediately at <a href="mailto:support@secondsight.tech" className="text-slate-900 underline font-bold">support@secondsight.tech</a> upon discovering any unauthorized use of your account.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Accept responsibility for all activities conducted through your account.
                </li>
              </ul>
            </motion.section>

            {/* SECTION 05 — License and Permitted Use */}
            <motion.section id="license" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <Scale size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 05 — License and Permitted Use
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Subject to your compliance with these Terms and payment of applicable fees, Second Sight grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for your internal business purposes.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-semibold">
                You may not:
              </p>
              <ul className="space-y-2.5 pl-1">
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Sublicense, resell, rent, lease, or otherwise transfer your rights to the Platform to any third party.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Reverse engineer, decompile, disassemble, or attempt to derive the source code of the Platform.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Use the Platform to build a competing product or service.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Use automated systems, bots, or scrapers to extract data from the Platform without express written consent.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Remove or alter any proprietary notices, labels, or marks on the Platform.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Use the Platform for any unlawful purpose or in violation of any applicable laws or regulations.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Upload content that is defamatory, obscene, fraudulent, or that infringes the intellectual property rights of any third party.
                </li>
              </ul>
            </motion.section>

            {/* SECTION 06 — Intellectual Property */}
            <motion.section id="intellectual-property" className="scroll-mt-28 space-y-5" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <Shield size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 06 — Intellectual Property
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                All rights, title, and interest in and to the Platform, including its software, architecture, design, methodology frameworks, driving forces libraries, GCC intelligence databases, feature designs, and all associated intellectual property, are and remain the exclusive property of Second Sight FZE.
              </p>

              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-1">Your Content</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  You retain ownership of all User Data you submit to the Platform. By submitting User Data, you grant Second Sight a limited, non-exclusive license to use, process, and analyze that data solely for the purpose of providing you with the Platform&apos;s services.
                </p>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-1">Scenario Outputs</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Scenario Outputs generated by the Platform using your User Data are owned by you for your internal business use. You may not publish, redistribute, or commercialize Scenario Outputs in a way that competes with Second Sight&apos;s services.
                </p>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-1">Feedback</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Any feedback, suggestions, or ideas you provide regarding the Platform may be used by Second Sight without restriction or compensation to you.
                </p>
              </div>
            </motion.section>

            {/* SECTION 07 — Data and Confidentiality */}
            <motion.section id="data-confidentiality" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <Shield size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 07 — Data and Confidentiality
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Second Sight understands that User Data may contain highly sensitive strategic and financial information. We treat all User Data as strictly confidential and do not share it with third parties except as described in our Privacy Policy.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Second Sight operates on a zero data retention basis with its underlying AI infrastructure providers, meaning your User Data inputs are not used for the training of AI models by any third party.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Enterprise customers may request a Data Processing Agreement (“DPA”) that governs the handling of personal data in compliance with applicable data protection regulations, including UAE Federal Law No. 45 of 2021 on the Protection of Personal Data.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-semibold">
                You are responsible for ensuring that any User Data you submit to the Platform does not violate applicable confidentiality obligations, data protection laws, or the rights of third parties.
              </p>
            </motion.section>

            {/* SECTION 08 — Payment and Billing */}
            <motion.section id="payment" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <Scale size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 08 — Payment and Billing
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                As an entity licensed for e-commerce activity by the Ajman Free Zone Authority, Second Sight processes all payments exclusively through its online platform using licensed third-party payment gateways. Fees are stated depending on the currency paid. Prices are exclusive of applicable taxes, which shall be your responsibility.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-semibold">
                Billing terms:
              </p>
              <ul className="space-y-2.5 pl-1">
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Users are billed in advance as per the package selected at the time of purchase.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Billings are non-refundable except where required by applicable law.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Second Sight reserves the right to modify pricing with 30 days written notice to existing subscribers.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Failure to pay applicable fees may result in suspension or termination of your access to the Platform.
                </li>
              </ul>
            </motion.section>

            {/* SECTION 09 — Disclaimers */}
            <motion.section id="disclaimers" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <HelpCircle size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 09 — Disclaimers
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                The Platform is provided on an “as is” and “as available” basis. Second Sight makes no warranties, express or implied, regarding the Platform, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Scenario outputs generated by the Platform are analytical tools intended to support strategic thinking. They do not constitute and should not be relied upon as financial advice, investment recommendations, legal counsel, or professional consultation of any kind. All strategic decisions remain the sole responsibility of the User.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Second Sight does not warrant that the Platform will be uninterrupted, error-free, or free of viruses or other harmful components. We reserve the right to modify, suspend, or discontinue the Platform or any feature thereof at any time.
              </p>
            </motion.section>

            {/* SECTION 10 — Limitation of Liability */}
            <motion.section id="liability" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <Scale size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 10 — Limitation of Liability
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-semibold text-[#0F172A]">
                To the fullest extent permitted by applicable law, Second Sight shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, loss of data, loss of business, or reputational harm, arising out of or related to your use of the Platform, even if advised of the possibility of such damages.
              </p>
            </motion.section>

            {/* SECTION 11 — Termination */}
            <motion.section id="termination" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <CheckCircle size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 11 — Termination
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Either party may terminate these Terms and your access to the Platform as follows:
              </p>
              <ul className="space-y-2.5 pl-1">
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  You may terminate your account at any time through your account settings or by contacting <a href="mailto:support@secondsight.tech" className="text-slate-900 font-bold underline">support@secondsight.tech</a>.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Second Sight may suspend or terminate your access immediately and without notice if you breach these Terms, engage in fraudulent activity, or if required to do so by law.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Second Sight may terminate the Platform or any component thereof with 30 days written notice to active subscribers.
                </li>
              </ul>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Upon termination, your license to use the Platform ceases immediately. Sections 6 (Intellectual Property), 9 (Disclaimers), 10 (Limitation of Liability), and 12 (Governing Law) survive termination.
              </p>
            </motion.section>

            {/* SECTION 12 — Governing Law and Dispute Resolution */}
            <motion.section id="governing-law" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <Scale size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 12 — Governing Law and Dispute Resolution
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the Emirate of Ajman and the applicable federal laws of the United Arab Emirates, including the regulations of the Ajman Free Zone Authority governing licensed entities, without regard to conflict of law principles.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Any dispute arising out of or in connection with these Terms, including any question regarding their existence, validity, or termination, shall be referred to and finally resolved by arbitration administered in accordance with the rules of the Ajman Chamber of Commerce and Industry Arbitration Centre, or, where the parties so agree in writing, the DIFC-LCIA Arbitration Rules. The seat of arbitration shall be Ajman, UAE, unless otherwise agreed in writing by both parties. The language of the arbitration shall be English.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-semibold">
                This clause shall not prevent either party from seeking urgent injunctive relief from a court of competent jurisdiction in the UAE.
              </p>
            </motion.section>

            {/* SECTION 13 — Changes to Terms */}
            <motion.section id="changes" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <FileText size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 13 — Changes to These Terms
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Second Sight reserves the right to modify these Terms at any time. We will notify registered users of material changes by email and by posting a notice on the Platform no less than 14 days before the changes take effect.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Your continued use of the Platform following the effective date of any revised Terms constitutes your acceptance of those Terms.
              </p>
            </motion.section>

            {/* SECTION 14 — Contact Information */}
            <motion.section id="contact" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <HelpCircle size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 14 — Contact Information
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                If you have any questions, concerns, or requests regarding these Terms, please contact us:
              </p>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 text-sm text-slate-600 leading-relaxed shadow-sm shadow-slate-100/50">
                <p className="font-extrabold text-[#0F172A] mb-1">Second Sight FZE</p>
                <p>Ajman Free Zone, Ajman, United Arab Emirates</p>
                <p className="mt-2 font-bold text-slate-800">
                  Email:{" "}
                  <a href="mailto:support@secondsight.tech" className="text-slate-900 underline hover:opacity-80 transition-opacity">
                    support@secondsight.tech
                  </a>
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Licensed by the Ajman Free Zone Authority (AFZA) — E-Commerce Licence
                </p>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </div>

      {/* Footer Page Bar */}
      {/* <div className="border-t border-slate-100 bg-white py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>&copy; 2025 Second Sight FZE &middot; Terms and Conditions</span>
          <span>Page 1 of 1</span>
        </div>
      </div> */}
    </div>
  );
}
