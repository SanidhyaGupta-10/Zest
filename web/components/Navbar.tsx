"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { UserIcon, Loader2 } from "lucide-react";
import { useUserSync } from "@/hooks/useUserSync";

function Navbar() {
  const { isLoaded, isSignedIn } = useAuth();
  
  // This hook runs automatically when isSignedIn is true
  const { isPending: isSyncing } = useUserSync();

  // 1. Loading State (Skeleton)
  if (!isLoaded) {
    return (
      <div className="navbar bg-base-300 border-b border-base-content/10">
        <div className="max-w-5xl mx-auto w-full px-4 flex justify-between items-center">
          <div className="flex-1">
            <div className="h-8 w-20 bg-base-200 rounded animate-pulse" />
          </div>
          <div className="flex gap-2 items-center">
            <div className="h-8 w-16 bg-base-200 rounded animate-pulse" />
            <div className="h-8 w-24 bg-base-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav className="navbar bg-base-300 border-b border-base-content/10 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto w-full px-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost px-0 hover:bg-transparent gap-2">
            <span className="text-xl font-black font-mono uppercase tracking-tighter text-primary">
              Zest
            </span>
          </Link>
        </div>

        {/* Auth Section */}
        <div className="flex gap-3 items-center">
          {isSignedIn ? (
            <>
              {/* Syncing Indicator: Shows a tiny spinner while Express saves the user */}
              {isSyncing && (
                <div className="flex items-center gap-2 text-xs text-base-content/50 italic animate-pulse">
                  <Loader2 className="size-3 animate-spin" />
                  <span>Syncing...</span>
                </div>
              )}

              <Link 
                href="/profile" 
                className={`btn btn-ghost btn-sm gap-2 ${isSyncing ? 'btn-disabled opacity-50' : ''}`}
              >
                <UserIcon className="size-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              
              <div className="flex items-center border-l border-base-content/20 pl-3 ml-1">
                <UserButton 
                  afterSwitchSessionUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "size-8"
                    }
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="btn btn-ghost btn-sm font-medium">
                  Sign In
                </button>
              </SignInButton>
              
              <SignUpButton mode="modal">
                <button className="btn btn-primary btn-sm shadow-md">
                  Get Started
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;