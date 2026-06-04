
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import {
  Users,
  FileBarChart,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,

} from "lucide-react";

// ─── Payment Summary Types ───────────────────────────────────────────────────
interface PaymentStatusInfo {
  count: number;
  totalAmount: number;
  totalCredits: number;
}

interface RevenueByCurrency {
  currency: string;
  totalRevenue: number;
  totalPayments: number;
  totalCreditsSold: number;
}

interface PaymentSummaryData {
  totalPayments: number;
  byStatus: {
    succeeded?: PaymentStatusInfo;
    failed?: PaymentStatusInfo;
  };
  revenueByCurrency: RevenueByCurrency[];
}

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
              className={`text-xs font-semibold ${changeType === "up" ? "text-emerald-500" : "text-red-500"

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

export default function AdminDashboardOverview() {

  const { data: session } = useSession();
  const userName = session?.user?.name || "Admin";

  const [paymentData, setPaymentData] = useState<PaymentSummaryData | null>(null);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/subscription/admin/payment-summary");
        setPaymentData(res.data?.data || null);

      } catch (e) {
        console.error("Failed to fetch payment summary", e);
        setPaymentData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

  }, []);



  // Helper to format amount (assuming cents)

  const formatCurrency = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    });
    return formatter.format(amount / 100);
  };


  return (

    <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-8">

      {/* Page Header */}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

        <div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">

            Welcome back,

          </h1>

          <p className="text-slate-500 text-sm mt-1">

            Here&apos;s what&apos;s happening with your platform today.

          </p>

        </div>

      </div>



      {/* Stats Grid */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">

        {/* Total Payments */}

        <StatCard

          title="Total Payments"

          value={paymentData?.totalPayments?.toString() ?? "-"}

          change="-"

          changeType="up"

          icon={<FileBarChart size={22} className="text-violet-600" />}

          iconBg="bg-violet-50"

        />

        {/* Successful Payments */}

        <StatCard

          title="Successful Payments"

          value={paymentData?.byStatus?.succeeded?.totalAmount ? formatCurrency(paymentData.byStatus.succeeded.totalAmount, paymentData.revenueByCurrency?.[0]?.currency ?? "USD") : "-"}

          change={paymentData?.byStatus?.succeeded?.count?.toString() ?? "-"}

          changeType="up"

          icon={<Users size={22} className="text-blue-600" />}

          iconBg="bg-blue-50"

        />

        {/* Failed Payments */}

        <StatCard

          title="Failed Payments"

          value={paymentData?.byStatus?.failed?.totalAmount ? formatCurrency(paymentData.byStatus.failed.totalAmount, paymentData.revenueByCurrency?.[0]?.currency ?? "USD") : "-"}

          change={paymentData?.byStatus?.failed?.count?.toString() ?? "-"}

          changeType="down"

          icon={<Activity size={22} className="text-emerald-600" />}

          iconBg="bg-emerald-50"

        />

        {/* Revenue by Currency */}

        {paymentData?.revenueByCurrency?.map((r: RevenueByCurrency) => (

          <StatCard

            key={r.currency}

            title={`Revenue (${r.currency.toUpperCase()})`}

            value={formatCurrency(r.totalRevenue, r.currency)}

            change={r.totalPayments?.toString() ?? "-"}

            changeType="up"

            icon={<TrendingUp size={22} className="text-amber-600" />}
            iconBg="bg-amber-50"
          />
        ))}

      </div>

    </div>

  );

}