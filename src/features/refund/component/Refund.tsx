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

export default function Refund() {
  const sections = [
    { id: "overview", label: "01. Overview" },
    { id: "no-refund", label: "02. No-Refund Policy" },
    { id: "unused-services", label: "03. Unused Services" },
    { id: "statutory-exceptions", label: "04. Statutory Exceptions" },
    { id: "enterprise", label: "05. Enterprise Agreements" },
    { id: "changes", label: "06. Policy Changes" },
    { id: "contact", label: "07. Contact Us" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-secondary pb-8">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <ParticlesBackground id="refund-particles" />
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
            Refund Policy
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-semibold">
            Second Sight is a digitally delivered platform. All payments are non-refundable except as required by law.
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

          {/* Right Column - Refund Content */}
          <motion.div
            className="space-y-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Core Commitments Section */}
            <motion.section className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-10 shadow-sm shadow-slate-100/50" variants={itemVariants}>
              <div className="flex gap-4">
                <Shield size={24} className="text-slate-900 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-[#0F172A] tracking-tight mb-2">
                    General Terms
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-semibold">
                    All payments made to Second Sight are non-refundable. We do not provide refunds or credits for unused services, except where expressly required by applicable law.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* SECTION 01 — Overview */}
            <motion.section id="overview" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <FileText size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 01 — Overview
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                This Refund Policy governs all purchases and payments made in connection with the Second Sight platform (“Platform”), operated by Second Sight FZE (“Second Sight,” “we,” “us,” or “our”), a company licensed under the Ajman Free Zone Authority (“AFZA”) with an e-commerce trade licence, United Arab Emirates.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                As an entity licensed for e-commerce activity, Second Sight conducts all sales, billing, and service delivery exclusively through its online platform. No goods or services are sold through any offline or in-person channel.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                By completing a purchase to any Second Sight plan, you acknowledge that you have read, understood, and agreed to the terms of this Refund Policy in full. This policy forms part of our Terms and Conditions and should be read alongside them.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Because the Platform is delivered entirely online and access is granted immediately upon payment confirmation, standard consumer return or cooling-off rights applicable to physical goods do not apply in the same manner. Where statutory rights do apply, they are preserved as described in Section 4.
              </p>
            </motion.section>

            {/* SECTION 02 — No-Refund Policy */}
            <motion.section id="no-refund" className="scroll-mt-28 space-y-5" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <Scale size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 02 — No-Refund Policy
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                All fees paid to Second Sight are non-refundable.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                The non-refundable nature of our fees reflects the immediate, complete, and ongoing delivery of our digital service. Upon payment, you gain full access to the Platform without delay. This immediate delivery is the basis on which refunds cannot be issued.
              </p>

              <div className="overflow-hidden border border-slate-100 rounded-2xl bg-white shadow-sm shadow-slate-100/50 mt-6">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr>
                      <th className="bg-slate-50 text-slate-800 font-bold p-4 border-b border-slate-100">Scenario</th>
                      <th className="bg-slate-50 text-slate-800 font-bold p-4 border-b border-slate-100">Refund Available?</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-4 border-b border-slate-50 text-slate-800 font-medium">Unused features or modules within a purchase</td>
                      <td className="p-4 border-b border-slate-50">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                          No
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-slate-50 text-slate-800 font-medium">Change of mind after purchase</td>
                      <td className="p-4 border-b border-slate-50">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                          No
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-slate-50 text-slate-800 font-medium">Duplicate payment due to user error</td>
                      <td className="p-4 border-b border-slate-50">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-wider">
                          Reviewed case by case
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-slate-50 text-slate-800 font-medium">Billing error caused by Second Sight</td>
                      <td className="p-4 border-b border-slate-50">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                          Yes, corrected promptly
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 text-slate-800 font-medium">Statutory entitlement under applicable law</td>
                      <td>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                          Yes, as required by law
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.section>

            {/* SECTION 03 — Partial Periods and Unused Services */}
            <motion.section id="unused-services" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <CheckCircle size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 03 — Partial Periods and Unused Services
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Second Sight does not provide refunds, credits, or pro-rated adjustments for:
              </p>
              <ul className="space-y-2.5 pl-1">
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Any portion of a subscription period that remains unused at the time of cancellation.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Features, modules, or capabilities included in your plan that you chose not to use.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Time during which you did not log in to or actively use the Platform.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Scenarios, workshops, or exercises you did not complete during the subscription period.
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  Seats or user licenses within a team or enterprise plan that were not assigned or activated.
                </li>
              </ul>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                This policy applies regardless of the reason for non-use, including but not limited to changes in business priorities, staff turnover, organizational restructuring, or a decision not to proceed with scenario planning activities during the subscription period.
              </p>

              <div className="flex gap-4 bg-white border border-slate-100 border-l-4 border-slate-900 rounded-2xl p-6 shadow-sm shadow-slate-100/50 mt-6">
                <Shield size={22} className="text-slate-900 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Verify Before You Buy</h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    We strongly encourage prospective customers to watch the &ldquo;How it works&rdquo; and &ldquo;Demo slides&rdquo; sections at the top of the homepage before purchasing a plan, to ensure the Platform meets your needs before any payment commitment is made.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* SECTION 04 — Statutory Exceptions */}
            <motion.section id="statutory-exceptions" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <Scale size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 04 — Statutory Exceptions
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Nothing in this Refund Policy is intended to exclude, restrict, or modify any consumer rights or statutory entitlements that cannot lawfully be excluded under applicable law, including UAE Federal Law and the laws of any jurisdiction in which you are located.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Where you have a statutory right to a refund, for example, where the Platform materially fails to conform to its described specification and such failure cannot be remedied within a reasonable time, we will honour that right in accordance with the applicable legal requirement.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                If you believe you are entitled to a refund on statutory grounds, please contact <a href="mailto:support@secondsight.tech" className="text-[#0F172A] font-bold underline">support@secondsight.tech</a> with a detailed description of the issue. We will assess your request in good faith and respond immediately.
              </p>

              <div className="flex gap-4 bg-gradient-to-br from-white to-rose-50/10 border border-rose-100 border-l-4 border-rose-500 rounded-2xl p-6 shadow-sm shadow-slate-100/50 mt-4">
                <HelpCircle size={22} className="text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-950 mb-1">Analytical Output Disclaimer</h4>
                  <p className="text-xs sm:text-sm text-rose-900/80 leading-relaxed">
                    Statutory refund rights, where they apply, do not extend to dissatisfaction with AI-generated Scenario Outputs, disagreement with strategic conclusions produced by the Platform, or outcomes of business decisions made using Second Sight&apos;s tools. The Platform is an analytical aid; the quality of outputs depends substantially on the quality of information you provide as inputs.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* SECTION 05 — Enterprise Agreements */}
            <motion.section id="enterprise" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <Scale size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 05 — Enterprise Agreements
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Enterprise customers who have entered into a separate written Enterprise Agreement with Second Sight may be subject to different billing terms as specified in that agreement.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                In the event of any conflict between this Refund Policy and the terms of a signed Enterprise Agreement, the Enterprise Agreement shall prevail with respect to the matters it specifically addresses.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Enterprise customers seeking to discuss refund or credit arrangements outside of the standard policy should contact their Second Sight support team. Any agreed exceptions must be confirmed in writing to be valid.
              </p>
            </motion.section>

            {/* SECTION 06 — Policy Changes */}
            <motion.section id="changes" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <FileText size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 06 — Policy Changes
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Second Sight reserves the right to update or modify this Refund Policy at any time. When material changes are made, we will notify active users by email and by posting a notice on the Platform no less than 14 days before the changes take effect.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Changes to this policy will not apply retroactively to subscriptions already paid for at the time the change takes effect.
              </p>
            </motion.section>

            {/* SECTION 07 — Contact Us */}
            <motion.section id="contact" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <HelpCircle size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 07 — Contact Us
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                If you have any questions about this Refund Policy, wish to report a billing error, or believe you have a statutory entitlement to a refund, please contact our billing team:
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
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs text-slate-500">
                  <p><strong>Response time:</strong> within 3 business days.</p>
                  <p><strong>Billing error resolution:</strong> within 10 business days.</p>
                </div>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </div>

      {/* Footer Page Bar */}
      {/* <div className="border-t border-slate-100 bg-white py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>&copy; 2025 Second Sight FZE &middot; Refund Policy</span>
          <span>Page 1 of 1</span>
        </div>
      </div> */}
    </div>
  );
}
