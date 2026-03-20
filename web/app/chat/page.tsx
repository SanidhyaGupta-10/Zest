"use client";

import { useChat } from "@/hooks/useChat";
import { useUser } from "@clerk/nextjs";
import { Send, Loader2, User, Bot, Sparkles, Command } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { user } = useUser();
  const { messages, sendMessage, isLoading } = useChat(user?.id);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-6 px-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            AI Assistant <Sparkles className="size-5 text-blue-400" />
          </h1>
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Powered by Zest Engine</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-wider backdrop-blur-sm shadow-sm group hover:border-blue-500/30 transition-colors">
          <Command className="size-3 group-hover:text-blue-400 transition-colors" />
          Ask about notes
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 glass-card bg-white/[0.02] border-white/5 flex flex-col overflow-hidden shadow-2xl">
        {/* Messages List */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.length === 0 && !isLoading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-20"
              >
                <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 mb-6 relative group">
                  <Bot className="size-12 text-blue-400" />
                  <div className="absolute inset-0 bg-blue-500/20 blur-2xl group-hover:blur-3xl transition-all" />
                </div>
                <h2 className="text-2xl font-black mb-2">Initialize Session</h2>
                <p className="text-gray-400 font-medium max-w-sm">
                  Connect with your knowledge base. Ask questions, extract insights, or just explore your notes.
                </p>
              </motion.div>
            )}

            {messages.map((msg, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex gap-4",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "size-10 rounded-xl flex items-center justify-center shrink-0 border shadow-lg relative z-10",
                  msg.role === "user" 
                    ? "bg-blue-600 border-blue-400/50 shadow-blue-900/40" 
                    : "bg-white/10 border-white/10 shadow-black/40"
                )}>
                  {msg.role === "user" ? <User className="size-5" /> : <Bot className="size-5" />}
                  {msg.role === "ai" && (
                    <div className="absolute inset-0 bg-blue-400/20 blur-lg -z-10" />
                  )}
                </div>

                {/* Bubble */}
                <div className={cn(
                  "relative max-w-[80%] px-5 py-4 rounded-2xl text-sm font-medium leading-[1.6] shadow-sm transition-all duration-300",
                  msg.role === "user" 
                    ? "bg-blue-600 text-white rounded-tr-none hover:bg-blue-500 shadow-blue-900/20" 
                    : "bg-white/5 border border-white/10 text-gray-100 rounded-tl-none hover:bg-white/[0.08] hover:border-white/20 shadow-black/40"
                )}>
                  {msg.content}
                  {msg.role === "ai" && (
                    <div className="absolute -bottom-1 -left-1 size-3 bg-blue-400/10 blur-md rounded-full" />
                  )}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex gap-4"
              >
                <div className="size-10 rounded-xl flex items-center justify-center bg-white/10 border border-white/10 shadow-black/40 shrink-0">
                  <Bot className="size-5 animate-pulse text-blue-400" />
                </div>
                <div className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl rounded-tl-none flex items-center gap-3 text-sm font-bold text-white/30 tracking-widest uppercase">
                  <Loader2 className="size-3 animate-spin text-blue-400" />
                  Processing
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Footer */}
        <div className="p-6 bg-black/40 border-t border-white/5 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="relative group flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                rows={1}
                placeholder="Ask your knowledge base anything..."
                className="w-full glass-input min-h-[56px] py-4 pr-14 resize-none scroll-m-2 bg-white/[0.03] border-white/5 hover:border-white/10 focus:bg-white/[0.05] transition-all"
              />
              <div className="absolute right-4 bottom-4 text-[10px] font-black text-white/20 bg-white/5 px-1.5 py-0.5 rounded uppercase tracking-tighter pointer-events-none border border-white/5">
                ↵
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-[56px] w-[56px] btn-primary !p-0 shadow-blue-900/40 disabled:opacity-20 disabled:scale-100 group transition-all"
            >
              <Send className="size-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </form>
          <p className="mt-4 text-[10px] text-center font-bold text-white/20 uppercase tracking-[0.2em]">
            Press Enter to Send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
