"use client";

/**
 * @file NotesHistoryPage.tsx
 * @description Renders the user's history of generated study notes.
 * Includes a list view and a detailed markdown view for individual notes.
 */

import { useHistory } from "@/hooks/useHistory";
import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock, ChevronRight, ArrowLeft, Copy, Check } from "lucide-react";
import Markdown from "@/components/Markdown";

import { Note } from "@/types/history.types";

/**
 * @web\app\history\notes\page.tsx
 * @description View user's study notes history.
 * @flow useHistory -> notesQuery -> AnimatePresence list -> detailed view
 */
export default function NotesHistoryPage() {
  const { notes: notesQuery } = useHistory();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Memoize notes data to prevent unnecessary re-renders
  const notes = useMemo(() => notesQuery.data || [], [notesQuery.data]);
  const loading = notesQuery.isLoading;

  /**
   * Formats a raw date string into a user-friendly locale string.
   * @param {string} dateString - ISO date string from the server.
   * @returns {string} Formatted date (e.g., "May 23, 10:30 AM").
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
   * Copies text content to the clipboard and provides visual feedback.
   * @param {string} text - The content to copy.
   * @param {string} id - Unique identifier for the copied item to track feedback state.
   */
  const copyToClipboard = useCallback(async (text: string, id: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <BookOpen className="size-5 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Notes History</h1>
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

  // Note Detail View
  if (selectedNote) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <button
            onClick={() => setSelectedNote(null)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="size-5 text-white/60" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black tracking-tight truncate">{selectedNote.topic}</h1>
            <p className="text-sm text-white/40">{formatDate(selectedNote.createdAt)}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-emerald-400">Generated Notes</h2>
            <button
              onClick={() => copyToClipboard(selectedNote.notes, selectedNote.id)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              {copiedId === selectedNote.id ? (
                <Check className="size-4 text-emerald-400" />
              ) : (
                <Copy className="size-4 text-white/40" />
              )}
            </button>
          </div>
          <div className="prose prose-invert max-w-none">
            <Markdown content={selectedNote.notes} />
          </div>
        </motion.div>
      </div>
    );
  }

  // Notes List View
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <BookOpen className="size-5 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Notes History</h1>
        </div>
        <p className="text-gray-400 font-medium max-w-2xl">
          View all study notes you have generated for your topics.
        </p>
      </motion.div>

      {notes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <div className="p-4 rounded-3xl bg-white/5 border border-white/10 inline-flex mb-4">
            <BookOpen className="size-8 text-white/30" />
          </div>
          <h3 className="text-xl font-black text-white/60 mb-2">No Notes Yet</h3>
          <p className="text-white/40">
            Generate notes in the Notes tab to see them here.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {notes.map((note: Note, idx: number) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedNote(note)}
                className="glass-card p-6 cursor-pointer group hover:border-emerald-500/40 hover:bg-white/4 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                      <BookOpen className="size-5 text-emerald-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-bold truncate">{note.topic}</h3>
                      <div className="flex items-center gap-2 text-sm text-white/40 mt-1">
                        <Clock className="size-3" />
                        <span>{formatDate(note.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-white/20 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
