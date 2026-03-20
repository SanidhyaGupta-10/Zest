"use client";

import { useNotes } from "@/hooks/useNotes";
import { useUser } from "@clerk/nextjs";
import { Save, Loader2, CheckCircle2, Sparkles, FileText, Upload, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotesPage() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [successData, setSuccessData] = useState<{ count: number } | null>(null);
  const mutation = useNotes(user?.id);

  const handleSave = async () => {
    if (!content.trim() || mutation.isPending) return;
    
    mutation.mutate(content, {
      onSuccess: (res) => {
        setSuccessData({ count: res.data.chunks || 0 });
        setContent("");
        setTimeout(() => setSuccessData(null), 5000);
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <FileText className="size-5 text-blue-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Ingest Knowledge</h1>
        </div>
        <p className="text-gray-400 font-medium max-w-2xl">
          Upload or paste your research notes, documents, or raw text. Our AI will 
          process and index them for intelligent retrieval.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Area */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="glass-card bg-white/[0.02] border-white/5 p-1 overflow-hidden group focus-within:border-blue-500/30 transition-colors">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-red-500/40" />
                <div className="size-2 rounded-full bg-amber-500/40" />
                <div className="size-2 rounded-full bg-emerald-500/40" />
              </div>
              <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Markdown Editor</div>
              <div className="flex gap-2">
                 <button className="p-1 px-2 rounded bg-white/5 border border-white/5 text-[10px] text-white/30 hover:text-white transition-colors">MD</button>
                 <button className="p-1 px-2 rounded bg-white/5 border border-white/5 text-[10px] text-white/30 hover:text-white transition-colors">TXT</button>
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing or paste your content here..."
              className="w-full h-[500px] bg-transparent p-8 focus:outline-none text-gray-200 leading-relaxed font-mono text-sm placeholder:text-white/10"
            />
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">
              <div className="flex items-center gap-1.5 line-clamp-1">
                <Upload className="size-3" />
                Auto-saving disabled
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-3" />
                Encrypted at rest
              </div>
            </div>
            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
              {content.length} characters
            </div>
          </div>
        </motion.div>

        {/* Sidebar Actions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="glass-card bg-white/[0.03] border-white/10 p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
              Processing Pipeline <Sparkles className="size-4 text-amber-400" />
            </h3>
            
            <div className="space-y-4 mb-8">
              {[
                "Neural Chunking",
                "Vector Embedding",
                "Entity Recognition",
                "Knowledge Linking"
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="size-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400">
                    {idx + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-400">{step}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleSave}
              disabled={mutation.isPending || !content.trim()}
              className="w-full btn-primary py-4 text-sm font-bold shadow-blue-900/40 relative overflow-hidden group/btn disabled:opacity-30"
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              {mutation.isPending ? (
                <span className="flex items-center gap-3 justify-center">
                  <Loader2 className="size-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-3 justify-center">
                  <Save className="size-4" />
                  Process Knowledge
                </span>
              )}
            </button>
          </div>

          <AnimatePresence>
            {successData && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-950/20"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-black text-sm uppercase tracking-wider mb-1">Index Updated</div>
                    <p className="text-xs text-emerald-400/70 font-medium">
                      Knowledge successfully integrated into {successData.count} neural chunks. 
                      You can now reference this in Chat.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {mutation.isError && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 shadow-lg"
              >
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest mb-1">
                  Pipeline Error
                </div>
                <p className="text-xs font-medium text-red-400/70">
                  Integration failed. Please check your connection or text format.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
