"use client";

import { motion, Variants } from "framer-motion";
import ParticlesBackground from "@/components/shared/ParticlesBackground";
import { Shield, FileText, CheckCircle, Scale, BrainCircuit, HelpCircle } from "lucide-react";

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

export default function Privacy() {
  const sections = [
    { id: "overview", label: "01. Overview" },
    { id: "controller", label: "02. Data Controller" },
    { id: "collection", label: "03. What We Collect" },
    { id: "usage", label: "04. How We Use Data" },
    { id: "legal-basis", label: "05. Legal Basis" },
    { id: "sharing", label: "06. Data Sharing" },
    { id: "ai-processing", label: "07. AI Processing & ZDR" },
    { id: "security", label: "08. Security Measures" },
    { id: "rights", label: "09. Your Rights" },
    { id: "cookies", label: "10. Cookies & Tracking" },
    { id: "transfers", label: "11. Data Transfers" },
    { id: "changes", label: "12. Policy Changes" },
    { id: "contact", label: "13. Contact & Complaints" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-secondary pb-8">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <ParticlesBackground id="privacy-particles" />
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
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-semibold">
            How Second Sight collects, uses, protects, and never misuses your information.
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

          {/* Right Column - Privacy Content */}
          <motion.div
            className="space-y-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Core Commitments Section */}
            <motion.section className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-10 shadow-sm shadow-slate-100/50" variants={itemVariants}>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#0F172A] tracking-tight mb-6">
                Our Core Privacy Commitments
              </h2>
              <div className="overflow-hidden border border-slate-100 rounded-2xl bg-white">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr>
                      <th className="bg-slate-50 text-slate-800 font-bold p-4 border-b border-slate-100">Commitment</th>
                      <th className="bg-slate-50 text-slate-800 font-bold p-4 border-b border-slate-100">What It Means</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-4 border-b border-slate-50 font-bold text-slate-900 whitespace-nowrap">Zero Data Retention</td>
                      <td className="p-4 border-b border-slate-50 text-slate-600 leading-relaxed">Your inputs are never used to train AI models by any third party.</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-slate-50 font-bold text-slate-900 whitespace-nowrap">UAE Data Law Compliant</td>
                      <td className="p-4 border-b border-slate-50 text-slate-600 leading-relaxed">Aligned with Federal Decree-Law No. 45 of 2021 (UAE PDPL).</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-slate-50 font-bold text-slate-900 whitespace-nowrap">No Data Selling</td>
                      <td className="p-4 border-b border-slate-50 text-slate-600 leading-relaxed">Your data is never sold, rented, or traded to any third party.</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-slate-900 whitespace-nowrap">AFZA Licensed</td>
                      <td className="p-4 text-slate-600 leading-relaxed">Operated by an entity licensed for e-commerce by the Ajman Free Zone Authority (AFZA) in the United Arab Emirates.</td>
                    </tr>
                  </tbody>
                </table>
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
                Second Sight FZE (“Second Sight,” “we,” “us,” or “our”) is committed to protecting the privacy and confidentiality of all personal and organizational data entrusted to us by users of the Second Sight platform.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                This Privacy Policy explains how we collect, use, store, share, and protect personal data and organizational data when you use our Platform, visit our website at secondsight.tech, or interact with us in any capacity.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                We operate in compliance with the UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (“UAE PDPL”), the regulations of the Ajman Free Zone Authority governing licensed entities, and where applicable, the European Union&apos;s General Data Protection Regulation (GDPR).
              </p>

              <div className="flex gap-4 bg-white border border-slate-100 border-l-4 border-slate-900 rounded-2xl p-6 shadow-sm shadow-slate-100/50 mt-6">
                <Shield size={22} className="text-slate-900 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">A Custodian of Your Strategy</h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Second Sight processes highly sensitive strategic organizational data. We have designed our data practices around the principle that your strategic information is yours. We are only its temporary custodian for the purpose of delivering our services.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* SECTION 02 — Data Controller */}
            <motion.section id="controller" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <Scale size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 02 — Data Controller
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                The data controller responsible for your personal data is:
              </p>
              <ul className="space-y-2.5 pl-1">
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  <strong>Company:</strong> Second Sight FZE
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  <strong>Jurisdiction:</strong> Ajman Free Zone, Ajman, United Arab Emirates
                </li>
                <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">
                  <strong>Licensing Authority:</strong> Ajman Free Zone Authority (AFZA) — E-Commerce Licence
                </li>
              </ul>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-2">
                For enterprise customers with a Data Processing Agreement in place, Second Sight acts as a data processor with respect to personal data contained within organizational User Data.
              </p>
            </motion.section>

            {/* SECTION 03 — What We Collect */}
            <motion.section id="collection" className="scroll-mt-28 space-y-5" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <CheckCircle size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 03 — What We Collect
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-2">Account and Identity Data</h3>
                  <ul className="space-y-2 pl-1">
                    <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Full name</li>
                    <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Business email address</li>
                    <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Organization name, industry, and country</li>
                    <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Password (stored in encrypted, non-reversible form)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-2">Platform Usage Data (User Data)</h3>
                  <ul className="space-y-2 pl-1">
                    <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Focal issues or strategic questions</li>
                    <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Driving forces, key uncertainties, and scenario narratives you create</li>
                    <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Financial baseline data and modeling inputs you provide</li>
                    <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Signpost monitoring entries and environmental scan data</li>
                    <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Workshop session records, collaboration activity, and participant inputs</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-2">Technical and Analytics Data</h3>
                  <ul className="space-y-2 pl-1">
                    <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">IP address, browser type, device type, and operating system</li>
                    <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Pages visited, features used, and session duration</li>
                    <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Error logs and performance diagnostics</li>
                    <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Cookies and similar tracking technologies (see Section 11)</li>
                  </ul>
                </div>
              </div>

              <div className="overflow-hidden border border-slate-100 rounded-2xl bg-white shadow-sm shadow-slate-100/50 mt-6">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr>
                      <th className="bg-slate-50 text-slate-800 font-bold p-4 border-b border-slate-100">Data Category</th>
                      <th className="bg-slate-50 text-slate-800 font-bold p-4 border-b border-slate-100">Sensitivity</th>
                      <th className="bg-slate-50 text-slate-800 font-bold p-4 border-b border-slate-100">Stored in UAE?</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-4 border-b border-slate-50 font-bold text-slate-800">Account and Identity</td>
                      <td className="p-4 border-b border-slate-50">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                          Standard
                        </span>
                      </td>
                      <td className="p-4 border-b border-slate-50 text-slate-600">Yes, primary storage</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-slate-50 font-bold text-slate-800">Strategic User Data</td>
                      <td className="p-4 border-b border-slate-50">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100/50 uppercase tracking-wider">
                          Highly Sensitive
                        </span>
                      </td>
                      <td className="p-4 border-b border-slate-50 text-slate-600">Yes, UAE/GCC region servers</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-slate-50 font-bold text-slate-800">Financial Modeling Data</td>
                      <td className="p-4 border-b border-slate-50">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100/50 uppercase tracking-wider">
                          Highly Sensitive
                        </span>
                      </td>
                      <td className="p-4 border-b border-slate-50 text-slate-600">Yes, encrypted at rest</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-slate-800">Analytics and Usage</td>
                      <td>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                          Low
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">Yes, anonymized</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.section>

            {/* SECTION 04 — How We Use Your Data */}
            <motion.section id="usage" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <CheckCircle size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 04 — How We Use Your Data
                </h2>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-2">Service Delivery</h3>
                <ul className="space-y-2 pl-1">
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Processing your scenario planning inputs and generating Scenario Outputs</li>
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Enabling collaboration features between team members</li>
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Delivering signpost alerts and environmental monitoring notifications</li>
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Generating and formatting board-ready reports and presentations</li>
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Maintaining your organizational strategic memory and scenario history</li>
                </ul>
              </div>

              <div className="pt-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-2">Platform Improvement</h3>
                <ul className="space-y-2 pl-1">
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Analyzing anonymized, aggregated usage patterns to improve features</li>
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Identifying and resolving technical errors and performance issues</li>
                </ul>
              </div>

              <div className="pt-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-2">Communications</h3>
                <ul className="space-y-2 pl-1">
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Sending transactional emails (account confirmation, password reset, billing)</li>
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Delivering product updates and feature announcements</li>
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Responding to support requests and enquiries</li>
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Sending marketing communications where you have given consent (opt-out available at any time)</li>
                </ul>
              </div>

              <div className="flex gap-4 bg-white border border-slate-100 border-l-4 border-slate-900 rounded-2xl p-6 shadow-sm shadow-slate-100/50 mt-6">
                <Shield size={22} className="text-slate-900 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Strict Usage Limit</h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    We do not use your strategic User Data for any purpose other than delivering the services you have requested. We do not sell this data, share it with advertisers, or use it to benchmark against other organizations without explicit consent.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* SECTION 05 — Legal Basis for Processing */}
            <motion.section id="legal-basis" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <Scale size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 05 — Legal Basis for Processing
                </h2>
              </div>

              <div className="overflow-hidden border border-slate-100 rounded-2xl bg-white shadow-sm shadow-slate-100/50">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr>
                      <th className="bg-slate-50 text-slate-800 font-bold p-4 border-b border-slate-100">Processing Purpose</th>
                      <th className="bg-slate-50 text-slate-800 font-bold p-4 border-b border-slate-100">Legal Basis</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-4 border-b border-slate-55 text-[#0f172a] font-medium">Account creation and service delivery</td>
                      <td className="p-4 border-b border-slate-50 text-slate-600 font-bold">Contract performance</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-slate-55 text-[#0f172a] font-medium">Billing and payment processing</td>
                      <td className="p-4 border-b border-slate-50 text-slate-600 font-bold">Contract performance / Legal obligation</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-slate-55 text-[#0f172a] font-medium">Platform security and fraud prevention</td>
                      <td className="p-4 border-b border-slate-50 text-slate-600 font-bold">Legitimate interests</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-slate-55 text-[#0f172a] font-medium">Product analytics and improvement</td>
                      <td className="p-4 border-b border-slate-50 text-slate-600 font-bold">Legitimate interests (anonymized)</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-slate-55 text-[#0f172a] font-medium">Marketing communications</td>
                      <td className="p-4 border-b border-slate-50 text-slate-600 font-bold">Consent (withdrawable at any time)</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-[#0f172a] font-medium">Legal compliance and regulatory response</td>
                      <td className="p-4 text-slate-600 font-bold">Legal obligation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.section>

            {/* SECTION 06 — Data Sharing */}
            <motion.section id="sharing" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <Scale size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 06 — Data Sharing
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Second Sight does not sell, rent, or trade your personal data or User Data to any third party under any circumstances.
              </p>

              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-1">Service Providers</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  We engage a small number of carefully vetted third-party service providers who process data on our behalf under strict contractual data processing agreements. Each provider is bound by confidentiality obligations and is prohibited from using your data for any purpose other than providing the contracted service.
                </p>
              </div>

              <div className="pt-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-1">AI Infrastructure</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  The Platform uses AI language model infrastructure to generate scenario outputs. Please see Section 7 for our specific commitments regarding AI data processing.
                </p>
              </div>

              <div className="pt-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-1">Legal Requirements</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  We may disclose data where required to do so by applicable law, court order, or governmental authority. Where legally permitted, we will notify you of such a requirement before disclosure.
                </p>
              </div>
            </motion.section>

            {/* SECTION 07 — AI Processing and Zero Data Retention */}
            <motion.section id="ai-processing" className="scroll-mt-28 space-y-5" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <BrainCircuit size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 07 — AI Processing and Zero Data Retention
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Second Sight uses advanced AI language models to power its scenario generation, analysis, and output features. We understand that the strategic data you input to the Platform is among the most sensitive information your organization possesses.
              </p>

              <div className="flex gap-4 bg-gradient-to-br from-white to-sky-50/10 border border-slate-100 border-l-4 border-sky-500 rounded-2xl p-6 shadow-sm shadow-slate-100/50">
                <BrainCircuit size={24} className="text-sky-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Zero Data Retention (ZDR) Basis</h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Second Sight operates exclusively on a Zero Data Retention (ZDR) basis with its AI infrastructure providers. Your inputs are processed in real time to generate outputs and are not stored, logged, or used for AI model training by any third-party infrastructure provider.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-2">What this means in practice:</h3>
                <ul className="space-y-2 pl-1">
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Your strategic inputs are not retained by AI model providers after processing.</li>
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Your data is not used to train, fine-tune, or improve any third-party AI model.</li>
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">No third-party AI provider has persistent access to your organizational data.</li>
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">All AI processing occurs under enterprise API agreements with explicit zero retention commitments.</li>
                </ul>
              </div>
            </motion.section>

            {/* SECTION 08 — Security */}
            <motion.section id="security" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <Shield size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 08 — Security
                </h2>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-2">Technical Measures</h3>
                <ul className="space-y-2 pl-1">
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">AES-256 encryption for all data at rest.</li>
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">TLS 1.3 encryption for all data in transit.</li>
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Multi-factor authentication available for all accounts; mandatory for enterprise accounts.</li>
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Role-based access controls limiting data access to authorized personnel only.</li>
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Regular penetration testing by independent security specialists.</li>
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Data hosted on ISO 27001-certified infrastructure within the UAE/GCC region.</li>
                </ul>
              </div>

              <div className="pt-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-2">Organizational Measures</h3>
                <ul className="space-y-2 pl-1">
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Strict data access controls with explicit audit logging.</li>
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Regular staff security training and data protection awareness programs.</li>
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Background checks for all personnel with access to platform infrastructure.</li>
                  <li className="relative pl-6 text-sm text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-1 before:text-slate-300 before:font-bold before:text-lg">Documented incident response plan with regulatory notification procedures.</li>
                </ul>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                In the event of a data breach that poses a risk to your rights and interests, we will notify affected users and the relevant regulatory authority within 72 hours of becoming aware of the breach, as required by applicable law.
              </p>
            </motion.section>

            {/* SECTION 09 — Your Rights */}
            <motion.section id="rights" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <Scale size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 09 — Your Rights
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Under UAE PDPL and applicable international data protection law, you have the following rights regarding your personal data:
              </p>

              <div className="overflow-hidden border border-slate-100 rounded-2xl bg-white shadow-sm shadow-slate-100/50">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr>
                      <th className="bg-slate-50 text-slate-800 font-bold p-4 border-b border-slate-100">Right</th>
                      <th className="bg-slate-50 text-slate-800 font-bold p-4 border-b border-slate-100">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-4 border-b border-slate-50 font-bold text-slate-800 whitespace-nowrap">Right of Access</td>
                      <td className="p-4 border-b border-slate-50 text-slate-600 leading-relaxed">Request a copy of all personal data we hold about you, including a full export of your User Data.</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-slate-50 font-bold text-slate-800 whitespace-nowrap">Right to Rectification</td>
                      <td className="p-4 border-b border-slate-50 text-slate-600 leading-relaxed">Request correction of any inaccurate or incomplete personal data.</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-slate-50 font-bold text-slate-800 whitespace-nowrap">Right to Erasure</td>
                      <td className="p-4 border-b border-slate-50 text-slate-600 leading-relaxed">Request deletion of your personal data and User Data, subject to legal retention requirements.</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-slate-50 font-bold text-slate-800 whitespace-nowrap">Right to Portability</td>
                      <td className="p-4 border-b border-slate-50 text-slate-600 leading-relaxed">Receive your User Data in a structured, machine-readable format.</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-slate-50 font-bold text-slate-800 whitespace-nowrap">Right to Restrict Processing</td>
                      <td className="p-4 border-b border-slate-50 text-slate-600 leading-relaxed">Request that we limit the processing of your data in certain circumstances.</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-slate-800 whitespace-nowrap">Right to Object</td>
                      <td className="p-4 text-slate-600 leading-relaxed">Object to processing based on legitimate interests, including marketing.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                To exercise any of these rights, submit a request to{" "}
                <a href="mailto:support@secondsight.tech" className="text-slate-900 font-bold underline hover:opacity-80 transition-opacity">
                  support@secondsight.tech
                </a>
                .
              </p>
            </motion.section>

            {/* SECTION 10 — Cookies and Tracking */}
            <motion.section id="cookies" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <CheckCircle size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 10 — Cookies and Tracking
                </h2>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-1">Essential Cookies</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Required for the Platform to operate and cannot be disabled. They enable session management, security features, and authentication.
                </p>
              </div>

              <div className="pt-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-1">Analytics Cookies</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  We use privacy-respecting analytics tools to understand how users navigate the Platform. All analytics data is anonymized and aggregated.
                </p>
              </div>

              <div className="pt-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-1">Marketing Cookies</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  We do not use third-party advertising or retargeting cookies on the Platform. On our public website, limited marketing cookies may be present. These can be declined via our cookie consent banner.
                </p>
              </div>
            </motion.section>

            {/* SECTION 11 — International Data Transfers */}
            <motion.section id="transfers" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <Scale size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 11 — International Data Transfers
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Second Sight&apos;s primary data storage is located within the UAE and GCC region. Where data may be processed outside the UAE, we ensure appropriate safeguards are in place including standard contractual clauses or adequacy decisions under UAE PDPL.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Enterprise customers requiring data residency exclusively within UAE borders may request our Private Deployment option.
              </p>
            </motion.section>

            {/* SECTION 12 — Changes to This Policy */}
            <motion.section id="changes" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <FileText size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 12 — Changes to This Policy
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                We may update this Privacy Policy from time to time. When we make material changes, we will notify you by email and by posting a prominent notice on the Platform at least 14 days before the changes take effect.
              </p>
            </motion.section>

            {/* SECTION 13 — Contact and Complaints */}
            <motion.section id="contact" className="scroll-mt-28 space-y-4" variants={itemVariants}>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/50 text-[#0F172A] border border-slate-100/80">
                  <HelpCircle size={18} />
                </div>
                <h2 className="text-base font-extrabold text-[#0F172A] tracking-wider uppercase">
                  SECTION 13 — Contact and Complaints
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                For privacy questions, concerns, or complaints, please contact our team at:
              </p>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 text-sm text-slate-600 leading-relaxed shadow-sm shadow-slate-100/50">
                <p className="font-extrabold text-[#0F172A] mb-1">Second Sight FZE</p>
                <p>Ajman Free Zone, Ajman, United Arab Emirates</p>
                <p className="mt-3">
                  Email:{" "}
                  <a href="mailto:support@secondsight.tech" className="text-slate-900 font-bold underline hover:opacity-80 transition-opacity">
                    support@secondsight.tech
                  </a>
                </p>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                If you are not satisfied with our response, you have the right to lodge a complaint with the UAE Data Office or the relevant supervisory authority in your jurisdiction.
              </p>
            </motion.section>
          </motion.div>
        </div>
      </div>

      {/* Footer Page Bar */}
      {/* <div className="border-t border-slate-100 bg-white py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>&copy; 2025 Second Sight FZE &middot; Privacy Policy</span>
          <span>Page 7 of 7</span>
        </div>
      </div> */}
    </div>
  );
}
