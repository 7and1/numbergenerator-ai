"use client";

import { useEffect, useState } from "react";
import { Check, AlertCircle, Info, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  position?:
    | "top"
    | "bottom"
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left";
}

const toastConfig = {
  success: {
    icon: Check,
    bgClass: "bg-emerald-50 dark:bg-emerald-950/30",
    borderClass: "border-emerald-200 dark:border-emerald-800",
    textClass: "text-emerald-900 dark:text-emerald-100",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  error: {
    icon: AlertCircle,
    bgClass: "bg-red-50 dark:bg-red-950/30",
    borderClass: "border-red-200 dark:border-red-800",
    textClass: "text-red-900 dark:text-red-100",
    iconClass: "text-red-600 dark:text-red-400",
  },
  info: {
    icon: Info,
    bgClass: "bg-blue-50 dark:bg-blue-950/30",
    borderClass: "border-blue-200 dark:border-blue-800",
    textClass: "text-blue-900 dark:text-blue-100",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  warning: {
    icon: AlertTriangle,
    bgClass: "bg-amber-50 dark:bg-amber-950/30",
    borderClass: "border-amber-200 dark:border-amber-800",
    textClass: "text-amber-900 dark:text-amber-100",
    iconClass: "text-amber-600 dark:text-amber-400",
  },
};

const positionClasses = {
  top: "top-4 left-1/2 -translate-x-1/2",
  bottom: "bottom-4 left-1/2 -translate-x-1/2",
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
};

export function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
  position = "top",
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed z-50 flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border",
        "min-w-[300px] max-w-md",
        "transition-all duration-300 ease-out",
        config.bgClass,
        config.borderClass,
        positionClasses[position],
        isExiting
          ? "opacity-0 scale-95 translate-y-2"
          : "opacity-100 scale-100 translate-y-0",
      )}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <Icon
        className={cn("w-5 h-5 flex-shrink-0 mt-0.5", config.iconClass)}
        aria-hidden="true"
      />
      <p className={cn("flex-1 text-sm font-medium", config.textClass)}>
        {message}
      </p>
      <button
        type="button"
        onClick={handleClose}
        className={cn(
          "flex-shrink-0 p-1 rounded-lg transition-colors",
          "hover:bg-black/5 dark:hover:bg-white/10",
          config.textClass,
        )}
        aria-label="Close notification"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}

// Toast container for managing multiple toasts
export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

export interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
  position?: ToastProps["position"];
}

export function ToastContainer({
  toasts,
  onRemove,
  position = "top",
}: ToastContainerProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div
        className={cn(
          "fixed flex flex-col gap-2 pointer-events-auto",
          positionClasses[position],
        )}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            position={position}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Hook for managing toasts
export interface UseToastReturn {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (
    message: string,
    type: ToastType = "info",
    duration: number = 3000,
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, showToast, removeToast };
}
