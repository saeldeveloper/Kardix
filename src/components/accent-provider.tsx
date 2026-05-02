"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type AccentColor = {
  name: string;
  hex: string;
};

export const ACCENT_COLORS: AccentColor[] = [
  { name: "Morado", hex: "#b539ff" },
  { name: "Azul", hex: "#3b82f6" },
  { name: "Verde", hex: "#10b981" },
  { name: "Naranja", hex: "#f97316" },
  { name: "Rojo", hex: "#ef4444" },
  { name: "Rosa", hex: "#ec4899" },
];

interface AccentContextType {
  color: string;
  setColor: (hex: string) => void;
}

const AccentContext = createContext<AccentContextType>({
  color: ACCENT_COLORS[0].hex,
  setColor: () => {},
});

export const useAccent = () => useContext(AccentContext);

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [color, setColor] = useState(ACCENT_COLORS[0].hex);

  useEffect(() => {
    const stored = localStorage.getItem("kardix-accent");
    if (stored) {
      setColor(stored);
      document.documentElement.style.setProperty("--primary", hexToRgb(stored));
    }
  }, []);

  const changeColor = (newColor: string) => {
    setColor(newColor);
    localStorage.setItem("kardix-accent", newColor);
    document.documentElement.style.setProperty("--primary", hexToRgb(newColor));
  };

  return (
    <AccentContext.Provider value={{ color, setColor: changeColor }}>
      {children}
    </AccentContext.Provider>
  );
}
