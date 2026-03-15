"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  LogOut, 
  AlertTriangle,
  Settings,
  Download,
  ChevronUp,
  MoreVertical
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Productos", href: "/products", icon: Package },
  { name: "Por Comprar", href: "/restock", icon: AlertTriangle },
  { name: "Ventas", href: "/sales", icon: ShoppingCart },
  { name: "Reportes", href: "/reports", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isInstallable, handleInstallClick } = usePWAInstall();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error.message);
    window.location.href = "/login";
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 border-r border-border bg-white flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold tracking-tight text-primary">Kardix</h1>
          <p className="text-[10px] text-text-secondary uppercase tracking-[0.1em] mt-1 font-medium">
            Gestión de Inventario
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive 
                    ? "bg-surface text-primary font-medium" 
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-text-secondary")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border relative">
          {isSettingsOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              {isInstallable && (
                <button 
                  onClick={() => {
                    handleInstallClick();
                    setIsSettingsOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm text-text-secondary hover:bg-surface hover:text-text-primary transition-colors border-b border-border"
                >
                  <Download className="w-4 h-4" />
                  Instalar App
                </button>
              )}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          )}
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={cn(
              "flex items-center justify-between px-3 py-2.5 w-full text-left rounded-lg text-sm transition-colors",
              isSettingsOpen ? "bg-surface text-text-primary" : "text-text-secondary hover:bg-surface hover:text-text-primary"
            )}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-text-secondary" />
              Configuración
            </div>
            <ChevronUp className={cn("w-3.5 h-3.5 transition-transform", isSettingsOpen ? "rotate-0" : "rotate-180")} />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-border flex items-center justify-around px-4 z-50">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors",
                isActive ? "text-primary" : "text-text-secondary"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-text-secondary")} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
        
        <div className="relative">
          {isSettingsOpen && (
            <div className="absolute bottom-full right-0 mb-4 bg-white border border-border rounded-lg shadow-xl min-w-[160px] overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              {isInstallable && (
                <button 
                  onClick={() => {
                    handleInstallClick();
                    setIsSettingsOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm text-text-secondary hover:bg-surface border-b border-border"
                >
                  <Download className="w-4 h-4" />
                  Instalar App
                </button>
              )}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm text-red-500 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          )}
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors",
              isSettingsOpen ? "text-primary" : "text-text-secondary"
            )}
          >
            <MoreVertical className="w-5 h-5" />
            <span className="text-[10px] font-medium">Más</span>
          </button>
        </div>
      </nav>
    </>
  );
}
