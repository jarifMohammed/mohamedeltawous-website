"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Send, Clock } from "lucide-react";

export default function SupportSection() {
  return (
    <section className=" py-24 px-6" id="support">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Support Info */}
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-primary leading-[1.1] mb-6">
              <span className="bg-gradient-to-r from-[#0F172A] to-[#1f6286] bg-clip-text text-transparent">
                Expert Support
              </span>{" "}
              Team is{" "}
              <span className="bg-gradient-to-r from-[#0F172A] to-[#1f6286] bg-clip-text text-transparent">
                {" "}
                ready.
              </span>
            </h2>

            <p className="text-[#475569] text-lg mb-10 max-w-md">
              Whether you have a technical question or just want to say hi, our
              team is always online to assist you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                  <Mail className="w-6 h-6 text-[#1f6286]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email us</h4>
                  {/* <p className="text-gray-500">mohammad.eltawous@secondsight.tech</p> */}
                  <p className="text-gray-500">support@secondsight.tech</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                  <MessageCircle className="w-6 h-6 text-[#1f6286]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">
                    Support response within 24 hours
                  </h4>

                  <p className="text-gray-500">
                    Smart support with fast responses and seamless assistance
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Email Setup Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className=" p-8 md:p-10 rounded-[16px] border border-slate-100 shadow-lg"
          >
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col space-y-4">
                  <label className="text-sm font-semibold text-slate-700 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Mehedi Hasan"
                    className="w-full px-5 py-4 rounded-[16px] border border-black/10 bg-white  focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col space-y-4">
                  <label className="text-sm font-semibold text-slate-700 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    className="w-full px-5 py-4 rounded-[16px] border border-black/10 bg-white  focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  className="w-full px-5 py-4 rounded-[16px] border border-black/10 bg-white  focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>

              <div className="flex flex-col space-y-4">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us more about your project..."
                  className="w-full px-5 py-4 rounded-[16px] border border-black/10 bg-white  focus:ring-1 focus:ring-black outline-none transition-all  resize-none"
                />
              </div>

              <button className="w-full group bg-[#0F172A] hover:bg-[#0F172A]/80 text-white font-bold py-4 rounded-[16px] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-slate-300">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
