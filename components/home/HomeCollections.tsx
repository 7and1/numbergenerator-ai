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
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/30 p-5 shadow-sm flex items-start justify-between gap-3">
      <div className="min-w-0">
        <Link
          href={item.href}
          className="text-lg font-black tracking-tight hover:underline underline-offset-4"
        >
          {item.title}
        </Link>
        {item.description && (
          <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {item.description}
          </div>
        )}
      </div>
      {right}
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
    <section className="space-y-6" aria-label="Your collections">
      {favorites.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black tracking-wide uppercase text-zinc-400">
              Favorites
            </h2>
            <button
              type="button"
              onClick={() => {
                clearFavorites();
              }}
              className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white inline-flex items-center gap-2"
              aria-label="Clear all favorites"
            >
              <Trash2 size={14} aria-hidden="true" /> <span>Clear</span>
            </button>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
            {favorites.map((f) => (
              <li key={f.key}>
                <Card
                  item={f}
                  right={
                    <button
                      type="button"
                      aria-label={`Remove ${f.title} from favorites`}
                      onClick={() => toggleFavorite(f)}
                      className="shrink-0 h-10 w-10 inline-flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <Star size={18} fill="currentColor" aria-hidden="true" />
                    </button>
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {recents.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black tracking-wide uppercase text-zinc-400">
              Recent
            </h2>
            <button
              type="button"
              onClick={() => {
                clearRecents();
              }}
              className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white inline-flex items-center gap-2"
              aria-label="Clear all recent items"
            >
              <Trash2 size={14} aria-hidden="true" /> <span>Clear</span>
            </button>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
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
