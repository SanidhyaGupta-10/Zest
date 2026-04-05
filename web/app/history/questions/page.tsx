"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Clock, ChevronRight, ArrowLeft, Copy, Check, Sparkles } from "lucide-react";
import { aiApi } from "@/lib/api";

interface QuestionItem {
  id: number;
  question: string;
  difficulty: string;
  category: string;
}

interface Question {
  id: string;
  topic: string;
  questions: QuestionItem[];
  createdAt: string;
}

export default function QuestionsHistoryPage() {
  const { userId, getToken } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await aiApi.getUserQuestions(token || undefined);
        if (response.data?.questions) {
          setQuestions(response.data.questions);
        }
      } catch (err) {

      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [userId, getToken]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <HelpCircle className="size-5 text-blue-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Questions History</h1>
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

  // Questions Detail View
  if (selectedQuestion) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <button
            onClick={() => setSelectedQuestion(null)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="size-5 text-white/60" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black tracking-tight truncate">{selectedQuestion.topic}</h1>
            <p className="text-sm text-white/40">
              {selectedQuestion.questions.length} questions · {formatDate(selectedQuestion.createdAt)}
            </p>
          </div>
        </motion.div>

        <div className="space-y-6">
          <AnimatePresence>
            {selectedQuestion.questions.map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card p-8 flex gap-6 group"
              >
                <div className="shrink-0">
                  <div className="size-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-sm font-black text-blue-400 shadow-inner">
                    {idx + 1}
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {q.difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {q.category}
                    </span>
                  </div>
                  <p className="text-lg text-gray-100 font-medium leading-relaxed">
                    {q.question}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Questions List View
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <HelpCircle className="size-5 text-blue-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Questions History</h1>
        </div>
        <p className="text-gray-400 font-medium max-w-2xl">
          View all quiz questions you have generated for your study topics.
        </p>
      </motion.div>

      {questions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <div className="p-4 rounded-3xl bg-white/5 border border-white/10 inline-flex mb-4">
            <Sparkles className="size-8 text-white/30" />
          </div>
          <h3 className="text-xl font-black text-white/60 mb-2">No Questions Yet</h3>
          <p className="text-white/40">
            Generate quiz questions in the Questions tab to see them here.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {questions.map((question, idx) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedQuestion(question)}
                className="glass-card p-6 cursor-pointer group hover:border-blue-500/40 hover:bg-white/4 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 shrink-0">
                      <HelpCircle className="size-5 text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-bold truncate">{question.topic}</h3>
                      <div className="flex items-center gap-3 text-sm text-white/40 mt-1">
                        <span>{question.questions.length} questions</span>
                        <span>·</span>
                        <Clock className="size-3" />
                        <span>{formatDate(question.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-white/20 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
