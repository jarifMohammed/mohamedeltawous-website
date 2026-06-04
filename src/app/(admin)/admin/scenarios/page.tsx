"use client";

import { FileBarChart } from "lucide-react";

export default function AdminScenariosPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-violet-50 rounded-xl">
          <FileBarChart size={22} className="text-violet-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Scenarios Management</h1>
          <p className="text-sm text-slate-500">View and manage all user scenarios</p>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-violet-50 flex items-center justify-center mb-4">
          <FileBarChart size={28} className="text-violet-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-700 mb-2">Scenarios Overview Coming Soon</h2>
        <p className="text-sm text-slate-400 max-w-md">
          This section will show all scenario analyses created by users, with the ability to review, approve, and manage them.
        </p>
      </div>
    </div>
  );
}
