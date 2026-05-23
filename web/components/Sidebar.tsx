"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare, BookOpen, FileText, HelpCircle, LayoutDashboard,
  Settings, User, X, History, Github, Instagram, Mail,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { SidebarProps } from "@/types/components.types";

const menuItems = [
  { name: "Dashboard", href: "/",          icon: LayoutDashboard },
  { name: "Chat",      href: "/chat",       icon: MessageSquare  },
  { name: "History",   href: "/history",    icon: History        },
  { name: "Notes",     href: "/notes",      icon: BookOpen       },
  { name: "Summary",   href: "/summary",    icon: FileText       },
  { name: "Questions", href: "/questions",  icon: HelpCircle     },
];

export default function Sidebar({
  isOpen,
  setIsOpen,
  isCollapsed = false,
  setIsCollapsed,
}: SidebarProps) {
  const pathname = usePathname();
  const [showContact, setShowContact] = useState(false);

  // Close mobile sidebar on navigation
  useEffect(() => {
    if (setIsOpen) setIsOpen(false);
  }, [pathname, setIsOpen]);

  const isContactActive = showContact;

  const NavItem = ({ item, collapsed }: { item: typeof menuItems[0]; collapsed: boolean }) => {
    const isActive = pathname === item.href && !showContact;
    return (
      <Link
        href={item.href}
        onClick={() => setShowContact(false)}
        title={collapsed ? item.name : undefined}
        className={cn(
          "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative",
          collapsed ? "justify-center" : "",
          isActive
            ? "bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        )}
      >
        <item.icon className={cn(
          "size-5 shrink-0 transition-transform duration-300",
          isActive ? "text-blue-400 scale-110" : "group-hover:text-blue-400 group-hover:scale-110"
        )} />
        {!collapsed && (
          <span className="font-bold tracking-tight text-sm uppercase truncate">{item.name}</span>
        )}

        {isActive && (
          <>
            <motion.div
              layoutId="active-nav"
              className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-500/10 via-transparent to-transparent pointer-events-none"
            />
            {!collapsed && (
              <div className="ml-auto size-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
            )}
          </>
        )}
      </Link>
    );
  };

  const SidebarContent = (
    <div className="h-full flex flex-col pt-24 pb-6 px-3">
      {/* Collapse toggle — desktop only */}
      {setIsCollapsed && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden md:flex items-center justify-center absolute top-20 -right-3 size-6 rounded-full bg-slate-800 border border-white/10 text-white/50 hover:text-white hover:bg-slate-700 transition-all z-50 shadow-lg"
        >
          {isCollapsed
            ? <ChevronRight className="size-3" />
            : <ChevronLeft  className="size-3" />}
        </button>
      )}

      <div className="flex-1 space-y-1 overflow-y-auto pr-1">
        {menuItems.map((item) => (
          <NavItem key={item.name} item={item} collapsed={isCollapsed} />
        ))}

        {/* Contact Me */}
        <button
          onClick={() => setShowContact(!showContact)}
          title={isCollapsed ? "Contact Me" : undefined}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative",
            isCollapsed ? "justify-center" : "",
            isContactActive
              ? "bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Mail className={cn(
            "size-5 shrink-0 transition-transform duration-300",
            isContactActive ? "text-blue-400 scale-110" : "group-hover:text-blue-400 group-hover:scale-110"
          )} />
          {!isCollapsed && (
            <span className="font-bold tracking-tight text-sm uppercase">Contact Me</span>
          )}
          {isContactActive && (
            <>
              <motion.div
                layoutId="active-nav"
                className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-500/10 via-transparent to-transparent pointer-events-none"
              />
              {!isCollapsed && (
                <div className="ml-auto size-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
              )}
            </>
          )}
        </button>

        {/* Contact Section */}
        <AnimatePresence>
          {showContact && !isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-2 mb-4 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Get in Touch</p>
                <a
                  href="https://github.com/SanidhyaGupta-10"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group/link"
                >
                  <div className="flex items-center justify-center size-8 rounded-lg bg-gray-800 group-hover/link:bg-gray-700 transition-colors">
                    <Github className="size-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">GitHub</span>
                    <span className="text-xs text-gray-500">@SanidhyaGupta-10</span>
                  </div>
                </a>
                <a
                  href="https://www.instagram.com/sanidhyagupta10/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group/link"
                >
                  <div className="flex items-center justify-center size-8 rounded-lg bg-linear-to-br from-purple-600 via-pink-500 to-orange-400">
                    <Instagram className="size-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Instagram</span>
                    <span className="text-xs text-gray-500">@sanidhyagupta10</span>
                  </div>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-4 space-y-1 border-t border-white/5 mt-auto">
        <Link
          href="/settings"
          title={isCollapsed ? "Settings" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400/60 hover:text-white hover:bg-white/5 transition-all duration-200 group",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <Settings className="size-5 shrink-0 group-hover:rotate-90 transition-transform duration-500" />
          {!isCollapsed && (
            <span className="font-bold text-xs uppercase tracking-widest">Settings</span>
          )}
        </Link>
        <button
          title={isCollapsed ? "Account" : undefined}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400/60 hover:text-white hover:bg-white/5 transition-all duration-200 group",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <User className="size-5 shrink-0" />
          {!isCollapsed && (
            <span className="font-bold text-xs uppercase tracking-widest">Account</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "nav-sidebar hidden md:flex h-screen fixed left-0 top-0 border-r border-white/5 bg-black/40 backdrop-blur-2xl z-40 flex-col shadow-2xl overflow-hidden ring-1 ring-white/5 relative",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-transparent to-transparent" />
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 w-72 h-screen bg-slate-950 border-r border-white/10 z-60 md:hidden shadow-2xl"
            >
              <button
                onClick={() => setIsOpen?.(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/10"
              >
                <X className="size-5 text-white/50" />
              </button>
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
