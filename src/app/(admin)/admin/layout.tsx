"use client";

import { Suspense, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/shared/AdminNavbar";
import AdminSidebar from "@/components/shared/AdminSidebar";
import { Shield, Loader2 } from "lucide-react";

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userRole = (session?.user as { role?: string })?.role;

  useEffect(() => {
    if (status === "loading") return;

    // If not logged in, redirect to login
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    // If logged in but not admin, redirect to user dashboard
    if (status === "authenticated" && userRole !== "admin") {
      router.replace("/dashboard/dashboard-overview");
    }
  }, [status, userRole, router]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#EEF7FC]">
        <Loader2 size={40} className="animate-spin text-[#0f172a] mb-4" />
        <p className="text-slate-500 text-sm font-medium">Loading admin panel...</p>
      </div>
    );
  }

  // Access denied state
  if (status === "unauthenticated" || userRole !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#EEF7FC] gap-4">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
          <Shield size={32} className="text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-slate-800">Access Denied</h1>
        <p className="text-slate-500 text-sm">You do not have permission to access this area.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#EEF7FC] dark:bg-background">
      <Suspense fallback={<div className="h-[90px] bg-white border-b" />}>
        <AdminNavbar
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />
      </Suspense>

      <div className="flex flex-1 h-[calc(100vh-90px)] overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-[280px] shrink-0 h-full">
          <Suspense fallback={<div className="bg-[#0B1525] w-full h-full" />}>
            <AdminSidebar />
          </Suspense>
        </div>

        {/* Mobile Sidebar overlay */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/50 top-[90px]"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          >
            <div
              className="w-[280px] h-full cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <AdminSidebar onNavClick={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content area */}
        <main className="flex-1 w-full overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
