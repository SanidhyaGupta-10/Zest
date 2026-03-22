"use client";

import { useUser } from "@clerk/nextjs";
import { Send, Loader2, User, Bot, Sparkles, Command, Copy } from "lucide-react";
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Markdown from "@/components/Markdown";
import { useChat } from "@/hooks/useChat"
import { BackButton } from "@/components/BackButton";

export default function ChatPage() {
  const { user } = useUser();
  const { messages, sendMessage, isLoading } = useChat();
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto px-4">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4">
        <BackButton />
      </div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center border border-white/20 shadow-blue-500/10">
            <Sparkles className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2">
              AI ASSISTANT
            </h1>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Neural Engine v1.0.4</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-widest backdrop-blur-md shadow-sm group hover:border-blue-500/30 transition-all cursor-pointer">
          <div className="size-2 rounded-full bg-green-500 animate-pulse" />
          READY FOR INPUT
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 glass-card bg-white/2 border-white/5 flex flex-col overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] rounded-[2.5rem]">
        {/* Messages List */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-10 scroll-smooth"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {messages.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center py-20"
              >
                <div className="p-8 rounded-4xl bg-linear-to-br from-blue-500/10 to-purple-500/10 border border-white/10 mb-8 relative group">
                  <Bot className="size-16 text-blue-400 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-blue-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h2 className="text-3xl font-black mb-4 tracking-tighter uppercase italic">Ready to assist</h2>
                <p className="text-gray-400 text-lg font-medium max-w-sm leading-relaxed">
                  I can analyze your notes, summarize documents, or answer any technical questions.
                </p>
                <div className="mt-8 flex gap-2">
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 font-bold uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-colors">"Summarize my recent notes"</div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 font-bold uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-colors">"Explain React hooks"</div>
                </div>
              </motion.div>
            )}

            {messages.map((msg: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-6 group/msg",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "size-10 md:size-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-xl relative z-10 transition-transform duration-300",
                  msg.role === "user"
                    ? "bg-blue-600 border-blue-400/50 shadow-blue-900/40"
                    : "bg-white/10 border-white/10 shadow-black/40 group-hover/msg:scale-110"
                )}>
                  {msg.role === "user" ? <User className="size-5 md:size-6" /> : <Bot className="size-5 md:size-6" />}
                  {msg.role === "ai" && (
                    <div className="absolute inset-0 bg-blue-400/20 blur-xl -z-10 animate-pulse" />
                  )}
                </div>

                {/* Bubble */}
                <div className={cn(
                  "relative px-4 md:px-8 py-3 md:py-6 rounded-3xl text-sm transition-all duration-300",
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none hover:bg-blue-500 shadow-blue-900/20 max-w-[80%]"
                    : "bg-white/3 border border-white/5 text-gray-100 rounded-tl-none hover:bg-white/5 hover:border-white/10 flex-1 max-w-[90%]"
                )}>
                  {msg.role === "ai" ? (
                    <div className="relative">
                      <Markdown content={msg.content} />
                      <button
                        onClick={() => copyToClipboard(msg.content)}
                        className="absolute -right-2 top-0 opacity-0 group-hover/msg:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all text-white/30 hover:text-white"
                        title="Copy message"
                      >
                        <Copy className="size-3" />
                      </button>
                    </div>
                  ) : (
                    <p className="font-semibold text-base md:text-lg leading-relaxed">{msg.content}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-6 items-start"
              >
                <div className="size-12 rounded-2xl flex items-center justify-center bg-white/10 border border-white/10 shadow-black/40 shrink-0">
                  <Bot className="size-6 text-blue-400 animate-pulse" />
                </div>
                <div className="bg-white/5 border border-white/10 px-8 py-6 rounded-3xl rounded-tl-none flex items-center gap-4 text-xs font-black text-white/30 tracking-[0.4em] uppercase overflow-hidden">
                  <div className="relative">
                    <Loader2 className="size-4 animate-spin text-blue-400" />
                    <div className="absolute inset-0 bg-blue-400/20 blur-lg" />
                  </div>
                  Analyzing context...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Footer */}
        <div className="p-4 md:p-8 bg-black/60 border-t border-white/5 backdrop-blur-3xl">
          <form onSubmit={handleSubmit} className="relative group max-w-4xl mx-auto flex items-end gap-4">
            <div className="flex-1 relative group/input">
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
                placeholder="Message AI Assistant..."
                className="w-full glass-input min-h-16 py-5 px-8 pr-16 resize-none bg-white/3 border-white/5 hover:border-white/20 focus:bg-white/5 transition-all rounded-4xl shadow-inner text-lg placeholder:text-white/20"
              />
              <div className="absolute right-6 bottom-5 flex gap-2 items-center">
                <div className="text-[10px] font-black text-white/10 bg-white/5 px-2 py-1 rounded uppercase tracking-tighter opacity-0 group-hover/input:opacity-100 transition-opacity">
                  Shift + Enter for new line
                </div>
                <div className="text-[10px] font-black text-white/30 bg-white/5 px-2 py-1 rounded uppercase tracking-tighter border border-white/5 shadow-sm">
                  ENTER ↵
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="size-16 btn-primary p-0! shadow-blue-900/40 disabled:opacity-20 disabled:scale-100 group transition-all rounded-4xl flex items-center justify-center relative overflow-hidden active:scale-95"
            >
              <Send className="size-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </form>
          <p className="mt-4 text-[9px] text-center font-black text-white/10 uppercase tracking-[0.4em]">
            Precision Processed by Zest Intelligence • High Speed RAG Mode Enabled
          </p>
        </div>
      </div>
    </div>
  );
}
