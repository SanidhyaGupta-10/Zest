"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Plus, 
  MessageSquare, 
  FolderKanban, 
  Sparkles, 
  Code2, 
  SlidersHorizontal, 
  Palette, 
  Search, 
  PanelLeftClose, 
  Sliders, 
  Settings, 
  User, 
  X, 
  Github, 
  Instagram, 
  Mail,
  Zap,
  BookOpen,
  FileText,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const mainNavItems = [
  { name: "Chats", href: "/chat", icon: MessageSquare },
  { name: "Projects", href: "/notes", icon: FolderKanban },
  { name: "Artifacts", href: "/history", icon: Sparkles },
  { name: "Code", href: "/summary", icon: Code2, badge: "PRO" },
  { name: "Customize", href: "/settings", icon: SlidersHorizontal },
];

const productItems = [
  { name: "Design Studio", href: "/questions", icon: Palette },
];

const recentChats = [
  { id: "1", title: "Mastering narrations and voice ...", href: "/chat" },
  { id: "2", title: "Programming languages for AI er...", href: "/chat" },
  { id: "3", title: "Dark theme PDF conversion", href: "/chat" },
  { id: "4", title: "Migrating from Python to JavaS...", href: "/chat" },
  { id: "5", title: "Production Redis and BullMQ ha...", href: "/chat" },
  { id: "6", title: "Update dev profile with persona...", href: "/chat" },
];

export default function Sidebar(
  { isOpen, setIsOpen }: { isOpen?: boolean, setIsOpen?: (val: boolean) => void }
) {
  const pathname = usePathname();
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    if (setIsOpen) setIsOpen(false);
  }, [pathname, setIsOpen]);

  const SidebarContent = (
    <div className="h-full flex flex-col pt-4 pb-4 px-3 bg-[#050814]/80 backdrop-blur-2xl text-gray-300 font-sans">
      {/* Header Logo & Actions */}
      <div className="flex items-center justify-between px-2 py-2 mb-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="size-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-105 transition-transform">
            <Zap className="size-4 text-white fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            ZEST AI
          </span>
        </Link>
        <div className="flex items-center gap-1 text-gray-400">
          <button className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
            <Search className="size-4" />
          </button>
          <button 
            onClick={() => setIsOpen?.(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
          >
            <PanelLeftClose className="size-4" />
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <Link
        href="/chat"
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all mb-5 group active:scale-95 text-sm"
      >
        <Plus className="size-4 text-cyan-400 group-hover:rotate-90 transition-transform duration-300" />
        <span>New chat</span>
      </Link>

      {/* Navigation */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-1">
        {/* Main Nav */}
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all relative group",
                  isActive
                    ? "bg-white/[0.08] text-white font-semibold border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "size-4.5 transition-colors", 
                    isActive ? "text-cyan-400" : "text-gray-400 group-hover:text-cyan-300"
                  )} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-400 rounded-l-full shadow-[0_0_10px_#06b6d4]" />
                )}
              </Link>
            );
          })}

          {/* Contact Toggle */}
          <button
            onClick={() => setShowContact(!showContact)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all group"
          >
            <div className="flex items-center gap-3">
              <Mail className="size-4.5 text-gray-400 group-hover:text-purple-400 transition-colors" />
              <span>Developer Contact</span>
            </div>
          </button>
        </div>

        {/* Contact Links Drawer */}
        <AnimatePresence>
          {showContact && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden space-y-1 pl-3"
            >
              <a
                href="https://github.com/SanidhyaGupta-10"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-colors border border-white/5"
              >
                <Github className="size-4 text-cyan-400" />
                <span>GitHub @SanidhyaGupta-10</span>
              </a>
              <a
                href="https://www.instagram.com/sanidhyagupta10/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-colors border border-white/5"
              >
                <Instagram className="size-4 text-purple-400" />
                <span>Instagram @sanidhyagupta10</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Section */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Products
          </div>
          <div className="space-y-1">
            {productItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all group"
              >
                <item.icon className="size-4 text-gray-400 group-hover:text-purple-400" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recents Section */}
        <div>
          <div className="flex items-center justify-between px-3 pb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <span>Recents</span>
            <Sliders className="size-3 text-gray-500 hover:text-white cursor-pointer" />
          </div>
          <div className="space-y-1">
            {recentChats.map((chat) => (
              <Link
                key={chat.id}
                href={chat.href}
                className="block px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-cyan-300 hover:bg-white/[0.04] transition-colors truncate"
              >
                {chat.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Settings */}
      <div className="pt-3 border-t border-white/10 mt-auto flex items-center justify-between px-2 text-xs text-gray-400">
        <Link href="/settings" className="flex items-center gap-2 p-1.5 hover:text-white rounded-lg transition-colors">
          <Settings className="size-4 text-gray-400" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen fixed left-0 top-0 border-r border-white/10 bg-[#050814]/90 backdrop-blur-2xl z-40 flex-col shadow-2xl overflow-hidden">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen?.(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed left-0 top-0 w-72 h-screen bg-[#050814] border-r border-white/10 z-60 md:hidden shadow-2xl"
            >
              <button
                onClick={() => setIsOpen?.(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="size-4" />
              </button>
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}


