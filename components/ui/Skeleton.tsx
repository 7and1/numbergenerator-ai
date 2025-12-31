"use client";

import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

const variantStyles = {
  text: "rounded h-4",
  circular: "rounded-full",
  rectangular: "rounded-none",
  rounded: "rounded-lg",
};

const animationStyles = {
  pulse: "animate-pulse",
  wave: "animate-shimmer",
  none: "",
};

export function Skeleton({
  className,
  variant = "text",
  width,
  height,
  animation = "pulse",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-zinc-200 dark:bg-zinc-800",
        variantStyles[variant],
        animationStyles[animation],
        className,
      )}
      style={{ width, height }}
      aria-hidden="true"
      {...props}
    />
  );
}

// Skeleton card component
export interface SkeletonCardProps {
  className?: string;
  showAvatar?: boolean;
  lines?: number;
}

export function SkeletonCard({
  className,
  showAvatar = false,
  lines = 3,
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl border border-zinc-200 dark:border-zinc-800",
        className,
      )}
    >
      {showAvatar && (
        <div className="flex items-center gap-3 mb-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1">
            <Skeleton className="mb-2" width="60%" height={16} />
            <Skeleton width="40%" height={12} />
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Skeleton width="100%" height={16} />
        <Skeleton width="90%" height={16} />
        {lines > 2 && <Skeleton width="80%" height={16} />}
        {lines > 3 && <Skeleton width="70%" height={16} />}
      </div>
    </div>
  );
}

// Skeleton list component
export interface SkeletonListProps {
  className?: string;
  items?: number;
}

export function SkeletonList({ className, items = 5 }: SkeletonListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="circular" width={32} height={32} />
          <div className="flex-1 space-y-2">
            <Skeleton width="70%" height={14} />
            <Skeleton width="40%" height={12} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton table component
export interface SkeletonTableProps {
  className?: string;
  rows?: number;
  columns?: number;
}

export function SkeletonTable({
  className,
  rows = 5,
  columns = 4,
}: SkeletonTableProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="flex gap-4 mb-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`h-${i}`} className="flex-1" height={20} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`r-${rowIndex}`} className="flex gap-4 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`c-${colIndex}`} className="flex-1" height={16} />
          ))}
        </div>
      ))}
    </div>
  );
}
