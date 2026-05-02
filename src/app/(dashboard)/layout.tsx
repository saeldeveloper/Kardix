"use client";

import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { Package, User } from "lucide-react";
import { UserProvider, useUser } from "@/context/UserContext";

function DashboardHeader() {
  const { avatarUrl } = useUser();
  
  return (
    <div className="md:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-surface border-b border-border/10 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Package className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-text-primary tracking-tight">Kardix</h1>
      </div>
      
      <a href="/settings" className="w-10 h-10 rounded-full border-2 border-border/10 overflow-hidden bg-surface-secondary flex items-center justify-center transition-transform active:scale-90">
        {avatarUrl ? (
          <img src={avatarUrl} alt="User" className="w-full h-full object-cover" />
        ) : (
          <User className="w-5 h-5 text-text-secondary" />
        )}
      </a>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <UserProvider>
      <div className="min-h-screen bg-background text-text-primary overflow-x-hidden">
        <DashboardHeader />
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main className={`pl-0 ${isCollapsed ? "md:pl-28" : "md:pl-72"} pb-28 md:pb-0 min-h-screen transition-all duration-500 ease-in-out`}>
          <div className="max-w-7xl mx-auto p-4 md:p-10">{children}</div>
        </main>
      </div>
    </UserProvider>
  );
}

