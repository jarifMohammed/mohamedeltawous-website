import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PageTransition from "@/components/shared/PageTransition";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Second Sight",
  description:
    "The intelligence layer for the modern boardroom. Transforming uncertainty into competitive advantage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen relative bg-white">
      <div className="absolute top-0 left-0 w-full z-50">
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
      </div>

      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
