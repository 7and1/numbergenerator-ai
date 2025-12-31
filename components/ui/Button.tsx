"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-black text-white dark:bg-white dark:text-black border-transparent hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:ring-2 focus:ring-black/50 focus:ring-offset-2 dark:focus:ring-white/50",
  secondary:
    "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-400/50 focus:ring-offset-2",
  ghost:
    "bg-transparent text-zinc-700 dark:text-zinc-300 border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-400/50 focus:ring-inset",
  danger:
    "bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm font-semibold rounded-lg",
  md: "h-10 px-4 text-sm font-bold rounded-xl",
  lg: "h-12 px-6 text-base font-bold rounded-xl",
};

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: "w-4 h-4",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 border transition-all duration-150",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus-visible:outline-none",
          "active:scale-[0.98]",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className,
        )}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <Loader2
            className={cn("animate-spin", iconSizeStyles[size])}
            aria-hidden="true"
          />
        )}
        {!loading && icon && iconPosition === "left" && (
          <span
            className={cn("flex-shrink-0", iconSizeStyles[size])}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        {children && <span>{children}</span>}
        {!loading && icon && iconPosition === "right" && (
          <span
            className={cn("flex-shrink-0", iconSizeStyles[size])}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
