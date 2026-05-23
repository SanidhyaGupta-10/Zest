"use client";

/**
 * @file SummariesHistoryPage.tsx
 * @description Renders the user's history of generated summaries.
 * Provides a list view and a detailed view to compare original content with the summary.
 */

import { useHistory } from "@/hooks/useHistory";
import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Clock, ChevronRight, ArrowLeft, Copy, Check } from "lucide-react";
import Markdown from "@/components/Markdown";

import { Summary } from "@/types/history.types";

/**
 * @web\app\history\summaries\page.tsx
 * @description View user's summary generation history.
 * @flow useHistory -> summariesQuery -> AnimatePresence list -> detailed view
 */
export default function SummariesHistoryPage() {
  const { summaries: summariesQuery } = useHistory();
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Memoize data to prevent redundant calculations
  const summaries = useMemo(() => summariesQuery.data || [], [summariesQuery.data]);
  const loading = summariesQuery.isLoading;

  /**
   * Formats an ISO date string for display.
   * @param {string} dateString - The date string from the server.
   * @returns {string} Formatted date.
   */
  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  /**
   * Utility to copy text to clipboard with feedback state.
   */
  const copyToClipboard = useCallback(async (text: string, id: string): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  /**
   * Shortens long text for the preview list.
   * @param {string} text - The text to truncate.
   * @param {number} maxLength - Maximum allowed length.
   * @returns {string} Truncated text with ellipsis.
   */
  const truncateText = useCallback((text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <FileText className="size-5 text-amber-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Summary History</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-6 bg-white/5 rounded w-1/3 mb-3" />
              <div className="h-4 bg-white/5 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Summary Detail View
  if (selectedSummary) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <button
            onClick={() => setSelectedSummary(null)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="size-5 text-white/60" />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Summary Details</h1>
            <p className="text-sm text-white/40">{formatDate(selectedSummary.createdAt)}</p>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Original Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Original Content</h2>
              <button
                onClick={() => copyToClipboard(selectedSummary.content, "content")}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                {copiedId === "content" ? (
                  <Check className="size-4 text-emerald-400" />
                ) : (
                  <Copy className="size-4 text-white/40" />
                )}
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto">
              <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedSummary.content}
              </p>
            </div>
          </motion.div>

          {/* Generated Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-amber-400">Generated Summary</h2>
              <button
                onClick={() => copyToClipboard(selectedSummary.result, "result")}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                {copiedId === "result" ? (
                  <Check className="size-4 text-emerald-400" />
                ) : (
                  <Copy className="size-4 text-white/40" />
                )}
              </button>
            </div>
            <div className="prose prose-invert max-w-none">
              <Markdown content={selectedSummary.result} />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Summary List View
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <FileText className="size-5 text-amber-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Summary History</h1>
        </div>
        <p className="text-gray-400 font-medium max-w-2xl">
          View all summaries you have generated from your study materials.
        </p>
      </motion.div>

      {summaries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <div className="p-4 rounded-3xl bg-white/5 border border-white/10 inline-flex mb-4">
            <FileText className="size-8 text-white/30" />
          </div>
          <h3 className="text-xl font-black text-white/60 mb-2">No Summaries Yet</h3>
          <p className="text-white/40">
            Generate summaries in the Summary tab to see them here.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {summaries.map((summary: Summary, idx: number) => (
              <motion.div
                key={summary.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedSummary(summary)}
                className="glass-card p-6 cursor-pointer group hover:border-amber-500/40 hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
                      <FileText className="size-5 text-amber-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white/80 font-medium truncate">
                        {truncateText(summary.content, 80)}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-white/40 mt-1">
                        <Clock className="size-3" />
                        <span>{formatDate(summary.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-white/20 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
