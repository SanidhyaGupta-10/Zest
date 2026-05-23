"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, MessageSquare, Send, Mic, Paperclip, Sparkles, Bot,
  User, Copy, ChevronLeft, PanelLeftClose, PanelLeftOpen,
  MoreHorizontal, Trash2, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Markdown from "@/components/Markdown";
import { useChat } from "@/hooks/useChat";
import { useUser } from "@clerk/nextjs";
import { ChatSession } from "@/types/components.types";
import { Message } from "@/types/hooks.types";

/* ─── Mock chat history (replace with real API later) ─── */
const MOCK_HISTORY: ChatSession[] = [
  { id: "1", title: "React hooks explained",         preview: "Can you explain useState...",    time: "2m ago"   },
  { id: "2", title: "Summarize lecture notes",       preview: "Here's my lecture PDF...",       time: "1h ago"   },
  { id: "3", title: "JavaScript async patterns",     preview: "What's the difference...",       time: "3h ago"   },
  { id: "4", title: "Quiz on photosynthesis",        preview: "Generate 10 questions...",       time: "Yesterday" },
  { id: "5", title: "Machine learning basics",       preview: "Explain gradient descent...",    time: "2 days ago" },
  { id: "6", title: "Essay structure tips",          preview: "How do I write a strong...",     time: "3 days ago" },
  { id: "7", title: "Python list comprehensions",    preview: "Show me examples of...",         time: "4 days ago" },
  { id: "8", title: "Data structures overview",      preview: "What are the most common...",   time: "1 week ago" },
];

const SUGGESTED_PROMPTS = [
  { label: "Summarize my recent notes",    icon: "📝" },
  { label: "Explain React hooks",          icon: "⚛️" },
  { label: "Create a study quiz",          icon: "🧠" },
  { label: "Analyze a document",           icon: "📄" },
];

/* ─── Typing Indicator ────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex gap-4 items-start chat-message-enter">
      <div className="size-9 rounded-2xl flex items-center justify-center bg-white/10 border border-white/10 shadow-black/40 shrink-0 relative">
        <Bot className="size-5 text-blue-400 animate-pulse" />
        <div className="absolute inset-0 bg-blue-400/20 blur-xl -z-10" />
      </div>
      <div className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl rounded-tl-none flex items-center gap-2">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

/* ─── Single Message Bubble ───────────────────────────── */
function MessageBubble({ msg, onCopy }: { msg: Message; onCopy: (text: string) => void }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";

  const handleCopy = () => {
    onCopy(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex gap-3 group/msg chat-message-enter", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div className={cn(
        "size-9 rounded-2xl flex items-center justify-center shrink-0 border shadow-xl relative z-10 transition-all duration-300",
        isUser
          ? "bg-blue-600 border-blue-400/40 shadow-blue-900/30"
          : "bg-white/10 border-white/10 shadow-black/40 group-hover/msg:scale-105"
      )}>
        {isUser
          ? <User className="size-4" />
          : <Bot  className="size-4" />}
        {!isUser && <div className="absolute inset-0 bg-blue-400/15 blur-lg -z-10 animate-pulse" />}
      </div>

      {/* Bubble */}
      <div className={cn(
        "relative px-5 py-4 rounded-2xl text-sm leading-relaxed transition-all duration-200 max-w-[80%]",
        isUser
          ? "bg-blue-600 text-white rounded-tr-none shadow-blue-900/20 hover:bg-blue-500"
          : "bg-white/[0.04] border border-white/[0.07] text-gray-100 rounded-tl-none hover:bg-white/[0.07] hover:border-white/10 flex-1"
      )}>
        {isUser ? (
          <p className="font-medium text-base leading-relaxed">{msg.content}</p>
        ) : (
          <div className="relative">
            <Markdown content={msg.content} />
            <button
              onClick={handleCopy}
              className="absolute -right-1 -top-1 opacity-0 group-hover/msg:opacity-100 p-1.5 hover:bg-white/10 rounded-lg transition-all text-white/30 hover:text-white"
              title="Copy message"
            >
              {copied ? <Check className="size-3 text-green-400" /> : <Copy className="size-3" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Auto-resizing Textarea ──────────────────────────── */
function AutoTextarea({
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = Math.min(ref.current.scrollHeight, 160) + "px";
  }, [value]);

  return (
    <textarea
      ref={ref}
      id="chat-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      disabled={disabled}
      rows={1}
      placeholder={placeholder}
      className="auto-resize-textarea w-full glass-input py-4 px-5 pr-28 bg-white/[0.04] border-white/[0.07] hover:border-white/20 focus:bg-white/[0.06] transition-all rounded-2xl text-base placeholder:text-white/25 leading-relaxed"
    />
  );
}

/* ─── Welcome / Empty State ───────────────────────────── */
function WelcomeScreen({
  userName,
  onSuggest,
}: {
  userName?: string | null;
  onSuggest: (text: string) => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 chat-welcome-enter">
      {/* Animated logo */}
      <div className="relative mb-8 group cursor-default">
        <div className="p-6 rounded-3xl bg-linear-to-br from-blue-500/15 to-purple-500/15 border border-white/10 relative overflow-hidden">
          <Sparkles className="size-14 text-blue-400 group-hover:scale-110 transition-transform duration-500 relative z-10" />
          <div className="absolute inset-0 bg-blue-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        {/* Orbiting dots */}
        <div className="absolute -top-1 -right-1 size-3 rounded-full bg-blue-400 animate-ping opacity-60" />
        <div className="absolute -bottom-1 -left-1 size-2 rounded-full bg-purple-400 animate-pulse" />
      </div>

      <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-3">
        {userName ? `Hello, ${userName.split(" ")[0]} 👋` : "Hello there 👋"}
      </h2>
      <p className="text-gray-400 text-lg font-medium mb-2 max-w-md leading-relaxed">
        I&apos;m your AI knowledge assistant.
      </p>
      <p className="text-gray-500 text-sm mb-10 max-w-sm">
        Ask me anything — summarize notes, explain concepts, generate quizzes, or just chat.
      </p>

      {/* Suggested prompts */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
        {SUGGESTED_PROMPTS.map((p) => (
          <button
            key={p.label}
            onClick={() => onSuggest(p.label)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20 text-left text-sm font-medium text-white/70 hover:text-white transition-all duration-200 group"
          >
            <span className="text-lg shrink-0 group-hover:scale-110 transition-transform">{p.icon}</span>
            <span className="leading-snug">{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Chat History Sidebar ────────────────────────────── */
function ChatHistorySidebar({
  open,
  onClose,
  activeId,
  onSelect,
  onNewChat,
  isMobileOverlay,
}: {
  open: boolean;
  onClose: () => void;
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  isMobileOverlay?: boolean;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const content = (
    <div className="flex flex-col h-full py-4">
      {/* Header */}
      <div className="px-3 mb-4 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-widest text-white/30">
          History
        </span>
        {isMobileOverlay && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
          >
            <ChevronLeft className="size-4" />
          </button>
        )}
      </div>

      {/* New Chat */}
      <div className="px-3 mb-4">
        <button
          id="new-chat-btn"
          onClick={onNewChat}
          className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl btn-glass text-sm font-bold hover:border-blue-500/30 hover:bg-white/10 transition-all duration-200 justify-center group"
        >
          <Plus className="size-4 group-hover:rotate-90 transition-transform duration-300" />
          New Chat
        </button>
      </div>

      {/* History list */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 px-2 mb-2">Recent</p>
        {MOCK_HISTORY.map((session) => {
          const isActive = session.id === activeId;
          return (
            <div
              key={session.id}
              className="relative group/item"
              onMouseEnter={() => setHoveredId(session.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <button
                onClick={() => onSelect(session.id)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 relative",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white/80"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-chat-bg"
                    className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-500/10 via-transparent to-transparent pointer-events-none"
                  />
                )}
                <div className="flex items-start gap-2.5 relative z-10">
                  <MessageSquare className={cn(
                    "size-4 mt-0.5 shrink-0 transition-colors",
                    isActive ? "text-blue-400" : "text-white/30"
                  )} />
                  <div className="min-w-0 flex-1">
                    <p className={cn(
                      "text-sm font-semibold truncate leading-tight",
                      isActive ? "text-white" : "text-white/70"
                    )}>
                      {session.title}
                    </p>
                    <p className="text-xs text-white/30 truncate mt-0.5 font-medium">
                      {session.time}
                    </p>
                  </div>
                </div>
              </button>

              {/* Delete button on hover */}
              <AnimatePresence>
                {hoveredId === session.id && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/10 text-white/25 hover:text-red-400 transition-all"
                    title="Delete conversation"
                  >
                    <Trash2 className="size-3" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (isMobileOverlay) {
    return (
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed left-0 top-0 h-full w-72 bg-slate-950/95 border-r border-white/10 z-50 shadow-2xl backdrop-blur-xl"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop sidebar
  return (
    <div
      className={cn(
        "chat-sidebar h-full border-r border-white/[0.06] bg-black/30 backdrop-blur-xl shrink-0 overflow-hidden hidden md:block",
        open ? "w-64" : "w-0"
      )}
    >
      <div className={cn(
        "w-64 h-full transition-opacity duration-200",
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        {content}
      </div>
    </div>
  );
}

/* ─── Main ChatLayout Component ───────────────────────── */
export default function ChatLayout() {
  const { user } = useUser();
  const { messages, sendMessage, isLoading } = useChat();

  const [input, setInput]                 = useState("");
  const [sidebarOpen, setSidebarOpen]     = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Keyboard shortcut: Ctrl/Cmd + B → toggle sidebar
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setSidebarOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  }, [input, isLoading, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggest = (text: string) => {
    setInput(text);
    // Focus input after suggestion
    setTimeout(() => {
      const el = document.getElementById("chat-input") as HTMLTextAreaElement;
      el?.focus();
    }, 50);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    // Could clear messages here if wired to real session management
  };

  return (
    <div className="flex h-full overflow-hidden">

      {/* ── Desktop Chat History Sidebar ─────────────── */}
      <ChatHistorySidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeId={activeSessionId}
        onSelect={setActiveSessionId}
        onNewChat={handleNewChat}
        isMobileOverlay={false}
      />

      {/* ── Mobile Chat History Sidebar (overlay) ────── */}
      <ChatHistorySidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        activeId={activeSessionId}
        onSelect={(id) => { setActiveSessionId(id); setMobileSidebarOpen(false); }}
        onNewChat={() => { handleNewChat(); setMobileSidebarOpen(false); }}
        isMobileOverlay={true}
      />

      {/* ── Main Chat Area ────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* Top bar — sidebar toggle + title */}
        <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-black/20 backdrop-blur-md">
          {/* Desktop toggle */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            title="Toggle sidebar (Ctrl+B)"
            className="hidden md:flex items-center justify-center size-9 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            {sidebarOpen
              ? <PanelLeftClose className="size-4" />
              : <PanelLeftOpen  className="size-4" />}
          </button>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex md:hidden items-center justify-center size-9 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <PanelLeftOpen className="size-4" />
          </button>

          {/* Title area */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="size-7 rounded-lg bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center border border-white/20 shrink-0">
              <Sparkles className="size-3.5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-black tracking-tight text-white truncate">
                {activeSessionId
                  ? MOCK_HISTORY.find(h => h.id === activeSessionId)?.title ?? "AI Assistant"
                  : "AI Assistant"}
              </h1>
              <div className="flex items-center gap-1.5">
                <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  Neural Engine v1.0.4
                </span>
              </div>
            </div>
          </div>

          {/* Options */}
          <button className="size-9 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center">
            <MoreHorizontal className="size-4" />
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="flex flex-col h-full">
            <AnimatePresence mode="popLayout" initial={false}>
              {messages.length === 0 && !isLoading ? (
                <WelcomeScreen
                  userName={user?.fullName}
                  onSuggest={handleSuggest}
                />
              ) : (
                <div className="flex-1 px-4 py-6 space-y-6 max-w-3xl mx-auto w-full">
                  {messages.map((msg: Message, idx: number) => (
                    <MessageBubble
                      key={idx}
                      msg={msg}
                      onCopy={handleCopy}
                    />
                  ))}

                  {isLoading && <TypingIndicator />}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Input Area (sticky bottom) ──────────────── */}
        <div className="shrink-0 border-t border-white/[0.06] bg-black/40 backdrop-blur-2xl px-4 py-4">
          <form
            onSubmit={handleSubmit}
            className="relative max-w-3xl mx-auto"
          >
            <div className="relative group">
              <AutoTextarea
                value={input}
                onChange={setInput}
                onKeyDown={handleKeyDown}
                placeholder="Message Zest AI... (Enter to send, Shift+Enter for new line)"
                disabled={isLoading}
              />

              {/* Action icons inside input (right side) */}
              <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
                {/* Attachment icon */}
                <button
                  type="button"
                  title="Attach file"
                  className="size-8 flex items-center justify-center rounded-lg text-white/25 hover:text-white/60 hover:bg-white/10 transition-all duration-200"
                >
                  <Paperclip className="size-4" />
                </button>

                {/* Mic icon */}
                <button
                  type="button"
                  title="Voice input"
                  className="size-8 flex items-center justify-center rounded-lg text-white/25 hover:text-white/60 hover:bg-white/10 transition-all duration-200"
                >
                  <Mic className="size-4" />
                </button>

                {/* Send button */}
                <button
                  id="send-btn"
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="size-8 btn-primary p-0! rounded-lg flex items-center justify-center disabled:opacity-25 disabled:scale-100 active:scale-95 transition-all relative overflow-hidden group/send"
                  title="Send message (Enter)"
                >
                  <Send className="size-3.5 group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover/send:translate-x-full transition-transform duration-700" />
                </button>
              </div>
            </div>

            {/* Footer hint */}
            <p className="mt-2 text-[10px] text-center font-bold text-white/15 uppercase tracking-widest">
              Zest Intelligence • RAG Mode Active
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
