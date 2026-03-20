"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { UserIcon, Loader2, MessageSquare, BookOpen, FileText, HelpCircle } from "lucide-react";
import { useUserSync } from "@/hooks/useUserSync";

function Navbar() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isPending: isSyncing } = useUserSync();

  const navLinks = [
    { href: "/chat", icon: MessageSquare, label: "Chat" },
    { href: "/notes", icon: BookOpen, label: "Notes" },
    { href: "/summary", icon: FileText, label: "Summary" },
    { href: "/questions", icon: HelpCircle, label: "Quiz" },
  ];

  if (!isLoaded) {
    return (
      <nav className="sticky top-4 z-50 mx-auto w-full max-w-5xl px-4">
        <div className="glass-card flex h-16 items-center justify-between px-6">
          <div className="h-8 w-24 animate-pulse rounded bg-white/10" />
          <div className="flex gap-4">
            <div className="h-8 w-16 animate-pulse rounded bg-white/10" />
            <div className="h-8 w-24 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-4 z-50 mx-auto w-full max-w-7xl px-4">
      <div className="glass-card flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black bg-linear-to-r from-white to-white/50 bg-clip-text text-transparent group-hover:to-white transition-all">
              ZEST
            </span>
          </Link>

          {isSignedIn && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium text-white/70 hover:text-white"
                >
                  <link.icon className="size-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              {isSyncing && (
                <div className="flex items-center gap-2 text-xs text-white/50 italic animate-pulse">
                  <Loader2 className="size-3 animate-spin" />
                  <span>Syncing...</span>
                </div>
              )}
              <div className="flex items-center border-l border-white/20 pl-4 ml-1">
                <UserButton 
                  afterSwitchSessionUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "size-8 border border-white/20"
                    }
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                  Sign In
                </button>
              </SignInButton>
              
              <SignUpButton mode="modal">
                <button className="glass-button-primary text-sm font-semibold">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
