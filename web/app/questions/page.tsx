"use client";

import { useQuestions } from "@/hooks/useQuestions";
import { useUser } from "@clerk/nextjs";
import { HelpCircle, Loader2, Sparkles, AlertCircle, Command, Trash2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuestionsPage() {
  const { user } = useUser();
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const mutation = useQuestions();

  const handleGenerate = async () => {
    if (!topic.trim() || mutation.isPending) return;

    mutation.mutate(topic, {
      onSuccess: (res: string | string[]) => {
        const qList = Array.isArray(res) ? res : [res as string];
        setQuestions(qList);
      }
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
          <HelpCircle className="size-6 text-emerald-400" />
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-4">Quiz Architect</h1>
        <p className="text-gray-400 font-medium max-w-2xl mx-auto">
          Transform your knowledge into practice. Generate challenging quiz
          questions tailored to your specific topics or study materials.
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-2 mb-12 bg-white/[0.02] border-white/5 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What topic should we test you on?"
              className="w-full glass-input h-16 border-none bg-transparent focus:ring-0 text-lg font-medium pl-6"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-black text-white/20 uppercase tracking-widest pointer-events-none">
              <Command className="size-3" /> Area of Focus
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={mutation.isPending || !topic.trim()}
            className="btn-primary h-16 px-10 text-sm font-bold shadow-blue-900/40 min-w-[220px]"
          >
            {mutation.isPending ? (
              <span className="flex items-center gap-3">
                <Loader2 className="size-4 animate-spin" />
                Architecting...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Sparkles className="size-4" />
                Generate Quiz
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Questions List */}
      <AnimatePresence>
        {questions.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter">
                Knowledge Check <span className="text-blue-500 text-sm font-black bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">{questions.length} Items</span>
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setQuestions([])}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/30 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/20 transition-all"
                  title="Clear all"
                >
                  <Trash2 className="size-4" />
                </button>
                <button
                  onClick={handleGenerate}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/30 hover:text-blue-400 hover:bg-blue-400/10 hover:border-blue-400/20 transition-all"
                  title="Regenerate"
                >
                  <RotateCcw className="size-4" />
                </button>
              </div>
            </div>

            {questions.map((q, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="glass-card p-8 flex gap-6 group hover:border-blue-500/40 hover:bg-white/[0.04] transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="shrink-0">
                  <div className="size-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-sm font-black text-blue-400 shadow-inner">
                    {idx + 1}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <p className="text-lg text-gray-100 font-medium leading-relaxed pt-1 select-none cursor-default">
                    {q}
                  </p>

                  <div className="flex items-center gap-6 pt-2">
                    <button className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-blue-400 transition-colors flex items-center gap-1.5">
                      Reveal Hint
                    </button>
                    <button className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      Check Solution
                    </button>
                  </div>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="size-2 rounded-full bg-blue-500 animate-pulse" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {mutation.isError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 border-red-500/20 bg-red-500/5 mt-8"
          >
            <div className="flex gap-4">
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 h-fit">
                <AlertCircle className="size-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-red-400 mb-2 uppercase tracking-tighter leading-none">Generation Failed</h3>
                <p className="text-sm font-medium text-red-400/60 leading-relaxed">
                  We couldn't generate questions for this topic. Please ensure you have
                  processed relevant notes in the "Notes" section first, or try a different topic.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
