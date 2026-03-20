"use client";

import { useNotes } from "@/hooks/useNotes";
import { useUser } from "@clerk/nextjs";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

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
    <div className="max-w-4xl mx-auto p-4 pt-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Ingest Knowledge</h1>
        <p className="text-white/50">Paste your notes or text content to make them searchable by AI.</p>
      </div>

      <div className="glass-card p-8 space-y-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your notes here..."
          className="w-full h-80 glass-input resize-none bg-white/5 p-6 text-sm leading-relaxed"
        />

        <div className="flex items-center justify-between">
          <div className="text-xs text-white/30 italic">
            Supports plain text, markdown, and code.
          </div>
          <button
            onClick={handleSave}
            disabled={mutation.isPending || !content.trim()}
            className="glass-button flex items-center gap-2"
          >
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Save & Process
          </button>
        </div>

        {successData && (
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 animate-in fade-in zoom-in">
            <CheckCircle2 className="size-5" />
            <span className="text-sm font-medium">
              Notes processed successfully! Stored in {successData.count} chunks.
            </span>
          </div>
        )}

        {mutation.isError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            Error processing notes. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}
