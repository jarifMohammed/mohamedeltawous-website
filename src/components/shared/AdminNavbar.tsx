"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu, X, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

interface AdminNavbarProps {
  readonly onMenuClick?: () => void;
  readonly isMobileMenuOpen?: boolean;
}

export default function AdminNavbar({
  onMenuClick,
  isMobileMenuOpen,
}: AdminNavbarProps) {
  const { data: session } = useSession();
  const user = session?.user;

  const userInitials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || "??";

  return (
    <header className="flex-shrink-0 relative z-50 w-full bg-white border-b border-[#e2e8f0] h-[90px] flex items-center">
      <div className="flex w-full items-center justify-between pr-6 md:pr-8">
        {/* Logo Container */}
        <div className="w-[280px] h-full flex items-center justify-center shrink-0">
          <Link href="/admin/dashboard-overview" className="flex items-center">
            <Image
              src="/images/logo1.jpeg"
              alt="Second Sight"
              width={110}
              height={75}
              className="h-auto w-[100px] sm:w-[110px] md:w-[130px]"
              priority
            />
          </Link>
        </div>

        {/* Right Side - Admin Badge & Profile */}
        <div className="flex items-center gap-4">
          {/* Admin Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
            <Shield size={14} className="text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">Admin</span>
          </div>

          {/* User Profile Avatar */}
          <Avatar className="h-10 w-10 overflow-hidden border border-slate-200 cursor-pointer">
            {user?.image ? (
              <AvatarImage src={user.image} alt={user.name || "Admin"} />
            ) : (
              <AvatarFallback className="bg-slate-100 text-slate-600 font-medium text-sm">
                {userInitials}
              </AvatarFallback>
            )}
          </Avatar>

          {/* Mobile Menu Button */}
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
