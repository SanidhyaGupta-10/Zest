"use client";

import { motion } from "framer-motion";
import { History, MessageSquare, FileText, BookOpen, HelpCircle, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";

const historySections = [
  {
    name: "Chat History",
    href: "/history/chats",
    icon: MessageSquare,
    description: "View your previous conversations with the AI assistant",
    color: "blue",
  },
  {
    name: "Summaries",
    href: "/history/summaries",
    icon: FileText,
    description: "Access all text summaries you have generated",
    color: "amber",
  },
  {
    name: "Notes",
    href: "/history/notes",
    icon: BookOpen,
    description: "Browse your generated study notes by topic",
    color: "emerald",
  },
  {
    name: "Questions",
    href: "/history/questions",
    icon: HelpCircle,
    description: "Review all quiz questions you have created",
    color: "blue",
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; hover: string }> = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    hover: "hover:border-blue-500/40",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    hover: "hover:border-amber-500/40",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    hover: "hover:border-emerald-500/40",
  },
};

export default function HistoryPage() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <BackButton />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <History className="size-5 text-blue-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">History</h1>
        </div>
        <p className="text-gray-400 font-medium max-w-2xl">
          Access all your generated content and past conversations in one place.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {historySections.map((section, idx) => {
          const colors = colorClasses[section.color];
          const Icon = section.icon;

          return (
            <motion.div
              key={section.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                href={section.href}
                className={`glass-card p-6 block group ${colors.hover} hover:bg-white/4 transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${colors.bg} border ${colors.border}`}>
                      <Icon className={`size-5 ${colors.text}`} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white group-hover:text-white transition-colors">
                        {section.name}
                      </h2>
                      <p className="text-sm text-white/40 mt-1">{section.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-white/20 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
