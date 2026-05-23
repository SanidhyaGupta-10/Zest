import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/Provider";
import DashboardLayout from "@/components/DashboardLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zest AI — Premium Knowledge Assistant",
  description: "Experience the next generation of AI productivity with Zest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        suppressHydrationWarning
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      >
          <body
            suppressHydrationWarning
            className="min-h-full bg-slate-950 font-sans"
          >
            <Providers>
              {/* Background elements */}
              <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                {/* Radial glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full opacity-50" />
                <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full opacity-30 animate-pulse" />
                
                {/* Grid overlay */}
                <div className="absolute inset-x-0 top-0 h-full w-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_80%)]" />
              </div>

              <DashboardLayout>
                {children}
              </DashboardLayout>
            </Providers>
          </body>
      </html>
    </ClerkProvider>
  );
}
