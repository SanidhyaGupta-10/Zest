"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { 
  Plus, 
  ChevronDown, 
  Mic, 
  AudioWaveform, 
  GraduationCap, 
  Code2, 
  PenTool, 
  Coffee, 
  Lightbulb,
  Sparkles,
  Send,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("Sonnet 5 Max");
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [greeting, setGreeting] = useState("Sunday session");

  useEffect(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = days[new Date().getDay()];
    const firstName = user?.firstName || user?.username || "Sanidhya";
    setGreeting(`${currentDay} session, ${firstName}?`);
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(prompt)}`);
  };

  const handlePillClick = (pillText: string) => {
    const defaultPrompts: Record<string, string> = {
      "Learn": "Teach me a complex concept in plain English with an interactive mental model.",
      "Code": "Help me write high-performance TypeScript and debug tricky async issues.",
      "Write": "Help me draft a clear, persuasive document or technical blog post.",
      "Life stuff": "Give me thoughtful perspective and practical organization tips for my week.",
      "Zest's choice": "Surprise me with a fascinating insight or breakdown of cutting-edge tech."
    };
    const query = defaultPrompts[pillText] || pillText;
    router.push(`/chat?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] py-8 px-4 text-[#f8fafc]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mx-auto flex flex-col items-center"
      >
        {/* Glowing Sparkle / Logo Icon + Dynamic Greeting */}
        <div className="flex items-center justify-center gap-3.5 mb-8 text-center">
          <div className="relative flex items-center justify-center size-10 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
            <Sparkles className="size-5 text-cyan-400 animate-pulse" />
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            {greeting}
          </h1>
        </div>

        {/* Central Floating Black Glass Prompt Card */}
        <form onSubmit={handleSubmit} className="w-full mb-6">
          <div className="glass-prompt-box p-4 md:p-5 flex flex-col justify-between min-h-[150px] relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Message Zest AI or type / for skills..."
              rows={3}
              className="w-full bg-transparent text-[#f8fafc] placeholder-gray-500 text-base focus:outline-none resize-none font-sans"
            />

            {/* Inner Bottom Controls Row */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
              {/* Left Attachment Icon */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Add attachments or context"
                >
                  <Plus className="size-5" />
                </button>
              </div>

              {/* Right Action Controls */}
              <div className="flex items-center gap-2 relative">
                {/* Model selector dropdown pill */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowModelMenu(!showModelMenu)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-gray-300 hover:text-white hover:bg-white/[0.08] hover:border-cyan-500/30 transition-all font-semibold cursor-pointer"
                  >
                    <span className="text-cyan-400">●</span>
                    <span>{selectedModel}</span>
                    <ChevronDown className="size-3 text-gray-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {showModelMenu && (
                    <div className="absolute right-0 bottom-full mb-2 w-52 bg-[#0b1329]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 py-1 text-xs">
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

                {/* Microphone Icon */}
                <button
                  type="button"
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Voice input"
                >
                  <Mic className="size-4" />
                </button>

                {/* Audio Waveform Icon */}
                <button
                  type="button"
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Audio mode"
                >
                  <AudioWaveform className="size-4" />
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-30 disabled:hover:shadow-none transition-all cursor-pointer"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Action Quick-Pill Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-full">
          {[
            { label: "Learn", icon: GraduationCap },
            { label: "Code", icon: Code2 },
            { label: "Write", icon: PenTool },
            { label: "Life stuff", icon: Coffee },
            { label: "Zest's choice", icon: Lightbulb },
          ].map((pill) => (
            <button
              key={pill.label}
              onClick={() => handlePillClick(pill.label)}
              className="glass-pill"
            >
              <pill.icon className="size-3.5 text-cyan-400" />
              <span>{pill.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
