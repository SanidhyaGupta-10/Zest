import { MessageSquare, BookOpen, FileText, HelpCircle } from "lucide-react";

export const features = [
  {
    title: "AI Chat",
    description: "Intelligent conversations with your notes using advanced RAG models.",
    icon: MessageSquare,
    href: "/chat",
    color: "from-blue-500 to-cyan-400",
  },
  {
    title: "Smart Notes",
    description: "Upload, process, and organize your knowledge with AI precision.",
    icon: BookOpen,
    href: "/notes",
    color: "from-purple-500 to-pink-400",
  },
  {
    title: "Instant Summary",
    description: "Extract core insights from lengthy documents in seconds.",
    icon: FileText,
    href: "/summary",
    color: "from-orange-500 to-amber-400",
  },
  {
    title: "Quiz Generator",
    description: "Master any subject with AI-generated practice questions.",
    icon: HelpCircle,
    href: "/questions",
    color: "from-emerald-500 to-teal-400",
  },
];
