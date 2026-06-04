"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutGrid,
  Users,
  FileBarChart,
  Settings,
  ChevronDown,
  LogOut,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const adminNavItems = [
  {
    name: "Dashboard Overview",
    href: "/admin/dashboard-overview",
    icon: LayoutGrid,
  },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Scenarios", href: "/admin/scenarios", icon: FileBarChart },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  readonly onNavClick?: () => void;
}

type SubItem = { name: string; href: string };
type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  subItems?: SubItem[];
};

function SidebarItem({
  item,
  pathname,
  onNavClick,
}: {
  item: NavItem;
  pathname: string;
  onNavClick?: () => void;
}) {
  const isActive =
    item.href === "/admin"
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const Icon = item.icon;
  const hasSubItems = item.subItems && item.subItems.length > 0;

  const [isOpen, setIsOpen] = useState(() => {
    if (!hasSubItems) return false;
    return (
      item.subItems!.some(
        (sub: SubItem) =>
          pathname === sub.href || pathname.startsWith(`${sub.href}/`),
      ) || isActive
    );
  });

  if (hasSubItems) {
    return (
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex w-full items-center justify-between px-4 py-3 min-h-[48px] rounded-lg transition-all duration-200 ${
            isActive || isOpen
              ? "bg-[#1e293b] text-white font-semibold shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-[#1e293b]/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon
              size={20}
              strokeWidth={isActive || isOpen ? 2 : 1.5}
              className={isActive || isOpen ? "text-white" : "text-slate-400"}
            />
            <span className="text-[15px]">{item.name}</span>
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Sub Items */}
        {isOpen && (
          <div className="flex flex-col gap-1 pt-1 pb-2">
            {item.subItems!.map((sub: SubItem) => {
              const isSubActive =
                pathname === sub.href || pathname.startsWith(`${sub.href}/`);
              return (
                <Link
                  key={sub.href}
                  href={sub.href}
                  onClick={onNavClick}
                  className={`flex items-center pl-12 pr-4 py-2.5 text-sm transition-colors rounded-lg ${
                    isSubActive
                      ? "text-white font-medium bg-[#1e293b]/50"
                      : "text-slate-400 hover:text-white hover:bg-[#1e293b]/30"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-3 shrink-0 ${isSubActive ? "bg-white" : "bg-transparent"}`}
                  />
                  {sub.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavClick}
      className={`flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-[#1e293b] text-white font-semibold shadow-sm"
          : "text-slate-400 hover:text-white hover:bg-[#1e293b]/50"
      }`}
    >
      <Icon
        size={20}
        strokeWidth={isActive ? 2 : 1.5}
        className={isActive ? "text-white" : "text-slate-400"}
      />
      <span className="text-[15px]">{item.name}</span>
    </Link>
  );
}

export default function AdminSidebar({ onNavClick }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const userRole = (user as { role?: string })?.role || "Admin";
  const userName = user?.name || "Admin User";

  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    setIsLogoutOpen(false);
    if (onNavClick) onNavClick();
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <aside className="w-full h-full flex flex-col bg-[#0f172a] text-white shadow-[1px_0_10px_rgba(0,0,0,0.1)] relative z-10">
        {/* Admin Badge */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <Shield size={18} className="text-amber-400" />
            <span className="text-sm font-semibold text-amber-300">Admin Panel</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {adminNavItems.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              pathname={pathname}
              onNavClick={onNavClick}
            />
          ))}
        </nav>

        {/* Bottom Profile and Logout Area */}
        <div className="p-6 pb-8 border-t border-white/10 flex flex-col gap-4 bg-[#0f172a]">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-white/20">
              {user?.image ? (
                <AvatarImage src={user.image} alt={userName} />
              ) : (
                <AvatarFallback className="bg-slate-700 text-white text-sm font-medium">
                  {userInitials}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <span className="text-white text-sm font-medium leading-none mb-1">
                {userName}
              </span>
              <span className="text-amber-400 text-xs font-medium">{userRole}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsLogoutOpen(true)}
            className="flex flex-row items-center justify-center gap-2 w-full px-4 py-2 mt-2 rounded-lg border border-slate-700 text-red-500 hover:bg-white/5 transition-colors font-medium text-sm cursor-pointer"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>

      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent className="max-w-[400px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 rounded-xl shadow-xl">
          <DialogHeader className="space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
              <LogOut className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold text-slate-900 dark:text-white">
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to log out of the admin panel? You will need
              to log back in to access this area.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setIsLogoutOpen(false)}
              className="w-full sm:w-auto px-5 py-2 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full sm:w-auto px-5 py-2 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
