"use client";

import Link from "next/link";
import { MessageSquare, BookOpen, FileText, HelpCircle, ArrowRight } from "lucide-react";

export default function Home() {
  const features = [
    {
      title: "AI Chat",
      description: "Chat with your knowledge base using RAG technology.",
      icon: MessageSquare,
      href: "/chat",
      color: "text-blue-400",
    },
    {
      title: "Notes",
      description: "Upload and process your notes for AI analysis.",
      icon: BookOpen,
      href: "/notes",
      color: "text-purple-400",
    },
    {
      title: "Summary",
      description: "Generate concise summaries of your long notes instantly.",
      icon: FileText,
      href: "/summary",
      color: "text-pink-400",
    },
    {
      title: "Questions",
      description: "Generate quiz questions to test your knowledge.",
      icon: HelpCircle,
      href: "/questions",
      color: "text-amber-400",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center pt-20 px-4">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
          AI Knowledge <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Assistant
          </span>
        </h1>
        <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed">
          The ultimate companion for your studies and research. Summarize, chat, 
          and generate quizzes from your notes with the power of modern AI.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/chat" className="glass-button-primary flex items-center gap-2 group">
            Start Chatting
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/notes" className="glass-button">
            Upload Notes
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full mb-20">
        {features.map((feature, idx) => (
          <Link 
            key={feature.title} 
            href={feature.href}
            className="glass-card p-8 group hover:scale-[1.02] transition-all duration-300"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className={`p-3 rounded-xl bg-white/5 w-fit mb-6 group-hover:bg-white/10 transition-colors ${feature.color}`}>
              <feature.icon className="size-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              {feature.description}
            </p>
            <div className="flex items-center text-sm font-medium text-white/40 group-hover:text-white transition-colors">
              Explore <ArrowRight className="size-3 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}