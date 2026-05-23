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

export const historySections = [
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
