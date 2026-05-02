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
  ChevronLeft,
  ChevronRight,
  User
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useUser } from "@/context/UserContext";

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

export default function Sidebar({ 
  isCollapsed, 
  setIsCollapsed 
}: { 
  isCollapsed: boolean; 
  setIsCollapsed: (v: boolean) => void; 
}) {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { fullName, avatarUrl, email } = useUser();
  const { isInstallable, handleInstallClick } = usePWAInstall();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error.message);
    window.location.href = "/login";
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden md:flex fixed left-4 top-4 bottom-4 rounded-[1.5rem] bg-surface backdrop-blur-xl shadow-2xl flex-col z-50 transition-all duration-500 ease-in-out overflow-visible",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-[52px] w-7 h-7 rounded-full bg-surface border border-border/10 flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-[60] text-text-secondary hover:text-primary"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className={cn(
          "transition-all duration-500 flex items-center",
          isCollapsed ? "p-0 py-6 justify-center" : "p-8 gap-3"
        )}>
          <div className="w-10 h-10 min-w-[40px] rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div className={cn(
            "transition-all duration-500 overflow-hidden",
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}>
            <h1 className="text-xl font-bold tracking-tight text-text-primary whitespace-nowrap">Kardix</h1>
            <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold opacity-70 whitespace-nowrap">
              Inventory
            </p>
          </div>
        </div>

        <nav className={cn("flex-1 px-3 space-y-4 overflow-y-auto custom-scrollbar flex flex-col items-center", isCollapsed ? "px-0" : "px-4")}>
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-2xl transition-all duration-300 group relative",
                  isCollapsed 
                    ? "w-12 h-12 justify-center" 
                    : "w-full gap-3 px-4 py-3",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.05]" 
                    : "text-text-secondary hover:bg-surface hover:text-text-primary hover:translate-x-1"
                )}
              >
                <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-text-secondary")} />
                <span className={cn(
                  "font-medium transition-all duration-500 overflow-hidden whitespace-nowrap",
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                )}>
                  {item.name}
                </span>
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-text-primary text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100]">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className={cn("p-4 transition-all flex flex-col", isCollapsed ? "p-2 items-center" : "p-4")}>
          <div className="h-px bg-border/10 mb-4 mx-2 w-full" />
          <div className="relative">
            {isSettingsOpen && (
              <div className={cn(
                "absolute bottom-full mb-2 bg-surface rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 backdrop-blur-xl z-[70]",
                isCollapsed ? "left-0 w-48" : "left-0 right-0"
              )}>
                <Link 
                  href="/settings"
                  onClick={() => setIsSettingsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm text-text-secondary hover:bg-primary/5 hover:text-primary transition-colors "
                >
                  <Settings className="w-4 h-4" />
                  Configuración
                </Link>
                {isInstallable && (
                  <button 
                    onClick={() => {
                      handleInstallClick();
                      setIsSettingsOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm text-primary font-medium hover:bg-primary/5 transition-colors "
                  >
                    <Download className="w-4 h-4" />
                    Instalar App
                  </button>
                )}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            )}
            
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={cn(
                "flex items-center rounded-2xl text-sm transition-all duration-300",
                isCollapsed ? "justify-center w-12 h-12" : "justify-between px-4 py-4 w-full text-left",
                isSettingsOpen 
                  ? "bg-surface shadow-inner" 
                  : "text-text-secondary hover:bg-surface hover:text-text-primary"
              )}
            >
              <div className={cn("flex items-center overflow-hidden", isCollapsed ? "justify-center" : "gap-3")}>
                <div className="w-8 h-8 min-w-[32px] rounded-full bg-surface-secondary flex items-center justify-center overflow-hidden border border-border/10">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-text-secondary" />
                  )}
                </div>
                <div className={cn(
                  "flex flex-col transition-all duration-500 overflow-hidden",
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                )}>
                  <span className="font-semibold text-text-primary text-xs leading-none mb-1 truncate max-w-[100px] whitespace-nowrap">
                    {fullName || email?.split('@')[0] || "Usuario"}
                  </span>
                  <span className="text-[10px] text-text-secondary opacity-70 truncate max-w-[100px] whitespace-nowrap">
                    {email || "Cargando..."}
                  </span>
                </div>
              </div>
              <div className={cn(
                "transition-all duration-500 overflow-hidden",
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              )}>
                <ChevronUp className={cn("w-4 h-4 transition-transform duration-300", isSettingsOpen ? "rotate-0" : "rotate-180")} />
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation - Classic Style */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-surface border-t border-border/10 flex items-center justify-around px-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 flex-1 h-full transition-colors relative",
                isActive ? "text-primary" : "text-text-secondary hover:text-text-primary"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive ? "text-primary" : "text-text-secondary")} />
              <span className={cn(
                "text-[10px] font-semibold tracking-tight",
                isActive ? "text-primary" : "text-text-secondary"
              )}>
                {item.name}
              </span>
              {isActive && (
                <div className="absolute top-0 w-12 h-1 bg-primary rounded-b-full animate-in fade-in slide-in-from-top-1" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
