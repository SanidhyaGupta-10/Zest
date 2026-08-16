"use client";

import { useUser } from "@clerk/nextjs";
import { Send, Loader2, User, Copy, Plus, ChevronDown, Mic, AudioWaveform, Zap, Sparkles } from "lucide-react";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Markdown from "@/components/Markdown";
import { useChat } from "@/hooks/useChat";

function ChatContent() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");
  const { messages, sendMessage, isLoading } = useChat();
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("Sonnet 5 Max");
  const [showModelMenu, setShowModelMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasTriggeredInitialQuery = useRef(false);

  useEffect(() => {
    if (initialQuery && !hasTriggeredInitialQuery.current && messages.length === 0) {
      hasTriggeredInitialQuery.current = true;
      sendMessage(initialQuery);
    }
  }, [initialQuery, messages.length, sendMessage]);

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
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto px-2 md:px-4 text-[#f8fafc]">
      {/* Conversation Stream */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto py-6 px-2 md:px-4 space-y-8 scroll-smooth"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {messages.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center py-20"
              >
                <div className="size-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  <Zap className="size-6 text-cyan-400 fill-cyan-400" />
                </div>
                <h2 className="text-3xl font-extrabold mb-2 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Zest AI Workspace</h2>
                <p className="text-gray-400 text-sm max-w-md">
                  Ask any questions, synthesize notes, analyze code, or write complex documents.
                </p>
              </motion.div>
            )}

            {messages.map((msg: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4 group/msg",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "size-8 rounded-xl flex items-center justify-center shrink-0 border text-xs font-semibold shadow-md",
                  msg.role === "user"
                    ? "bg-cyan-600/30 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                    : "bg-purple-600/30 border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                )}>
                  {msg.role === "user" ? (
                    <User className="size-4 text-cyan-300" />
                  ) : (
                    <Sparkles className="size-4 text-purple-300" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={cn(
                  "relative text-sm leading-relaxed max-w-[85%] rounded-2xl p-4 transition-all backdrop-blur-xl",
                  msg.role === "user"
                    ? "bg-[#0f172a]/90 border border-cyan-500/20 text-gray-100 shadow-md"
                    : "bg-white/[0.03] border border-white/10 text-gray-100 flex-1 shadow-lg"
                )}>
                  {msg.role === "ai" ? (
                    <div className="relative group/content">
                      <Markdown content={msg.content} />
                      <button
                        onClick={() => copyToClipboard(msg.content)}
                        className="absolute -right-2 -top-2 opacity-0 group-hover/content:opacity-100 p-1.5 bg-white/10 border border-white/10 rounded-lg transition-all text-gray-400 hover:text-white"
                        title="Copy text"
                      >
                        <Copy className="size-3" />
                      </button>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 items-start"
              >
                <div className="size-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                  <Sparkles className="size-4 text-purple-300 animate-pulse" />
                </div>
                <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs text-gray-400">
                  <Loader2 className="size-4 animate-spin text-cyan-400" />
                  <span>Analyzing context...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Input Dock */}
        <div className="pt-3 pb-4">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="glass-prompt-box p-3.5 flex flex-col justify-between min-h-[90px] relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                rows={2}
                placeholder="Message Zest AI..."
                className="w-full bg-transparent text-[#f8fafc] placeholder-gray-500 text-sm focus:outline-none resize-none font-sans"
              />

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 relative">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowModelMenu(!showModelMenu)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-gray-300 hover:text-white hover:bg-white/[0.08] transition-colors font-medium cursor-pointer"
                    >
                      <span className="text-cyan-400">●</span>
                      <span>{selectedModel}</span>
                      <ChevronDown className="size-3 text-gray-400" />
                    </button>

                    {showModelMenu && (
                      <div className="absolute right-0 bottom-full mb-2 w-48 bg-[#0b1329]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 py-1 text-xs">
                        {["Sonnet 5 Max", "GPT-4o Turbo", "Gemini 1.5 Pro", "Claude 3.7 Sonnet"].map((model) => (
                          <button
                            key={model}
                            type="button"
                            onClick={() => {
                              setSelectedModel(model);
                              setShowModelMenu(false);
                            }}
                            className="w-full text-left px-3.5 py-2 text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-between font-medium"
                          >
                            <span>{model}</span>
                            {selectedModel === model && <span className="text-cyan-400 font-bold">✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Mic className="size-4" />
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="p-1.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-30 transition-all cursor-pointer"
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-6 animate-spin text-cyan-400" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}


