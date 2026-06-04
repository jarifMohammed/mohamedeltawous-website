"use client";

import { useSession } from "next-auth/react";
import {
  Users,
  FileBarChart,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  UserPlus,
  Clock,
  BarChart3,
} from "lucide-react";

// ─── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  readonly title: string;
  readonly value: string;
  readonly change: string;
  readonly changeType: "up" | "down";
  readonly icon: React.ReactNode;
  readonly iconBg: string;
}

function StatCard({ title, value, change, changeType, icon, iconBg }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-slate-500 font-medium">{title}</span>
          <span className="text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
          <div className="flex items-center gap-1 mt-1">
            {changeType === "up" ? (
              <ArrowUpRight size={14} className="text-emerald-500" />
            ) : (
              <ArrowDownRight size={14} className="text-red-500" />
            )}
            <span
              className={`text-xs font-semibold ${
                changeType === "up" ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {change}
            </span>
            <span className="text-xs text-slate-400 ml-1">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${iconBg}`}>{icon}</div>
      </div>
    </div>
  );
}

// ─── Activity Item ───────────────────────────────────────────────────────────

interface ActivityItemProps {
  readonly user: string;
  readonly action: string;
  readonly time: string;
  readonly avatar: string;
}

function ActivityItem({ user, action, time, avatar }: ActivityItemProps) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
        {avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-800 font-medium truncate">
          <span className="font-semibold">{user}</span> {action}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

// ─── Top Scenario Row ────────────────────────────────────────────────────────

interface TopScenarioProps {
  readonly name: string;
  readonly runs: number;
  readonly maxRuns: number;
  readonly color: string;
}

function TopScenario({ name, runs, maxRuns, color }: TopScenarioProps) {
  const pct = Math.round((runs / maxRuns) * 100);
  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-700 font-medium truncate">{name}</span>
        <span className="text-sm text-slate-500 font-semibold">{runs}</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main Overview Page ──────────────────────────────────────────────────────

const recentActivities = [
  { user: "Ahmed Hassan", action: "created a new scenario analysis", time: "2 minutes ago", avatar: "AH" },
  { user: "Sara Mohamed", action: "completed scenario evaluation", time: "15 minutes ago", avatar: "SM" },
  { user: "Omar Ali", action: "registered a new account", time: "1 hour ago", avatar: "OA" },
  { user: "Fatima Noor", action: "upgraded to Premium plan", time: "2 hours ago", avatar: "FN" },
  { user: "Youssef Khalil", action: "ran a competitive analysis", time: "3 hours ago", avatar: "YK" },
  { user: "Layla Ibrahim", action: "exported scenario report", time: "5 hours ago", avatar: "LI" },
];

const topScenarios = [
  { name: "Market Entry Analysis", runs: 342, maxRuns: 342, color: "bg-blue-500" },
  { name: "Competitive Landscape", runs: 287, maxRuns: 342, color: "bg-violet-500" },
  { name: "Risk Assessment", runs: 224, maxRuns: 342, color: "bg-emerald-500" },
  { name: "Growth Forecasting", runs: 198, maxRuns: 342, color: "bg-amber-500" },
  { name: "SWOT Analysis", runs: 156, maxRuns: 342, color: "bg-rose-500" },
];

export default function AdminDashboardOverview() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Admin";

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {userName.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Here&apos;s what&apos;s happening with your platform today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
          <Clock size={14} />
          <span>Last updated: just now</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Users"
          value="2,847"
          change="12.5%"
          changeType="up"
          icon={<Users size={22} className="text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Total Scenarios"
          value="1,234"
          change="8.2%"
          changeType="up"
          icon={<FileBarChart size={22} className="text-violet-600" />}
          iconBg="bg-violet-50"
        />
        <StatCard
          title="Active Sessions"
          value="486"
          change="3.1%"
          changeType="down"
          icon={<Activity size={22} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Revenue"
          value="$48.2K"
          change="18.7%"
          changeType="up"
          icon={<TrendingUp size={22} className="text-amber-600" />}
          iconBg="bg-amber-50"
        />
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-slate-500" />
              <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-full">
              Today
            </span>
          </div>
          <div className="flex flex-col">
            {recentActivities.map((item) => (
              <ActivityItem
                key={`${item.user}-${item.time}`}
                user={item.user}
                action={item.action}
                time={item.time}
                avatar={item.avatar}
              />
            ))}
          </div>
        </div>

        {/* Top Scenarios */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-slate-500" />
              <h2 className="text-lg font-semibold text-slate-800">Top Scenarios</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-full">
              All time
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {topScenarios.map((item) => (
              <TopScenario
                key={item.name}
                name={item.name}
                runs={item.runs}
                maxRuns={item.maxRuns}
                color={item.color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {/* New Signups */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <UserPlus size={20} />
            </div>
            <span className="text-sm font-medium text-blue-100">New Signups Today</span>
          </div>
          <p className="text-4xl font-bold tracking-tight">47</p>
          <p className="text-blue-200 text-sm mt-1">+12 from yesterday</p>
        </div>

        {/* Active Scenarios */}
        <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg shadow-violet-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileBarChart size={20} />
            </div>
            <span className="text-sm font-medium text-violet-100">Running Scenarios</span>
          </div>
          <p className="text-4xl font-bold tracking-tight">23</p>
          <p className="text-violet-200 text-sm mt-1">Across 18 users</p>
        </div>

        {/* System Health */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Activity size={20} />
            </div>
            <span className="text-sm font-medium text-emerald-100">System Health</span>
          </div>
          <p className="text-4xl font-bold tracking-tight">99.9%</p>
          <p className="text-emerald-200 text-sm mt-1">Uptime this month</p>
        </div>
      </div>
    </div>
  );
}
