"use client";

import { useSummary } from "@/hooks/useSummary";
import { useUser } from "@clerk/nextjs";
import { FileText, Loader2, Copy, Check, Sparkles, Brain, Zap } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SummaryPage() {
  const { user } = useUser();
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const mutation = useSummary();

  const handleSummarize = async () => {
    if (!text.trim() || mutation.isPending) return;
    
    mutation.mutate(text, {
      onSuccess: (res) => {
        setSummary(res as string);
      }
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6">
          <Brain className="size-6 text-amber-400" />
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-4">Neural Summarizer</h1>
        <p className="text-gray-400 font-medium max-w-2xl mx-auto">
          Distill complex information into actionable insights. Our AI identifies 
          key points and preserves context with high fidelity.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-12">
        {/* Input Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card bg-white/[0.02] border-white/5 p-8 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl -z-10" />
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your source text here (articles, notes, lectures)..."
            className="w-full h-64 bg-transparent resize-none focus:outline-none text-gray-200 leading-relaxed font-medium text-lg placeholder:text-white/10 scrollbar-none"
          />
          
          <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                 <Zap className="size-3 text-amber-400" /> Fast Mode
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                 <Sparkles className="size-3 text-blue-400" /> High Precision
               </div>
            </div>
            
            <button
              onClick={handleSummarize}
              disabled={mutation.isPending || !text.trim()}
              className="btn-primary py-3 px-8 text-sm font-bold shadow-blue-900/40"
            >
              {mutation.isPending ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="size-4 animate-spin" />
                  Analyzing
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <FileText className="size-4" />
                  Generate Summary
                </span>
              )}
            </button>
          </div>
        </motion.div>

        {/* Output Card */}
        <AnimatePresence>
          {summary && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass-card bg-white/[0.03] border-white/10 p-10 shadow-2xl relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-purple-500 to-amber-500" />
              
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="size-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  <h2 className="text-xl font-black uppercase tracking-tighter">Executive Summary</h2>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/40 hover:text-white hover:bg-white/10 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="size-3 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy Summary</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-gray-200 leading-[1.8] font-medium whitespace-pre-wrap">
                    {summary}
                  </p>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-wrap gap-3">
                  <div className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">Actionable</div>
                  <div className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-black text-purple-400 uppercase tracking-widest">Context Preserved</div>
                  <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black text-amber-400 uppercase tracking-widest">High Accuracy</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
