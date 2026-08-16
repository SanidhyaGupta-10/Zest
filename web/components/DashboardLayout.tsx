// Main Dashboard Layout wrapper: Combines responsive Sidebar navigation and Navbar header.
"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300 min-h-screen bg-[#030712]">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 relative z-0 flex flex-col">
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}


