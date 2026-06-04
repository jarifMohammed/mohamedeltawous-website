"use client";

import { Users, Search, Filter } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-xl">
            <Users size={22} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Users Management</h1>
            <p className="text-sm text-slate-500">Manage all registered users</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <Users size={28} className="text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-700 mb-2">Users Table Coming Soon</h2>
        <p className="text-sm text-slate-400 max-w-md">
          This section will display a comprehensive list of all registered users with filtering, sorting, and management capabilities.
        </p>
      </div>
    </div>
  );
}
