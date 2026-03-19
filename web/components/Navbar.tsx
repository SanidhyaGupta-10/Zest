"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { UserIcon } from "lucide-react";

function Navbar() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="navbar bg-base-300">
        <div className="max-w-5xl mx-auto w-full px-4 flex justify-between items-center">
          <div className="flex-1">
            <span className="btn btn-ghost gap-2">
              <span className="text-lg font-bold font-mono uppercase tracking-wider">Zest</span>
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="h-8 w-20 bg-base-200 rounded animate-pulse" />
            <div className="h-8 w-20 bg-base-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="navbar bg-base-300">
      <div className="max-w-5xl mx-auto w-full px-4 flex justify-between items-center">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost gap-2">
            <span className="text-lg font-bold font-mono uppercase tracking-wider">Zest</span>
          </Link>
        </div>

        <div className="flex gap-2 items-center">
          {isSignedIn ? (
            <>
              <Link href="/profile" className="btn btn-ghost btn-sm gap-1">
                <UserIcon className="size-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="btn btn-ghost btn-sm">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn btn-primary btn-sm">Get Started</button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;