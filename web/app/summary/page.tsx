"use client";

import { useSummary } from "@/hooks/useSummary";
import { useUser } from "@clerk/nextjs";
import { FileText, Loader2, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function SummaryPage() {
  const { user } = useUser();
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const mutation = useSummary(user?.id);

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
    <div className="max-w-4xl mx-auto p-4 pt-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Summarizer</h1>
        <p className="text-white/50">Condense long articles or notes into concise summaries.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="glass-card p-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text to summarize..."
            className="w-full h-60 glass-input resize-none bg-white/5 p-6 text-sm"
          />
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSummarize}
              disabled={mutation.isPending || !text.trim()}
              className="glass-button flex items-center gap-2"
            >
              {mutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <FileText className="size-4" />
              )}
              Generate Summary
            </button>
          </div>
        </div>

        {summary && (
          <div className="glass-card p-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Summary Output</h2>
              <button 
                onClick={copyToClipboard}
                className="text-white/40 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check className="size-4 text-green-400" /> : <Copy className="size-4" />}
              </button>
            </div>
            <div className="prose prose-invert max-w-none text-white/80 leading-relaxed">
              {summary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
