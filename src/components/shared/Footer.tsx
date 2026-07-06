"use client";

import Image from "next/image";
import Link from "next/link";
import { LinkedinIcon, Twitter, Instagram } from "lucide-react";
// import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-secondary pt-16 pb-8">
      <div className="container mx-auto px-6">
        {/* Top */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Left */}
          <div className="lg:col-span-2">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Second Sight"
                width={120}
                height={60}
                className="cursor-pointer"
              />
            </Link>

            <p className="mt-5 max-w-md text-sm text-[#5f6b7a] leading-relaxed">
              The intelligence layer for the modern boardroom. Transform
              uncertainty into competitive advantage.
            </p>

            <p className="mt-6 text-sm font-medium text-[#1f2937]">Follow us</p>

            <div className="mt-3 flex items-center gap-3">
              <a href="#" className="p-2 bg-[#0B1533] rounded hover:opacity-80">
                <LinkedinIcon size={14} className="text-white" />
              </a>
              {/* <a href="#" className="p-2 bg-[#0B1533] rounded hover:opacity-80">
                <FaXTwitter size={14} className="text-white" />
              </a> */}
              <a href="#" className="p-2 bg-[#0B1533] rounded hover:opacity-80">
                <Instagram size={14} className="text-white" />
              </a>
            </div>
          </div>

          {/* Product */}
          {/* <div>
            <h3 className="font-semibold text-[#1f2937]">Product</h3>
            <ul className="mt-4 space-y-2 text-sm text-[#5f6b7a]">
              <li>
                <Link href="/scenario-builder">Scenario Builder</Link>
              </li>
              <li>
                <Link href="/stress-tester">Stress Tester</Link>
              </li>
              <li>
                <Link href="/risk-engine">Risk Engine</Link>
              </li>
              <li>
                <Link href="/reporting">Reporting</Link>
              </li>
            </ul>
          </div> */}

          {/* Platform */}
          {/* <div>
            <h3 className="font-semibold text-[#1f2937]">Platform</h3>
            <ul className="mt-4 space-y-2 text-sm text-[#5f6b7a]">
              <li>
                <Link href="/security">Enterprise Security</Link>
              </li>
              <li>
                <Link href="/api">API Access</Link>
              </li>
              <li>
                <Link href="/integrations">Integrations</Link>
              </li>
              <li>
                <Link href="/docs">Documentation</Link>
              </li>
            </ul>
          </div> */}

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-[#1f2937]">Resources</h3>
            <ul className="mt-4 space-y-2 text-sm text-[#5f6b7a]">
              <li>
                <Link href="/blog">Strategy Blog</Link>
              </li>
              <li>
                <Link href="/case-studies">Case Studies</Link>
              </li>
              <li>
                <Link href="/playbooks">Playbooks</Link>
              </li>
              <li>
                <Link href="/webinars">Webinars</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-[#1f2937]">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm text-[#5f6b7a]">
              {/* <li>
                <Link href="/contact">Sales</Link>
              </li> */}
              <li>
                <Link href="/support">Support</Link>
              </li>
              <li>
                <Link href="/partners">Partners</Link>
              </li>
              {/* <li>
                <Link href="/legal">Legal</Link>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            <strong>Privacy Notice:</strong> Second Sight does not store or
            retain any user-provided information. All data is processed in
            real-time and is not saved, shared, or used in any form.
          </p>
        </div>
        {/* Bottom */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#c9d8e3] pt-6">
          <p className="text-sm text-[#5f6b7a]">
            © {new Date().getFullYear()} SECOND SIGHT AI Platform. All rights
            reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-[#5f6b7a]">
            <Link href="/privacy" className="hover:text-[#1f2937]">
              Privacy Policy
            </Link>
            <Link href="/refund" className="hover:text-[#1f2937]">
              Refund Policy
            </Link>
            <Link href="/terms" className="hover:text-[#1f2937]">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
