"use client";

import { X, AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface w-full max-w-sm rounded-2xl shadow-2xl border border-border overflow-hidden slide-in-from-bottom-4 animate-in">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
          <h2 className="text-lg font-bold text-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-background rounded-md transition-colors text-text-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4">
            {variant === "danger" && (
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex-shrink-0 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            )}
            <p className="text-text-secondary text-sm leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex gap-3 p-4 bg-background/50 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 btn-outline py-2.5 text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 btn py-2.5 text-sm text-white transition-all
              ${variant === "danger" ? "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none" : "btn-primary"}
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
