import Link from "next/link";

import { CONFIG_MAP } from "@/lib/configMap";
import HomeHeroRange from "@/components/generator/HomeHeroRange";
import HomeCollections from "@/components/home/HomeCollections";
import ToolHub from "@/components/home/ToolHub";
import { UsageHeatMap } from "@/components/home/UsageHeatMap";

export default function Home() {
  const tools = Object.values(CONFIG_MAP).filter(
    (t) => !t.slug.startsWith("template-"),
  );

  // High-priority tools to feature prominently
  const featuredTools = tools.filter((t) => (t.priority ?? 0) >= 0.9);

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-12">
        {/* Header Section */}
        <header className="text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight">
            NumberGenerator.ai
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto">
            Fast, secure random generators for numbers, passwords, PINs, dice,
            and lottery picks.
          </p>
          <nav
            className="flex flex-col sm:flex-row gap-3 justify-center"
            aria-label="Quick links"
          >
            <Link
              href="/1-100"
              className="h-12 min-h-[44px] px-6 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:ring-offset-2 transition-transform hover:scale-105 active:scale-95"
            >
              Random Number 1-100
            </Link>
            <Link
              href="/password-strong"
              className="h-12 min-h-[44px] px-6 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-zinc-400/50 focus-visible:ring-offset-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              Strong Password
            </Link>
            <Link
              href="/combo"
              className="h-12 min-h-[44px] px-6 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 font-bold inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-zinc-400/50 focus-visible:ring-offset-2 transition-colors hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              Combo Generator
            </Link>
          </nav>
        </header>

        {/* Hero Range Generator */}
        <section aria-label="Quick number generator">
          <HomeHeroRange defaultMin={1} defaultMax={10} />
        </section>

        {/* User Favorites & Recents */}
        <section aria-label="Your collections">
          <HomeCollections />
        </section>

        {/* Usage Heat Map */}
        <section aria-label="Usage statistics">
          <UsageHeatMap />
        </section>

        {/* Featured Tools Section */}
        {featuredTools.length > 0 && (
          <section aria-labelledby="featured-tools-heading">
            <div className="flex items-center justify-between mb-6">
              <h2
                id="featured-tools-heading"
                className="text-2xl font-bold tracking-tight"
              >
                Popular Tools
              </h2>
            </div>
            <ul
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
              role="list"
            >
              {featuredTools.slice(0, 8).map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/${tool.slug}`}
                    className="group block rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/30 p-5 shadow-sm hover:shadow-md hover:border-zinc-400 dark:hover:border-zinc-600 transition-all focus-visible:ring-2 focus-visible:ring-zinc-400/50 focus-visible:ring-offset-2 h-full"
                  >
                    <div className="text-lg font-black tracking-tight group-hover:underline underline-offset-4">
                      {tool.title}
                    </div>
                    <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {tool.description}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Categorized Tool Hub */}
        <section aria-label="Tool categories">
          <ToolHub />
        </section>

        {/* All Tools Grid (for SEO) */}
        <section aria-labelledby="all-tools-heading">
          <h2
            id="all-tools-heading"
            className="text-2xl font-bold tracking-tight mb-6"
          >
            All Tools
          </h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/${tool.slug}`}
                  className="group block rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/30 p-5 shadow-sm hover:shadow-md transition-shadow focus-visible:ring-2 focus-visible:ring-zinc-400/50 focus-visible:ring-offset-2 h-full"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-lg font-black tracking-tight group-hover:underline underline-offset-4 truncate">
                        {tool.title}
                      </div>
                      <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {tool.description}
                      </div>
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 flex-shrink-0"
                      aria-label={`Mode: ${tool.mode}`}
                    >
                      {tool.mode.toUpperCase()}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-zinc-400 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <p className="mb-2">
            Built with Web Crypto CSPRNG. No tracking. No ads.
          </p>
          <nav aria-label="Footer navigation">
            <Link
              href="/sitemap.xml"
              className="hover:underline focus-visible:underline"
            >
              Sitemap
            </Link>
            {" | "}
            <a
              href="https://github.com"
              className="hover:underline focus-visible:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </nav>
        </footer>
      </div>
    </main>
  );
}
