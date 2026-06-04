"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Coins,
  ShieldAlert,
  ArrowUpRight,
  Mail,
} from "lucide-react";
import { getAdminPayments } from "../api/payments.api";
import { Payment, Pagination } from "../types/payments.types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminPaymentsList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("all");
  const [tier, setTier] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit,
      };

      if (search) params.search = search;
      if (status !== "all") params.status = status;
      if (tier !== "all") params.tier = tier;

      const res = await getAdminPayments(params);
      if (res.success) {
        setPayments(res.data.payments);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      toast.error("Failed to load payments list.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status, tier]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const handleTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTier(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "US";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    });
    return formatter.format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-xl">
            <CreditCard size={22} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Payments & Transactions
            </h1>
            <p className="text-sm text-slate-500">
              Monitor customer billing, stripe checkout logs, and credit distribution
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Box */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by customer name or email..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 bg-slate-50/50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1.5">
            <select
              value={status}
              onChange={handleStatusChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 cursor-pointer text-slate-700 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="succeeded">Succeeded</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Tier Filter */}
          <div className="flex flex-col gap-1.5">
            <select
              value={tier}
              onChange={handleTierChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 cursor-pointer text-slate-700 font-medium"
            >
              <option value="all">All Tiers</option>
              <option value="starter">Starter</option>
              <option value="professional">Professional</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table / List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Credits Added
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                // Skeleton loading
                Array.from({ length: limit }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse shrink-0" />
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-slate-100 animate-pulse rounded" />
                          <div className="h-3 w-48 bg-slate-100 animate-pulse rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-16 bg-slate-100 animate-pulse rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-16 bg-slate-100 animate-pulse rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-16 bg-slate-100 animate-pulse rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-20 bg-slate-100 animate-pulse rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 bg-slate-100 animate-pulse rounded" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-6 w-8 bg-slate-100 animate-pulse rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                        <CreditCard size={24} className="text-slate-400" />
                      </div>
                      <h3 className="text-base font-semibold text-slate-800 mb-1">
                        No Payments Found
                      </h3>
                      <p className="text-sm text-slate-400">
                        We couldn&apos;t find any transaction records matching your current filter settings.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => {
                  const user = payment.userId;

                  return (
                    <tr key={payment._id} className="hover:bg-slate-50/40 transition-colors">
                      {/* Customer */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-slate-100 shrink-0">
                            <AvatarFallback className="bg-slate-100 text-slate-600 text-sm font-medium">
                              {getInitials(user?.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-slate-800 truncate">
                              {user?.name || "Deleted User"}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                              <Mail size={12} className="shrink-0" />
                              {user?.email || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Tier */}
                      <td className="px-6 py-4">
                        <Badge className="bg-violet-50 text-violet-700 border border-violet-200 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize select-none">
                          {payment.tier}
                        </Badge>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">
                        {formatCurrency(payment.amount, payment.currency)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {payment.status === "succeeded" ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-0.5 text-xs font-semibold select-none flex items-center gap-1 w-fit">
                            <CheckCircle2 size={12} />
                            Succeeded
                          </Badge>
                        ) : (
                          <Badge className="bg-rose-50 text-rose-700 border border-rose-200 rounded-full px-2.5 py-0.5 text-xs font-semibold select-none flex items-center gap-1 w-fit">
                            <XCircle size={12} />
                            Failed
                          </Badge>
                        )}
                      </td>

                      {/* Credits Added */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                          <Coins size={12} />
                          +{payment.creditsAdded} Credits
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1">
                          <Calendar size={13} className="text-slate-400 shrink-0" />
                          {formatDate(payment.createdAt).split(",")[0]}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedPayment(payment)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer inline-flex items-center justify-center"
                          title="View Checkout Session Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, pagination.total)} of {pagination.total} records
            </span>
            <div className="flex items-center gap-1.5">
              {/* Prev Button */}
              <button
                type="button"
                disabled={page === 1 || loading}
                onClick={() => handlePageChange(page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Page Number Buttons */}
              {Array.from({ length: pagination.totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    disabled={loading}
                    onClick={() => handlePageChange(pageNum)}
                    className={`min-w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      page === pageNum
                        ? "bg-[#0f172a] text-white shadow-sm"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                type="button"
                disabled={page === pagination.totalPages || loading}
                onClick={() => handlePageChange(page + 1)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Details Dialog */}
      <Dialog open={selectedPayment !== null} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="max-w-2xl bg-white p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] border border-slate-100">
          {selectedPayment && (
            <div className="space-y-6">
              <DialogHeader className="border-b border-slate-100 pb-4">
                <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="text-blue-500" size={20} />
                  Checkout Session Details
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-400">
                  Comprehensive audit log of billing checkout and verification cycles
                </DialogDescription>
              </DialogHeader>

              {/* Profile Card */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <Avatar className="h-16 w-16 border-2 border-white shadow-sm shrink-0">
                  <AvatarFallback className="bg-slate-200 text-slate-700 text-lg font-semibold animate-pulse">
                    {getInitials(selectedPayment.userId?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left space-y-1 min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 text-lg truncate">{selectedPayment.userId?.name || "Deleted Customer"}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 justify-center sm:justify-start truncate">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    {selectedPayment.userId?.email || "N/A"}
                  </p>
                  <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                    <Badge className="bg-violet-50 text-violet-700 border border-violet-200 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize select-none">
                      {selectedPayment.tier} Plan
                    </Badge>
                    {selectedPayment.status === "succeeded" ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-0.5 text-xs font-semibold select-none flex items-center gap-1 w-fit">
                        <CheckCircle2 size={12} />
                        Succeeded
                      </Badge>
                    ) : (
                      <Badge className="bg-rose-50 text-rose-700 border border-rose-200 rounded-full px-2.5 py-0.5 text-xs font-semibold select-none flex items-center gap-1 w-fit">
                        <XCircle size={12} />
                        Failed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                  <Coins className="text-slate-500" size={16} />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Transaction Data</span>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm bg-white">
                  {/* Payment ID */}
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-medium block">Payment Record ID</span>
                    <span className="font-semibold text-slate-800 block break-all font-mono text-xs bg-slate-100/50 px-2.5 py-1 rounded border border-slate-200/40">
                      {selectedPayment._id}
                    </span>
                  </div>

                  {/* Stripe Session ID */}
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-medium block">Stripe Checkout Session ID</span>
                    <span className="font-semibold text-slate-800 block break-all font-mono text-xs bg-slate-100/50 px-2.5 py-1 rounded border border-slate-200/40">
                      {selectedPayment.stripeCheckoutSessionId}
                    </span>
                  </div>

                  {/* Amount Paid */}
                  <div className="space-y-0.5">
                    <span className="text-xs text-slate-400 font-medium block">Amount Paid</span>
                    <span className="font-bold text-slate-900 text-base">
                      {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                    </span>
                  </div>

                  {/* Credits Dispatched */}
                  <div className="space-y-0.5">
                    <span className="text-xs text-slate-400 font-medium block">Credits Added</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <Coins size={14} />
                      +{selectedPayment.creditsAdded} Credits
                    </span>
                  </div>

                  {/* Verification Attempts */}
                  <div className="space-y-0.5">
                    <span className="text-xs text-slate-400 font-medium block">Verification Attempts</span>
                    <span className="font-semibold text-slate-800">{selectedPayment.verificationAttempts} / 5</span>
                  </div>

                  {/* Next Cron Check */}
                  <div className="space-y-0.5">
                    <span className="text-xs text-slate-400 font-medium block">Next Verification Check</span>
                    <span className="font-semibold text-slate-800">{formatDate(selectedPayment.nextCheckAt)}</span>
                  </div>

                  {/* Verified Date */}
                  <div className="space-y-0.5">
                    <span className="text-xs text-slate-400 font-medium block">Verified Date</span>
                    <span className="font-semibold text-slate-800">
                      {selectedPayment.verifiedAt ? formatDate(selectedPayment.verifiedAt) : "N/A"}
                    </span>
                  </div>

                  {/* Created Date */}
                  <div className="space-y-0.5">
                    <span className="text-xs text-slate-400 font-medium block">Created Date</span>
                    <span className="font-semibold text-slate-800">{formatDate(selectedPayment.createdAt)}</span>
                  </div>

                  {/* Failure Reason */}
                  {selectedPayment.failureReason && (
                    <div className="sm:col-span-2 bg-rose-50/50 border border-rose-100 rounded-xl p-3.5 mt-2 flex items-start gap-2.5">
                      <ShieldAlert size={18} className="text-rose-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">Verification Error</span>
                        <p className="text-xs font-medium text-rose-700">{selectedPayment.failureReason}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
