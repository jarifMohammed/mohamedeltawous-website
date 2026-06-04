"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/auth/login");
      return;
    }
    const role = (session.user as { role?: string }).role;
    if (role !== "admin") {
      router.replace("/admin/dashboard-overview");
    }
  }, [session, status, router]);

  // While checking or if the user is not an admin, don't render children
  if (status === "loading" || !session || (session.user as { role?: string }).role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
