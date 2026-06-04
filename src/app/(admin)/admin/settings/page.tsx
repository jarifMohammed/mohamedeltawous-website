"use client";

import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-slate-100 rounded-xl">
          <Settings size={22} className="text-slate-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Settings</h1>
          <p className="text-sm text-slate-500">Configure platform settings and preferences</p>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
          <Settings size={28} className="text-slate-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-700 mb-2">Settings Panel Coming Soon</h2>
        <p className="text-sm text-slate-400 max-w-md">
          This section will allow you to configure platform-wide settings including pricing plans, API keys, notification preferences, and more.
        </p>
      </div>
    </div>
  );
}
