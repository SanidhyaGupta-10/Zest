"use client";

import { useChat } from "@/hooks/useChat";
import { useUser } from "@clerk/nextjs";
import { Send, Loader2, User, Bot } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ChatPage() {
  const { user } = useUser();
  const { messages, sendMessage, isLoading } = useChat(user?.id);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col p-4">
      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 pr-4 mb-4 scrollbar-thin scrollbar-thumb-white/10"
      >
        {messages.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <Bot className="size-12 mb-4" />
            <h2 className="text-xl font-medium">How can I help you today?</h2>
            <p className="text-sm">Ask anything about your stored notes.</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user" ? "bg-blue-600" : "bg-white/10"
              }`}>
                {msg.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
              </div>
              <div className={`glass-card p-4 text-sm leading-relaxed ${
                msg.role === "user" ? "!bg-blue-600/20 border-blue-500/20" : ""
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="size-8 rounded-full flex items-center justify-center bg-white/10 shrink-0">
                <Bot className="size-4" />
              </div>
              <div className="glass-card p-4 flex items-center gap-3 text-sm italic text-white/50">
                <Loader2 className="size-3 animate-spin" />
                Thinking...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="relative group">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="w-full glass-input pr-12 py-4 h-14 bg-white/5 focus:bg-white/10 transition-all border-white/10 hover:border-white/20"
        />
        <button 
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-2 h-10 w-10 glass-button !p-0 flex items-center justify-center hover:bg-white/20 disabled:opacity-30"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}
