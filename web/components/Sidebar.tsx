"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, BookOpen, FileText, HelpCircle, LayoutDashboard, Settings, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const menuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Notes", href: "/notes", icon: BookOpen },
  { name: "Summary", href: "/summary", icon: FileText },
  { name: "Questions", href: "/questions", icon: HelpCircle },
];

export default function Sidebar({ isOpen, setIsOpen }: { isOpen?: boolean, setIsOpen?: (val: boolean) => void }) {
  const pathname = usePathname();

  // Close sidebar on path change (mobile)
  useEffect(() => {
    if (setIsOpen) setIsOpen(false);
  }, [pathname, setIsOpen]);

  const SidebarContent = (
    <div className="h-full flex flex-col pt-24 pb-6 px-4">
      <div className="flex-1 space-y-1.5 overflow-y-auto pr-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                isActive 
                  ? "bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "size-5 transition-transform duration-300",
                isActive ? "text-blue-400 scale-110" : "group-hover:text-blue-400 group-hover:scale-110"
              )} />
              <span className="font-bold tracking-tight text-sm uppercase">{item.name}</span>
              
              {isActive && (
                <>
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-500/10 via-transparent to-transparent pointer-events-none" 
                  />
                  <div className="ml-auto size-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                </>
              )}
            </Link>
          );
        })}
      </div>

      <div className="pt-6 space-y-1.5 border-t border-white/5 mt-auto">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400/60 hover:text-white hover:bg-white/5 transition-all duration-200 group"
        >
          <Settings className="size-5 group-hover:rotate-90 transition-transform duration-500" />
          <span className="font-bold text-xs uppercase tracking-widest">Settings</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400/60 hover:text-white hover:bg-white/5 transition-all duration-200 group">
          <User className="size-5" />
          <span className="font-bold text-xs uppercase tracking-widest">Account</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen fixed left-0 top-0 border-r border-white/5 bg-black/40 backdrop-blur-2xl z-40 flex-col shadow-2xl overflow-hidden ring-1 ring-white/5">
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
              className="fixed left-0 top-0 w-72 h-screen bg-slate-950 border-r border-white/10 z-[60] md:hidden shadow-2xl"
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
