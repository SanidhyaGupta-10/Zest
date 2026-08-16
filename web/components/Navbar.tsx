"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import { Loader2, PanelLeftOpen, Sparkles } from "lucide-react";
import { useUserSync } from "@/hooks/useUserSync";

function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { isPending: isSyncing } = useUserSync();

  return (
    <header className="sticky top-0 z-30 w-full bg-[#030712]/70 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="mx-auto w-full px-4 py-2.5">
        <div className="flex h-10 items-center justify-between px-2">
          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onMenuClick}
              className="md:hidden p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <PanelLeftOpen className="size-5" />
            </button>
          </div>

          {/* Center Plan Banner */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              ZEST PRO ACTIVE
            </span>
            <Link 
              href="/settings" 
              className="text-gray-400 hover:text-cyan-300 text-xs font-medium transition-colors hidden sm:inline"
            >
              Manage Plan
            </Link>
          </div>

          {/* User Status & Avatar */}
          <div className="flex items-center gap-3">
            {!isLoaded ? (
              <div className="size-7 rounded-full bg-white/10 animate-pulse" />
            ) : isSignedIn ? (
              <div className="flex items-center gap-2">
                {isSyncing && (
                  <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-semibold">
                    <Loader2 className="size-3 animate-spin text-cyan-400" />
                  </div>
                )}
                <UserButton 
                  afterSwitchSessionUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "size-7 rounded-full border border-cyan-500/40 hover:border-cyan-400 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <SignInButton mode="modal">
                  <button className="text-xs text-gray-300 hover:text-white transition-colors">
                    Log in
                  </button>
                </SignInButton>
                
                <SignUpButton mode="modal">
                  <button className="btn-glass-primary text-xs py-1.5 px-3.5">
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;


