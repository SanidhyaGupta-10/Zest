"use client";

import { useQuestions } from "@/hooks/useQuestions";
import { useUser } from "@clerk/nextjs";
import { HelpCircle, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function QuestionsPage() {
  const { user } = useUser();
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const mutation = useQuestions(user?.id);

  const handleGenerate = async () => {
    if (!topic.trim() || mutation.isPending) return;
    
    mutation.mutate(topic, {
      onSuccess: (res) => {
        setQuestions(Array.isArray(res) ? res : [res as string]);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pt-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Quiz Generator</h1>
        <p className="text-white/50">Generate thought-provoking questions from any topic or text.</p>
      </div>

      <div className="glass-card p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic or paste text..."
            className="flex-1 glass-input h-14"
          />
          <button
            onClick={handleGenerate}
            disabled={mutation.isPending || !topic.trim()}
            className="glass-button-primary flex items-center justify-center gap-2 h-14 min-w-[180px]"
          >
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            Generate Quiz
          </button>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-2xl font-bold mb-6 px-2">Generated Questions</h2>
          {questions.map((q, idx) => (
            <div key={idx} className="glass-card p-6 flex gap-4">
              <span className="text-blue-400 font-black text-lg">Q{idx + 1}.</span>
              <p className="text-white/80 leading-relaxed pt-0.5">{q}</p>
            </div>
          ))}
        </div>
      )}

      {mutation.isError && (
        <div className="glass-card p-6 flex items-center gap-4 text-red-400 border-red-500/20">
          <AlertCircle className="size-6 shrink-0" />
          <p>Failed to generate questions. Please make sure you have ingested relevant notes first.</p>
        </div>
      )}
    </div>
  );
}
