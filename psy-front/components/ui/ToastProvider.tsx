// === НАЧАЛО БЛОКА: Toast Notification System ===
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { X, Info } from "lucide-react";

type ToastMessage = {
  id: string;
  message: string;
  type: "info" | "error" | "success";
};

type ToastContextType = {
  showToast: (message: string, type?: "info" | "error" | "success") => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: "info" | "error" | "success" = "info") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Автоудаление через 4 секунды
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Контейнер уведомлений (Справа внизу на ПК, внизу по центру на Mobile) */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-[350px] px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-3 p-4 bg-[#111827] text-white rounded-2xl shadow-lg border border-gray-800 animate-in slide-in-from-bottom-5 fade-in duration-300"
          >
            <Info className="w-5 h-5 text-blue-500 shrink-0" />
            <p className="text-sm font-medium leading-tight flex-1">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
// === КОНЕЦ БЛОКА ===