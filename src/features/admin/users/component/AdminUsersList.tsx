"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Crown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  UserCheck,
  UserMinus,
  Mail,
  Calendar,
  Eye,
  CreditCard,
} from "lucide-react";
import { getAllUsers, getUserById, getUserPayments } from "../api/users.api";
import { User, Pagination, UserPayment, GetUsersParams } from "../types/users.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminUsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [userPayments, setUserPayments] = useState<UserPayment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const handleViewDetails = async (user: User) => {
    setSelectedUser(user);
    setUserPayments([]);
    setLoadingDetails(true);
    setLoadingPayments(true);
    try {
      const [userRes, paymentsRes] = await Promise.all([
        getUserById(user._id),
        getUserPayments(user._id, { page: 1, limit: 20 }),
      ]);

      if (userRes.success) {
        setSelectedUser(userRes.data);
      }
      if (paymentsRes.success) {
        setUserPayments(paymentsRes.data.payments);
      }
    } catch (error) {
      console.error("Failed to fetch user details or payments:", error);
      toast.error("Failed to load user information.");
    } finally {
      setLoadingDetails(false);
      setLoadingPayments(false);
    }
  };

  // Filter States
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [role, setRole] = useState("all");
  const [isActive, setIsActive] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetUsersParams = {
        page,
        limit,
      };

      if (search) params.search = search;
      if (role !== "all") params.role = role;
      if (isActive !== "all") params.isActive = isActive === "active";

      const res = await getAllUsers(params);
      if (res.success) {
        setUsers(res.data.users);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users list.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, role, isActive]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounce search input changes (500ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsActive(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    });
    return formatter.format(amount / 100);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-xl">
            <Users size={22} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Users Management
            </h1>
            <p className="text-sm text-slate-500">
              Manage and view all registered users, permissions, and subscriptions
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
              placeholder="Search by name or email..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 bg-slate-50/50"
            />
          </div>

          {/* Role Filter */}
          <div className="flex flex-col gap-1.5">
            <select
              value={role}
              onChange={handleRoleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 cursor-pointer text-slate-700 font-medium"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1.5">
            <select
              value={isActive}
              onChange={handleStatusChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 cursor-pointer text-slate-700 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table / List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Subscription / Credits
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-6 py-4.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                // Skeleton loading rows
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
                      <div className="h-6 w-36 bg-slate-100 animate-pulse rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 bg-slate-100 animate-pulse rounded" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-6 w-8 bg-slate-100 animate-pulse rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                        <Users size={24} className="text-slate-400" />
                      </div>
                      <h3 className="text-base font-semibold text-slate-800 mb-1">
                        No Users Found
                      </h3>
                      <p className="text-sm text-slate-400">
                        We couldn&apos;t find any users matching your current filters or search term.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const sub = user.subscriptionId;
                  const hasActiveSub = sub && sub.isActive;

                  return (
                    <tr key={user._id} className="hover:bg-slate-50/40 transition-colors">
                      {/* User Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-slate-100 shrink-0">
                            {user.imageLink ? (
                              <AvatarImage src={user.imageLink} alt={user.name} />
                            ) : (
                              <AvatarFallback className="bg-slate-100 text-slate-600 text-sm font-medium">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-slate-800 truncate">
                              {user.name}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                              <Mail size={12} className="shrink-0" />
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <Badge
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold select-none capitalize ${
                            user.role === "admin"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {user.role}
                        </Badge>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          {user.isActive ? (
                            <span className="flex items-center gap-1 text-emerald-600">
                              <CheckCircle2 size={14} />
                              Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-rose-500">
                              <XCircle size={14} />
                              Inactive
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Subscription Info */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {hasActiveSub ? (
                            <>
                              <Badge className="bg-violet-50 text-violet-700 border border-violet-200 rounded-full px-2.5 py-0.5 text-[11px] font-semibold w-fit flex items-center gap-1 select-none capitalize">
                                <Crown size={10} />
                                {sub.currentTier}
                              </Badge>
                              <span className="text-xs text-slate-500 font-medium">
                                Credits: {sub.availableCredits} / {sub.totalCredits}
                              </span>
                            </>
                          ) : (
                            <>
                              <Badge className="bg-slate-100 text-slate-600 border border-slate-200 rounded-full px-2.5 py-0.5 text-[11px] font-semibold w-fit select-none">
                                Free
                              </Badge>
                              <span className="text-xs text-slate-400">
                                No active plan
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar size={13} className="text-slate-400 shrink-0" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(user)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer inline-flex items-center justify-center"
                          title="View Details"
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
              {Math.min(page * limit, pagination.total)} of {pagination.total} users
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

      {/* User Details Dialog */}
      <Dialog open={selectedUser !== null} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-2xl bg-white p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] border border-slate-100">
          {selectedUser && (
            <div className="space-y-6">
              <DialogHeader className="border-b border-slate-100 pb-4">
                <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Users className="text-blue-500" size={20} />
                  User Details Overview
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-400">
                  Comprehensive profile and subscription overview for {selectedUser.name}
                </DialogDescription>
              </DialogHeader>

              {/* Profile Card */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <Avatar className="h-16 w-16 border-2 border-white shadow-sm shrink-0">
                  {selectedUser.imageLink ? (
                    <AvatarImage src={selectedUser.imageLink} alt={selectedUser.name} />
                  ) : (
                    <AvatarFallback className="bg-slate-200 text-slate-700 text-lg font-semibold">
                      {getInitials(selectedUser.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-center sm:text-left space-y-1 min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="font-bold text-slate-800 text-lg truncate">{selectedUser.name}</h3>
                    {loadingDetails && (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <Loader2 size={12} className="animate-spin" />
                        Syncing...
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 justify-center sm:justify-start truncate">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    {selectedUser.email}
                  </p>

                  {/* Job Title and Bio */}
                  {(selectedUser.jobTitle || selectedUser.bio) && (
                    <div className="text-xs text-slate-600 bg-white/70 p-2.5 rounded-lg border border-slate-200/40 mt-2 space-y-1 text-left">
                      {selectedUser.jobTitle && (
                        <p className="font-semibold text-slate-700">
                          {selectedUser.jobTitle}
                        </p>
                      )}
                      {selectedUser.bio && (
                        <p className="text-slate-500 italic">
                          &ldquo;{selectedUser.bio}&rdquo;
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                    <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                      selectedUser.role === "admin"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {selectedUser.role}
                    </Badge>
                    <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      selectedUser.isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}>
                      {selectedUser.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* General Account Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Verified Status</span>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    {selectedUser.isVerified ? (
                      <>
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        Verified Account
                      </>
                    ) : (
                      <>
                        <XCircle size={16} className="text-rose-400" />
                        Not Verified
                      </>
                    )}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Total Credits Ever Used</span>
                  <p className="text-base font-bold text-slate-800">
                    {selectedUser.totalCreditsEverUsed}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Last Purchase Date</span>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedUser.lastPurchaseAt ? formatDate(selectedUser.lastPurchaseAt) : "Never Purchased"}
                  </p>
                </div>

                 <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Joined Date</span>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>

                {selectedUser.address && (
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-1 sm:col-span-2">
                    <span className="text-xs text-slate-400 font-medium">Address</span>
                    <p className="text-sm font-semibold text-slate-800">
                      {selectedUser.address}
                    </p>
                  </div>
                )}
              </div>

              {/* Subscription Breakdown */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                  Subscription & Credit Balance
                </h4>
                {selectedUser.subscriptionId ? (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                    {/* Header Row */}
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                      <div className="flex items-center gap-2">
                        <Crown className="text-violet-500 animate-bounce" size={18} />
                        <span className="font-bold text-slate-800 capitalize">
                          {selectedUser.subscriptionId.currentTier} Plan
                        </span>
                      </div>
                      <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        selectedUser.subscriptionId.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>
                        {selectedUser.subscriptionId.isActive ? "Active" : "Expired"}
                      </Badge>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                      {/* Subscription ID */}
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400 font-medium block">Subscription ID</span>
                        <span className="font-semibold text-slate-800 block break-all font-mono text-xs bg-slate-100/50 px-2.5 py-1 rounded border border-slate-200/40">
                          {selectedUser.subscriptionId._id}
                        </span>
                      </div>

                      {/* Stripe Customer ID */}
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400 font-medium block">Stripe Customer ID</span>
                        <span className="font-semibold text-slate-800 block break-all font-mono text-xs bg-slate-100/50 px-2.5 py-1 rounded border border-slate-200/40">
                          {selectedUser.subscriptionId.stripeCustomerId || "N/A"}
                        </span>
                      </div>

                      {/* Total Credits */}
                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-400 font-medium block">Total Credits</span>
                        <span className="font-bold text-slate-800">{selectedUser.subscriptionId.totalCredits}</span>
                      </div>

                      {/* Used Credits */}
                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-400 font-medium block">Used Credits</span>
                        <span className="font-bold text-slate-800">{selectedUser.subscriptionId.usedCredits}</span>
                      </div>

                      {/* Available Credits */}
                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-400 font-medium block">Available Credits</span>
                        <span className="font-bold text-slate-800 text-emerald-600">{selectedUser.subscriptionId.availableCredits}</span>
                      </div>

                      {/* Last Payment Status */}
                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-400 font-medium block">Last Payment Status</span>
                        <span className="font-semibold text-slate-800 capitalize">{selectedUser.subscriptionId.lastPaymentStatus || "N/A"}</span>
                      </div>

                      {/* Last Payment ID */}
                      <div className="space-y-1 sm:col-span-2">
                        <span className="text-xs text-slate-400 font-medium block">Last Payment ID</span>
                        <span className="font-semibold text-slate-800 block break-all font-mono text-xs bg-slate-100/50 px-2.5 py-1 rounded border border-slate-200/40">
                          {selectedUser.subscriptionId.lastPaymentId || "N/A"}
                        </span>
                      </div>

                      {/* Last Payment Amount */}
                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-400 font-medium block">Last Payment Amount</span>
                        <span className="font-bold text-slate-800">
                          {(selectedUser.subscriptionId.lastPaymentAmount / 100).toFixed(2)}{" "}
                          {selectedUser.subscriptionId.lastPaymentCurrency.toUpperCase()}
                        </span>
                      </div>

                      {/* Payment Verified At */}
                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-400 font-medium block">Payment Verified At</span>
                        <span className="font-semibold text-slate-800">
                          {selectedUser.subscriptionId.paymentVerifiedAt ? formatDate(selectedUser.subscriptionId.paymentVerifiedAt) : "N/A"}
                        </span>
                      </div>

                      {/* Last Cron Check At */}
                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-400 font-medium block">Last Cron Check At</span>
                        <span className="font-semibold text-slate-800">
                          {selectedUser.subscriptionId.lastCronCheckAt ? formatDate(selectedUser.subscriptionId.lastCronCheckAt) : "N/A"}
                        </span>
                      </div>

                      {/* Subscription Created At */}
                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-400 font-medium block">Subscription Created At</span>
                        <span className="font-semibold text-slate-800">
                          {selectedUser.subscriptionId.createdAt ? formatDate(selectedUser.subscriptionId.createdAt) : "N/A"}
                        </span>
                      </div>

                      {/* Subscription Updated At */}
                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-400 font-medium block">Subscription Updated At</span>
                        <span className="font-semibold text-slate-800">
                          {selectedUser.subscriptionId.updatedAt ? formatDate(selectedUser.subscriptionId.updatedAt) : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center py-6 text-slate-400 text-sm">
                    This user does not have an active premium subscription.
                  </div>
                )}
              </div>

              {/* User Payment History */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                  Billing & Payment History
                </h4>
                {loadingPayments ? (
                  <div className="flex items-center justify-center py-6 bg-slate-50 rounded-xl border border-slate-100">
                    <Loader2 className="animate-spin text-slate-400 mr-2" size={18} />
                    <span className="text-sm text-slate-500">Loading payment logs...</span>
                  </div>
                ) : userPayments.length === 0 ? (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center py-6 text-slate-400 text-sm">
                    No payment history found for this user.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {userPayments.map((payment) => (
                      <div
                        key={payment._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm gap-2 text-sm"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                            <CreditCard size={16} />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-800 capitalize">
                                {payment.tier} Tier
                              </span>
                              <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                +{payment.creditsAdded} Credits
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 font-medium mt-0.5 block">
                              {formatDate(payment.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                          <span className="font-bold text-slate-800">
                            {formatCurrency(payment.amount, payment.currency)}
                          </span>
                          {payment.status === "succeeded" ? (
                            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-0.5 text-xs font-semibold select-none flex items-center gap-0.5">
                              <CheckCircle2 size={10} />
                              Succeeded
                            </Badge>
                          ) : (
                            <Badge className="bg-rose-50 text-rose-700 border border-rose-200 rounded-full px-2.5 py-0.5 text-xs font-semibold select-none flex items-center gap-0.5">
                              <XCircle size={10} />
                              Failed
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
