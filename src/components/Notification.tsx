"use client";

import { CheckCircle, AlertCircle, X, Loader2 } from "lucide-react";
import { useState, useEffect, createContext, useContext, useCallback } from "react";

type NotificationType = "success" | "error" | "loading";

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => string;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showNotification = useCallback((message: string, type: NotificationType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);

    if (type !== "loading") {
      setTimeout(() => hideNotification(id), 4000);
    }
    return id;
  }, [hideNotification]);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-3 pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border min-w-[300px] animate-in slide-in-from-right-4
              ${n.type === "success" ? "bg-surface text-green-600 border-green-100 dark:border-green-900/30" : ""}
              ${n.type === "error" ? "bg-surface text-red-600 border-red-100 dark:border-red-900/30" : ""}
              ${n.type === "loading" ? "bg-surface text-primary border-primary/10" : ""}
            `}
          >
            {n.type === "success" && <CheckCircle className="w-5 h-5" />}
            {n.type === "error" && <AlertCircle className="w-5 h-5" />}
            {n.type === "loading" && <Loader2 className="w-5 h-5 animate-spin" />}
            
            <div className="flex-1">
              <p className="text-sm font-bold text-text-primary">{n.message}</p>
            </div>

            <button
              onClick={() => hideNotification(n.id)}
              className="p-1 hover:bg-background rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
