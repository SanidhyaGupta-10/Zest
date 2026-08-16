"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { Loader2, Menu } from "lucide-react";
import { useUserSync } from "@/hooks/useUserSync";

function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { isPending: isSyncing } = useUserSync();

  return (
    <header className="sticky top-0 z-30 w-full">
      <div className="mx-auto w-full px-4 py-4">
        <div className="glass-card flex h-14 items-center justify-between px-6 border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <button 
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/5 text-white/50 hover:text-white transition-colors"
            >
              <Menu className="size-5" />
            </button>
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="size-8 rounded-full overflow-hidden border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform">
                <img
                  src="/zest-dragon-logo.jpg"
                  alt="Zest Dragon Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tighter bg-linear-to-r from-white via-white to-white/40 bg-clip-text text-transparent group-hover:to-white transition-all">
                  ZEST
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold uppercase tracking-wider">
                  Alpha
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {!isLoaded ? (
              <div className="size-8 rounded-full bg-white/5 animate-pulse" />
            ) : isSignedIn ? (
              <div className="flex items-center gap-4">
                {isSyncing && (
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/30 font-bold">
                    <Loader2 className="size-3 animate-spin" />
                    <span>Syncing</span>
                  </div>
                )}
                <div className="h-6 w-px bg-white/10 mx-1" />
                <UserButton 
                  afterSwitchSessionUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "size-8 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-white/50 hover:text-white transition-colors">
                    Login
                  </button>
                </SignInButton>
                
                <SignUpButton mode="modal">
                  <button className="btn-primary text-xs py-2 px-4">
                    Get Started
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
