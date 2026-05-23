"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const pathname = usePathname();

  const isChat = pathname === "/chat";
  const isHome = pathname === "/";
  
  const sidebarWidth = isNavCollapsed ? "w-16" : "w-64";
  const mainMargin = isHome ? "" : (isNavCollapsed ? "md:ml-16" : "md:ml-64");

  return (
    <>
      {!isHome && (
        <Sidebar
          isOpen={isMobileSidebarOpen}
          setIsOpen={setIsMobileSidebarOpen}
          isCollapsed={isNavCollapsed}
          setIsCollapsed={setIsNavCollapsed}
          sidebarWidth={sidebarWidth}
        />
      )}
      <div className={`flex flex-col min-w-0 ${mainMargin} transition-all duration-300 min-h-screen`}>
        <Navbar onMenuClick={() => setIsMobileSidebarOpen(true)} />

        {isChat ? (
          /* Chat page: no wrapper, fills all remaining viewport height */
          <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {children}
          </main>
        ) : (
          /* All other pages: standard padded content wrapper */
          <main className={cn("flex-1 relative z-0", isHome ? "" : "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8")}>
            {children}
          </main>
        )}
      </div>
    </>
  );
}
