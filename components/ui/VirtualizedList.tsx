"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";

export interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  estimatedItemHeight?: number;
  overscan?: number;
  maxHeight?: string | number;
  getKey?: (item: T, index: number) => string;
  loading?: boolean;
  skeletonCount?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  disableVirtualization?: boolean;
  debug?: boolean;
  className?: string;
  ariaLabel?: string;
  onScroll?: (scrollTop: number, scrollHeight: number) => void;
  initialScrollTop?: number;
}

export interface VirtualizedListRef {
  scrollToIndex: (index: number, align?: "start" | "center" | "end") => void;
  scrollToPosition: (position: number) => void;
  getScrollPosition: () => number;
  refreshHeights: () => void;
}

const DEFAULT_ITEM_HEIGHT = 40;
const DEFAULT_OVERSCAN = 3;

export function VirtualizedList<T>(
  props: VirtualizedListProps<T>,
): React.JSX.Element {
  const {
    items,
    renderItem,
    estimatedItemHeight = DEFAULT_ITEM_HEIGHT,
    overscan = DEFAULT_OVERSCAN,
    maxHeight = 320,
    getKey,
    loading = false,
    skeletonCount = 5,
    emptyTitle,
    emptyDescription,
    disableVirtualization = false,
    debug = false,
    className,
    ariaLabel = "List",
    onScroll,
    initialScrollTop = 0,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLOListElement>(null);
  const itemHeightsRef = useRef<Map<number, number>>(new Map());
  const scrollTopRef = useRef(initialScrollTop);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const shouldVirtualize = useMemo(() => {
    if (disableVirtualization) return false;
    return items.length > 20 && containerHeight > 0;
  }, [disableVirtualization, items.length, containerHeight]);

  const totalHeight = useMemo(() => {
    if (!shouldVirtualize) return "auto";
    let height = 0;
    for (let i = 0; i < items.length; i++) {
      const h = itemHeightsRef.current.get(i) ?? estimatedItemHeight;
      height += h;
    }
    return height;
  }, [shouldVirtualize, items.length, estimatedItemHeight, items]);

  const visibleRange = useMemo(() => {
    if (!shouldVirtualize) {
      return { start: 0, end: items.length };
    }

    const scrollTop = scrollTopRef.current;
    let start = 0;
    let accumulatedHeight = 0;

    for (let i = 0; i < items.length; i++) {
      const itemHeight = itemHeightsRef.current.get(i) ?? estimatedItemHeight;
      const threshold = scrollTop - overscan * estimatedItemHeight;
      if (accumulatedHeight + itemHeight > threshold) {
        start = Math.max(0, i - overscan);
        break;
      }
      accumulatedHeight += itemHeight;
    }

    let end = start;
    accumulatedHeight = 0;
    const targetHeight = containerHeight + overscan * 2 * estimatedItemHeight;

    for (let i = start; i < items.length; i++) {
      const itemHeight = itemHeightsRef.current.get(i) ?? estimatedItemHeight;
      accumulatedHeight += itemHeight;
      if (accumulatedHeight > targetHeight) {
        end = Math.min(items.length, i + overscan);
        break;
      }
      end = Math.min(items.length, i + overscan + 1);
    }

    if (end <= start) {
      return { start: 0, end: items.length };
    }

    return { start, end };
  }, [
    shouldVirtualize,
    items.length,
    containerHeight,
    estimatedItemHeight,
    overscan,
  ]);

  const offsetY = useMemo(() => {
    if (!shouldVirtualize) return 0;
    let offset = 0;
    for (let i = 0; i < visibleRange.start; i++) {
      const h = itemHeightsRef.current.get(i) ?? estimatedItemHeight;
      offset += h;
    }
    return offset;
  }, [shouldVirtualize, visibleRange.start, estimatedItemHeight]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => {
      const rect = container.getBoundingClientRect();
      setContainerHeight(rect.height);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (initialScrollTop > 0 && containerRef.current) {
      containerRef.current.scrollTop = initialScrollTop;
      scrollTopRef.current = initialScrollTop;
    }
  }, [initialScrollTop]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = e.currentTarget.scrollTop;
      scrollTopRef.current = scrollTop;

      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      onScroll?.(scrollTop, e.currentTarget.scrollHeight);
    },
    [onScroll],
  );

  useEffect(() => {
    if (!shouldVirtualize || !innerRef.current) return;

    const timeout = setTimeout(() => {
      const children = innerRef.current?.children;
      if (!children) return;

      const newHeights = new Map(itemHeightsRef.current);
      let changed = false;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child instanceof HTMLElement) {
          const dataIndex = Number(child.dataset.index);
          if (!Number.isNaN(dataIndex)) {
            const height = child.offsetHeight;
            if (height !== newHeights.get(dataIndex)) {
              newHeights.set(dataIndex, height);
              changed = true;
            }
          }
        }
      }

      if (changed) {
        itemHeightsRef.current = newHeights;
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [shouldVirtualize, visibleRange, items]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;

      const itemHeight = estimatedItemHeight;
      const pageHeight = containerHeight - itemHeight;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          container.scrollBy({ top: itemHeight, behavior: "smooth" });
          break;
        case "ArrowUp":
          e.preventDefault();
          container.scrollBy({ top: -itemHeight, behavior: "smooth" });
          break;
        case "PageDown":
          e.preventDefault();
          container.scrollBy({ top: pageHeight, behavior: "smooth" });
          break;
        case "PageUp":
          e.preventDefault();
          container.scrollBy({ top: -pageHeight, behavior: "smooth" });
          break;
        case "Home":
          e.preventDefault();
          container.scrollTo({ top: 0, behavior: "smooth" });
          break;
        case "End":
          e.preventDefault();
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          });
          break;
      }
    },
    [estimatedItemHeight, containerHeight],
  );

  if (loading) {
    return (
      <div
        className={cn(
          "overflow-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/30 p-4",
          className,
        )}
        style={{ maxHeight }}
        role="status"
        aria-live="polite"
        aria-label="Loading items"
      >
        <SkeletonList items={skeletonCount} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/30 p-4",
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <EmptyState
          type="no-items"
          title={emptyTitle}
          description={emptyDescription}
          size="sm"
        />
      </div>
    );
  }

  if (!shouldVirtualize) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "overflow-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/30 p-4",
          className,
        )}
        style={{ maxHeight }}
        role="list"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <ol className="space-y-1.5">
          {items.map((item, index) => (
            <li key={getKey?.(item, index) ?? String(index)} role="listitem">
              {renderItem(item, index)}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  const visibleItems = items.slice(visibleRange.start, visibleRange.end);
  const totalHeightNum = typeof totalHeight === "number" ? totalHeight : 0;
  const scrollPercent =
    totalHeightNum > containerHeight
      ? Math.round(
          (scrollTopRef.current / (totalHeightNum - containerHeight)) * 100,
        )
      : 100;

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={cn(
          "overflow-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/30 p-4",
          className,
        )}
        style={{ maxHeight }}
        onScroll={handleScroll}
        role="list"
        aria-label={ariaLabel}
        aria-setsize={items.length}
        aria-live="polite"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div style={{ height: offsetY }} aria-hidden="true" />

        <ol ref={innerRef} className="space-y-1.5">
          {visibleItems.map((item, relativeIndex) => {
            const actualIndex = visibleRange.start + relativeIndex;
            return (
              <li
                key={getKey?.(item, actualIndex) ?? String(actualIndex)}
                data-index={actualIndex}
                role="listitem"
                aria-posinset={actualIndex + 1}
                aria-setsize={items.length}
              >
                {renderItem(item, actualIndex)}
              </li>
            );
          })}
        </ol>

        <div
          style={{ height: Math.max(0, totalHeightNum - offsetY) }}
          aria-hidden="true"
        />
      </div>

      {debug && (
        <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono bg-zinc-100 dark:bg-zinc-800 rounded p-2">
          <div>Items: {items.length}</div>
          <div>
            Visible: {visibleRange.start} - {visibleRange.end}
          </div>
          <div>Rendering: {visibleItems.length} items</div>
          <div>Total height: {totalHeightNum}px</div>
          <div>Container: {Math.round(containerHeight)}px</div>
          <div>Scroll top: {Math.round(scrollTopRef.current)}px</div>
          <div>Offset Y: {Math.round(offsetY)}px</div>
        </div>
      )}

      {isScrolling && (
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-zinc-900/80 dark:bg-white/80 text-white dark:text-black text-xs rounded-full opacity-50 pointer-events-none">
          {scrollPercent}%
        </div>
      )}
    </div>
  );
}

function SkeletonList({ items }: { items: number }) {
  return (
    <ol className="space-y-1.5">
      {Array.from({ length: items }).map((_, i) => (
        <li key={i} className="flex gap-3">
          <span className="w-10 shrink-0">
            <Skeleton variant="text" width={40} height={16} />
          </span>
          <span className="flex-1">
            <Skeleton variant="text" width="100%" height={16} />
          </span>
        </li>
      ))}
    </ol>
  );
}

export function useVirtualizedListRef(): {
  ref: React.RefObject<VirtualizedListRef | null>;
  scrollToIndex: (index: number, align?: "start" | "center" | "end") => void;
  scrollToPosition: (position: number) => void;
  refreshHeights: () => void;
} {
  const ref = useRef<VirtualizedListRef | null>(null);

  const scrollToIndex = useCallback(
    (index: number, align: "start" | "center" | "end" = "start") => {
      ref.current?.scrollToIndex(index, align);
    },
    [],
  );

  const scrollToPosition = useCallback((position: number) => {
    ref.current?.scrollToPosition(position);
  }, []);

  const refreshHeights = useCallback(() => {
    ref.current?.refreshHeights();
  }, []);

  return { ref, scrollToIndex, scrollToPosition, refreshHeights };
}
