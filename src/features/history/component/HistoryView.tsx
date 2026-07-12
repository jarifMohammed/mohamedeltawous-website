"use client";

import React, { useState } from "react";
import { useHistory } from "../hooks/useHistory";
import { HistoryItem } from "../types/history.types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { generatePdfFromMarkdown } from "@/features/newScenario/utils/generatePdfFromMarkdown";
import { WindtunnelCell } from "@/features/newScenario/types/newScenario.types";
import {
  Eye,
  Download,
  Search,
  Calendar,
  Building2,
  Briefcase,
  Layers,
  Trophy,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  HelpCircle,
  Info,
  TrendingUp,
  FileText,
  FileWarning,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function HistoryView() {
  const { data, isLoading, error, refetch } = useHistory(100);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "failed">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Selected item state for detail modal
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "axes" | "scenarios" | "windtunnel" | "report">("overview");
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);

  const historyItems = data?.data || [];

  // Filter items
  const filteredItems = historyItems.filter((item) => {
    const matchesSearch =
      item.company?.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company?.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sessionId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Reset page to 1 when filters or items per page change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const handleDownloadPdf = async (item: HistoryItem) => {
    if (!item.report) return;
    setIsPdfDownloading(true);
    try {
      const safeCompanyName = item.company?.name
        ? item.company.name.replaceAll(/[^a-z0-9]/gi, "_")
        : "Report";
      const filename = `${safeCompanyName}_Strategic_Report_History.pdf`;
      await generatePdfFromMarkdown(item.report, filename);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setIsPdfDownloading(false);
    }
  };

  const getRatingStyles = (rating: string) => {
    const r = rating.toLowerCase();
    if (r === "excellent") {
      return {
        bg: "bg-emerald-50 dark:bg-emerald-950/20",
        text: "text-emerald-700 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800",
      };
    }
    if (r === "good") {
      return {
        bg: "bg-blue-50 dark:bg-blue-950/20",
        text: "text-blue-700 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
      };
    }
    if (r === "moderate") {
      return {
        bg: "bg-amber-50 dark:bg-amber-950/20",
        text: "text-amber-700 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-800",
      };
    }
    if (r === "poor") {
      return {
        bg: "bg-rose-50 dark:bg-rose-950/20",
        text: "text-rose-700 dark:text-rose-400",
        border: "border-rose-200 dark:border-rose-800",
      };
    }
    return {
      bg: "bg-slate-50 dark:bg-slate-900/50",
      text: "text-slate-700 dark:text-slate-400",
      border: "border-slate-200 dark:border-slate-800",
    };
  };

  // Helper to ensure forces are formatted correctly
  const renderForce = (forceStr: string) => {
    const parts = forceStr.split(".....");
    if (parts.length > 1) {
      return {
        title: parts[0].trim(),
        desc: parts[1].trim()
      };
    }
    const colonIndex = forceStr.indexOf(":");
    if (colonIndex !== -1) {
      return {
        title: forceStr.substring(0, colonIndex).trim(),
        desc: forceStr.substring(colonIndex + 1).trim()
      };
    }
    return {
      title: "Factor",
      desc: forceStr
    };
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-950 dark:text-white tracking-tight">
            Workshop History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Review and download report outputs from your previous scenario planning workshops.
          </p>
        </div>
        {/* <Button
          variant="outline"
          onClick={() => refetch()}
          className="w-fit border-slate-200 hover:bg-slate-50 cursor-pointer"
        >
          Refresh History
        </Button> */}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by project, company or industry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-transparent border border-slate-200 dark:border-slate-800 rounded-lg outline-none focus:border-slate-400 dark:focus:border-slate-700 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${statusFilter === "all"
              ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950 dark:border-white"
              : "bg-transparent text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
          >
            All Runs
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${statusFilter === "completed"
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-transparent text-emerald-600 border-slate-200 dark:border-slate-800 hover:bg-emerald-50/30"
              }`}
          >
            Completed
          </button>
          <button
            onClick={() => setStatusFilter("failed")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${statusFilter === "failed"
              ? "bg-rose-600 text-white border-rose-600"
              : "bg-transparent text-rose-600 border-slate-200 dark:border-slate-800 hover:bg-rose-50/30"
              }`}
          >
            Failed
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-semibold">Loading your workshop history...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs text-center">
          <div className="h-14 w-14 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mb-4">
            <FileWarning className="h-8 w-8 text-rose-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Failed to load history</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            There was an error communicating with the API. Please try again.
          </p>
          <Button onClick={() => refetch()} className="mt-6 cursor-pointer">
            Retry Loading
          </Button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs text-center">
          <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-4">
            <Layers className="h-7 w-7 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No history items found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search criteria or filters to see older workshop runs."
              : "Generate your first scenario report to view it here in history!"}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Project / Company
                  </th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Industry
                  </th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Date Created
                  </th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Credits Used
                  </th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {paginatedItems.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.company?.projectTitle || "Untitled Session"}
                        </div>
                        <div className="text-xs text-slate-400 font-medium">
                          {item.company?.name || "No company name"}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {item.company?.industry || "N/A"}
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${item.status === "completed"
                          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                          : "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                          }`}
                      >
                        {item.status === "completed" ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3" />
                            Failed
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                        {item.creditsCost} credit
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setActiveTab("overview");
                          }}
                          title="View Details"
                          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {item.status === "completed" && item.report && (
                          <button
                            onClick={() => handleDownloadPdf(item)}
                            title="Download PDF"
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{startIndex + 1}</span> to{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">{endIndex}</span> of{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">{totalItems}</span> entries
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-md px-2 py-1 text-xs font-bold outline-none focus:border-slate-400 dark:focus:border-slate-700 transition-colors cursor-pointer text-slate-700 dark:text-slate-300"
                  >
                    {[5, 10, 20, 50].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      Math.abs(pageNum - currentPage) <= 1
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-md text-xs font-bold transition-all cursor-pointer ${currentPage === pageNum
                            ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs"
                            : "border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    if (
                      pageNum === 2 ||
                      pageNum === totalPages - 1
                    ) {
                      return (
                        <span key={pageNum} className="px-1 text-slate-400 text-xs font-bold">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DETAIL MODAL */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent showCloseButton={false} className="w-full sm:max-w-[92vw] md:max-w-[88vw] lg:max-w-[85vw] xl:max-w-[80vw] h-[90vh] flex flex-col p-0 overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl rounded-2xl">
          {selectedItem && (
            <>
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/20">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl flex items-center justify-center ${selectedItem.status === "completed"
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600"
                    : "bg-rose-50 dark:bg-rose-950/30 text-rose-600"
                    }`}>
                    {selectedItem.status === "completed" ? <Trophy className="h-6 w-6" /> : <FileWarning className="h-6 w-6" />}
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-black text-slate-950 dark:text-white tracking-tight">
                      {selectedItem.company?.projectTitle || "Workshop Details"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 mt-1">
                      <span>{selectedItem.company?.name || "No Company"}</span>
                      <span>•</span>
                      <span>{selectedItem.company?.industry || "No Industry"}</span>
                      <span>•</span>
                      <span>Created {formatDate(selectedItem.createdAt)}</span>
                    </DialogDescription>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {selectedItem.status === "completed" && selectedItem.report && (
                    <Button
                      onClick={() => handleDownloadPdf(selectedItem)}
                      disabled={isPdfDownloading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                      {isPdfDownloading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-3.5 w-3.5" />
                          Download PDF
                        </>
                      )}
                    </Button>
                  )}
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Status failed view */}
              {selectedItem.status === "failed" ? (
                <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
                  <div className="h-16 w-16 bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-100 dark:border-rose-900 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">This workshop session failed</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md font-medium leading-relaxed">
                    Error Logged: <span className="text-rose-600 dark:text-rose-400 font-bold block mt-1 p-3 bg-rose-50/50 dark:bg-rose-950/10 rounded-lg border border-rose-100 dark:border-rose-900/50 font-mono text-xs">{selectedItem.lastError || "Unknown connection error."}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-6">
                    Failed at: {formatDate(selectedItem.failedAt || selectedItem.updatedAt)}
                  </p>
                </div>
              ) : (
                <>
                  {/* Modal Tabs Header */}
                  <div className="flex bg-slate-50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800 shrink-0 px-4">
                    {([
                      { id: "overview", label: "Overview" },
                      { id: "axes", label: "Scenario Axes" },
                      { id: "scenarios", label: "Narratives" },
                      { id: "windtunnel", label: "Windtunnel" },
                      { id: "report", label: "Strategic Report" },
                    ] as const).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3.5 text-xs font-black uppercase tracking-wider relative transition-colors cursor-pointer ${activeTab === tab.id
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                          }`}
                      >
                        {tab.label}
                        {activeTab === tab.id && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Modal Body Scroll Container */}
                  <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-slate-50/20 dark:bg-slate-950">

                    {/* OVERVIEW TAB */}
                    {activeTab === "overview" && (
                      <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Company & Focal Question */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                              <Building2 className="h-4.5 w-4.5 text-slate-500" />
                              Company Summary
                            </h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold leading-relaxed whitespace-pre-line">
                              {selectedItem.company?.summary || "No company summary supplied."}
                            </p>
                          </div>
                          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs space-y-4">
                            <div>
                              <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Project Name</h5>
                              <p className="text-sm font-black text-slate-900 dark:text-white">{selectedItem.company?.projectTitle || "Untitled"}</p>
                            </div>
                            <div>
                              <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Company Name</h5>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedItem.company?.name || "N/A"}</p>
                            </div>
                            <div>
                              <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Industry</h5>
                              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{selectedItem.company?.industry || "N/A"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Focal Question */}
                        {selectedItem.company?.focalQuestion && (
                          <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 dark:from-slate-900/60 dark:to-slate-900/30 p-6 rounded-2xl border border-blue-100/30 dark:border-slate-800 shadow-xs">
                            <h4 className="text-xs font-black uppercase tracking-wider mb-3 flex items-center gap-2">
                              <HelpCircle className="h-4.5 w-4.5" />
                              Strategic Question
                            </h4>
                            <p className="text-base font-black text-slate-900 dark:text-white leading-relaxed">
                              &ldquo;{selectedItem.company.focalQuestion}&rdquo;
                            </p>
                          </div>
                        )}

                        {/* Forces lists */}
                        {selectedItem.forces && selectedItem.forces.length > 0 && (
                          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                              <Layers className="h-4.5 w-4.5 text-slate-500" />
                              Driving Forces Identified
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedItem.forces.map((force, index) => {
                                const info = renderForce(force);
                                return (
                                  <div key={index} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/60 flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-slate-500">
                                      {index + 1}
                                    </div>
                                    <div>
                                      <div className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                                        {info.title}
                                      </div>
                                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                        {info.desc}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Classification lists */}
                        {selectedItem.classification && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
                              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                                Predetermined Elements
                              </h4>
                              <ul className="space-y-3">
                                {selectedItem.classification.predetermined.map((p, idx) => {
                                  const text = typeof p === "string" ? p : p.force;
                                  return (
                                    <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-700 dark:text-slate-300 font-medium">
                                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                                      {text}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
                              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                <HelpCircle className="h-4.5 w-4.5 text-amber-500" />
                                Critical Uncertainties
                              </h4>
                              <ul className="space-y-3">
                                {selectedItem.classification.uncertainties.map((u, idx) => {
                                  const text = typeof u === "string" ? u : u.force;
                                  return (
                                    <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-700 dark:text-slate-300 font-medium">
                                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                                      {text}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* AXES TAB */}
                    {activeTab === "axes" && selectedItem.axes && (
                      <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Axes Description Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
                            <h4 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4">
                              Axis A: {selectedItem.axes.axisA.label}
                            </h4>
                            <div className="flex flex-col gap-3">
                              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
                                <span>Poles:</span>
                              </div>
                              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-center text-xs font-black text-slate-700 dark:text-slate-300">
                                <div className="p-2 bg-white dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800 shadow-xs">
                                  {selectedItem.axes.axisA.poleA1 || selectedItem.axes.axisA.pole1}
                                </div>
                                <div className="p-2 bg-white dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800 shadow-xs">
                                  {selectedItem.axes.axisA.poleA2 || selectedItem.axes.axisA.pole2}
                                </div>
                              </div>
                              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                                {selectedItem.axes.axisA.reason}
                              </p>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
                            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-4">
                              Axis B: {selectedItem.axes.axisB.label}
                            </h4>
                            <div className="flex flex-col gap-3">
                              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
                                <span>Poles:</span>
                              </div>
                              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-center text-xs font-black text-slate-700 dark:text-slate-300">
                                <div className="p-2 bg-white dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800 shadow-xs">
                                  {selectedItem.axes.axisB.poleB1 || selectedItem.axes.axisB.pole1}
                                </div>
                                <div className="p-2 bg-white dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800 shadow-xs">
                                  {selectedItem.axes.axisB.poleB2 || selectedItem.axes.axisB.pole2}
                                </div>
                              </div>
                              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                                {selectedItem.axes.axisB.reason}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Scenario Matrices */}
                        {selectedItem.axes.scenarios && (
                          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-6">
                              Derived Scenario Quadrants
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {Object.entries(selectedItem.axes.scenarios).map(([key, scenarioObj]) => {
                                const details = scenarioObj as { name: string; summary: string };

                                const quadrantLabel: Record<string, string> = {
                                  topRight: "High/Low",
                                  topLeft: "High/High",
                                  bottomLeft: "Low/Low",
                                  bottomRight: "Low/High",
                                };

                                const quadrantCombination: Record<string, string> = {
                                  topRight: "A2+B2",
                                  topLeft: "A2+B1",
                                  bottomLeft: "A1+B1",
                                  bottomRight: "A1+B2",
                                };

                                return (
                                  <div
                                    key={key}
                                    className="p-5 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/80"
                                  >
                                    <div className="flex justify-between items-center">
                                      <span className="text-[9px] font-black tracking-widest text-slate-400 flex items-center gap-1.5">
                                        <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[8px] text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-700/40">
                                          {quadrantCombination[key]}
                                        </span>
                                        {quadrantLabel[key] || key}
                                      </span>
                                    </div>

                                    <h5 className="text-base font-black text-slate-900 dark:text-white mt-1">
                                      {details.name}
                                    </h5>

                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-2 leading-relaxed">
                                      {details.summary}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* NARRATIVES TAB */}
                    {activeTab === "scenarios" && selectedItem.scenarios?.scenarios && (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        {selectedItem.scenarios.scenarios.map((s, idx) => (
                          <div key={s.id || idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-50 dark:border-slate-800 pb-4 mb-4">
                              <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded font-mono">
                                  {s.combination === "A1+B1" ? "Low/Low" :
                                   s.combination === "A1+B2" ? "Low/High" :
                                   s.combination === "A2+B1" ? "High/High" :
                                   s.combination === "A2+B2" ? "High/Low" :
                                   (s.combination || `Scenario ${idx + 1}`)}
                                </span>
                                {s.name}
                              </h4>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                              <div className="lg:col-span-2 space-y-4">
                                <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400">The Scenario Story</h5>
                                <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold leading-relaxed whitespace-pre-line">
                                  {s.story}
                                </p>
                              </div>
                              <div className="space-y-4 bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-50 dark:border-slate-800">
                                <div>
                                  <h5 className="text-[10px] font-black uppercase tracking-wider text-rose-500 mb-2">Strategic Implications</h5>
                                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {s.implications}
                                  </p>
                                </div>
                                {s.signposts && s.signposts.length > 0 && (
                                  <div>
                                    <h5 className="text-[10px] font-black uppercase tracking-wider text-blue-500 mb-2">Leading Signposts</h5>
                                    <ul className="space-y-1.5">
                                      {s.signposts.map((sign, sidx) => (
                                        <li key={sidx} className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex gap-2">
                                          <span className="text-blue-500 mt-0.5">•</span>
                                          {sign}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* WIND TUNNEL TAB */}
                    {activeTab === "windtunnel" && selectedItem.windTunnelResults && (
                      <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Executive summary & Recommended Move */}
                        <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] dark:from-slate-900 dark:to-slate-950 rounded-2xl p-6 md:p-8 text-white border border-white/5 shadow-xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                          <div className="relative z-10 space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Recommended Core Move</span>
                            <h3 className="text-xl md:text-2xl font-black tracking-tight leading-tight">
                              {selectedItem.windTunnelResults.recommendedOption}
                            </h3>
                            <p className="text-slate-300 text-sm font-semibold leading-relaxed max-w-4xl italic">
                              &quot;{selectedItem.windTunnelResults.strategicConclusion}&quot;
                            </p>
                          </div>
                        </div>

                        {/* Performance Matrix */}
                        {selectedItem.windTunnelResults.windTunnel && selectedItem.windTunnelResults.windTunnel.length > 0 && (
                          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col">
                            <div className="p-5 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                              <h4 className="text-sm font-black uppercase tracking-wider text-slate-400">
                                Performance Evaluation matrix
                              </h4>
                              <div className="flex gap-3 text-[9px] font-black uppercase tracking-wider text-slate-400">
                                {["Excellent", "Good", "Moderate", "Poor"].map((r) => (
                                  <span key={r} className="flex items-center gap-1.5">
                                    <span className={`w-2.5 h-2.5 rounded-full ${getRatingStyles(r).bg} border ${getRatingStyles(r).border}`} />
                                    {r}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse text-left text-sm">
                                <thead>
                                  <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-50 dark:border-slate-800">
                                    <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest min-w-[200px]">Strategic Options</th>
                                    {/* Quadrant Columns */}
                                    {Array.from({ length: 4 }).map((_, idx) => (
                                      <th key={idx} className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center min-w-[150px]">
                                        {selectedItem.scenarios?.scenarios?.[idx]?.name || `Scenario ${idx + 1}`}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                                  {/* Map over options */}
                                  {(selectedItem.windTunnelResults.generatedOptions || [
                                    "Option A: Invest in operational efficiency and energy resilience",
                                    "Option B: Build multi-jurisdictional compliance capability",
                                    "Option C: Pursue aggressive market expansion"
                                  ].slice(0, selectedItem.windTunnelResults.windTunnel.length)).map((optName, optIdx) => {
                                    // Row data
                                    const rowData = selectedItem.windTunnelResults?.windTunnel[optIdx];
                                    return (
                                      <tr key={optIdx}>
                                        <td className="p-4 font-bold text-slate-700 dark:text-slate-300 leading-snug">
                                          {optName}
                                        </td>
                                        {Array.isArray(rowData) ? (
                                          rowData.map((cell: WindtunnelCell, cellIdx: number) => {
                                            const styles = getRatingStyles(cell?.rating || "moderate");
                                            return (
                                              <td key={cellIdx} className="p-4 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${styles.bg} ${styles.text} ${styles.border}`}>
                                                    {cell?.rating || "N/A"}
                                                  </span>
                                                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold max-w-[140px] leading-relaxed block truncate" title={cell?.reasoning}>
                                                    {cell?.reasoning || ""}
                                                  </span>
                                                </div>
                                              </td>
                                            );
                                          })
                                        ) : (
                                          <td colSpan={4} className="p-4 text-center text-slate-400 italic">No evaluation data</td>
                                        )}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Robust Moves lists */}
                        {selectedItem.windTunnelResults.robustMoves && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
                              <h5 className="text-sm font-black text-emerald-600 tracking-tight flex items-center gap-2">
                                <CheckCircle2 className="h-4.5 w-4.5" />
                                No-Regret Moves
                              </h5>
                              <ul className="space-y-3">
                                {(Array.isArray(selectedItem.windTunnelResults.robustMoves.noRegret)
                                  ? selectedItem.windTunnelResults.robustMoves.noRegret
                                  : []
                                ).map((move, idx) => (
                                  <li key={idx} className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex gap-2">
                                    <span className="text-emerald-500 shrink-0">•</span>
                                    {move}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
                              <h5 className="text-sm font-black text-blue-600 tracking-tight flex items-center gap-2">
                                <Eye className="h-4.5 w-4.5" />
                                Keep-Open Options
                              </h5>
                              <ul className="space-y-3">
                                {(Array.isArray(selectedItem.windTunnelResults.robustMoves.keepOpen)
                                  ? selectedItem.windTunnelResults.robustMoves.keepOpen
                                  : []
                                ).map((move, idx) => (
                                  <li key={idx} className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex gap-2">
                                    <span className="text-blue-500 shrink-0">•</span>
                                    {move}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
                              <h5 className="text-sm font-black text-rose-600 tracking-tight flex items-center gap-2">
                                <Clock className="h-4.5 w-4.5" />
                                Deferred Actions
                              </h5>
                              <ul className="space-y-3">
                                {(Array.isArray(selectedItem.windTunnelResults.robustMoves.defer)
                                  ? selectedItem.windTunnelResults.robustMoves.defer
                                  : []
                                ).map((move, idx) => (
                                  <li key={idx} className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex gap-2">
                                    <span className="text-rose-500 shrink-0">•</span>
                                    {move}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* REPORT TAB */}
                    {activeTab === "report" && (
                      <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs animate-in fade-in duration-300">
                        {selectedItem.report ? (
                          <div className="prose prose-slate prose-sm md:prose-base max-w-none dark:prose-invert prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-350 prose-p:leading-relaxed prose-strong:text-blue-600 dark:prose-strong:text-blue-400 prose-strong:font-bold prose-ul:list-none prose-ul:pl-0 prose-li:mb-4">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {selectedItem.report}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 italic">
                            <FileWarning className="h-10 w-10 text-slate-300 mb-2" />
                            No report output was saved for this session.
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
