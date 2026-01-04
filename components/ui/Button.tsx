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
    "bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 dark:from-violet-500 dark:to-indigo-500 dark:hover:from-violet-400 dark:hover:to-indigo-400 text-white border-transparent hover:shadow-lg hover:shadow-violet-500/25 focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2",
  secondary:
    "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/20 focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2",
  ghost:
    "bg-transparent text-zinc-700 dark:text-zinc-300 border-transparent hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:text-violet-600 dark:hover:text-violet-400 focus:ring-2 focus:ring-violet-500/50 focus:ring-inset",
  danger:
    "bg-rose-600 text-white border-transparent hover:bg-rose-700 focus:ring-2 focus:ring-rose-500/50 focus:ring-offset-2",
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
