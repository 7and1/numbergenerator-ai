"use client";

import Link from "next/link";
import { Star, Trash2 } from "lucide-react";
import { memo, useSyncExternalStore } from "react";

import type { FavoriteItem, RecentItem } from "@/lib/userData";
import {
  clearFavorites,
  clearRecents,
  getUserDataServerSnapshot,
  getUserDataSnapshot,
  subscribeUserData,
  toggleFavorite,
} from "@/lib/userData";

const Card = memo(function Card({
  item,
  right,
}: {
  item: { href: string; title: string; description?: string };
  right?: React.ReactNode;
}) {
  return (
    <div className="group relative h-full rounded-[1.25rem] border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/50 p-5 shadow-sm hover:shadow-xl hover:shadow-zinc-900/8 dark:hover:shadow-black/30 hover:border-violet-300 dark:hover:border-violet-700/50 hover:-translate-y-1 transition-all duration-200 flex items-start justify-between gap-4 overflow-hidden backdrop-blur-sm">
      <Link
        href={item.href}
        className="absolute inset-0 z-0"
        aria-label={`Go to ${item.title}`}
      />
      <div className="min-w-0 relative z-10 pointer-events-none flex-1">
        <div className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200 mb-1.5">
          {item.title}
        </div>
        {item.description && (
          <div className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-200">
            {item.description}
          </div>
        )}
      </div>
      {right && <div className="relative z-20 shrink-0 pt-0.5">{right}</div>}
    </div>
  );
});

export default function HomeCollections() {
  const { favorites, recents } = useSyncExternalStore(
    subscribeUserData,
    getUserDataSnapshot,
    getUserDataServerSnapshot,
  ) as { favorites: FavoriteItem[]; recents: RecentItem[] };

  if (favorites.length === 0 && recents.length === 0) return null;

  return (
    <section className="space-y-12" aria-label="Your collections">
      {favorites.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between px-1.5">
            <h2 className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              Favorites
            </h2>
            <button
              type="button"
              onClick={() => {
                clearFavorites();
              }}
              className="text-[10px] font-bold text-zinc-400 hover:text-red-500 transition-colors inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 uppercase tracking-wider"
              aria-label="Clear all favorites"
            >
              <Trash2 size={12} aria-hidden="true" /> <span>Clear All</span>
            </button>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" role="list">
            {favorites.map((f) => (
              <li key={f.key}>
                <Card
                  item={f}
                  right={
                    <button
                      type="button"
                      aria-label={`Remove ${f.title} from favorites`}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleFavorite(f);
                      }}
                      className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-zinc-100 dark:border-zinc-800 text-amber-400 bg-amber-50 dark:bg-amber-900/10 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 hover:border-red-100 dark:hover:border-red-900/30 transition-all shadow-sm"
                    >
                      <Star
                        size={18}
                        className="fill-current"
                        aria-hidden="true"
                      />
                    </button>
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {recents.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between px-1.5">
            <h2 className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              Recent History
            </h2>
            <button
              type="button"
              onClick={() => {
                clearRecents();
              }}
              className="text-[10px] font-bold text-zinc-400 hover:text-red-500 transition-colors inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 uppercase tracking-wider"
              aria-label="Clear all recent items"
            >
              <Trash2 size={12} aria-hidden="true" /> <span>Clear All</span>
            </button>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" role="list">
            {recents.map((r) => (
              <li key={r.key}>
                <Card item={r} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
