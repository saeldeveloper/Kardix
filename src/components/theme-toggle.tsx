"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-surface animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2.5 rounded-xl bg-surface border border-border text-text-primary hover:bg-primary/5 hover:border-primary/20 transition-all duration-200 group"
      aria-label="Cambiar tema"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700 group-hover:scale-110 transition-transform" />
      )}
    </button>
  );
}
