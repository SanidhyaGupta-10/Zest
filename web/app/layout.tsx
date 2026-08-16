import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/Provider";
import DashboardLayout from "@/components/DashboardLayout";

export const metadata: Metadata = {
  title: "Zest AI — Premium Knowledge & AI Workspace",
  description: "Experience next-generation black glassmorphism AI productivity with Zest.",
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
        className="h-full antialiased dark"
      >
        <body
          suppressHydrationWarning
          className="min-h-full bg-[#030712] text-[#f8fafc] flex font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-white"
        >
          <Providers>
            {/* Black Glassmorphism Ambient Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
              <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[700px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full opacity-60" />
              <div className="absolute top-1/3 right-10 w-[600px] h-[500px] bg-purple-600/10 blur-[160px] rounded-full opacity-40" />
              <div className="absolute bottom-10 left-1/3 w-[500px] h-[400px] bg-blue-600/10 blur-[130px] rounded-full opacity-30" />
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


