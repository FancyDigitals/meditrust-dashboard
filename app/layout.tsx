"use client";

import "./globals.css";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import WelcomeModal from "@/components/WelcomeModal";

const titles: Record<string, string> = {
  "/":               "Dashboard",
  "/about":          "About This Project",
  "/users":          "Users",
  "/access-control": "Access Control",
  "/policies":       "Security Policies",
  "/activity":       "Activity Logs",
  "/test-access":    "Test Access",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const title = titles[pathname] ?? "Dashboard";

  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <WelcomeModal />
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:ml-56 min-h-screen flex flex-col">
          <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200 bg-white px-6 py-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] text-slate-400">
              Academic demonstration only. No real patient data is used. All records are simulated.
            </p>
            <p className="text-[11px] text-slate-400 font-medium">
              Adegunle Kanyinsola Olayinka
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}