import Link from "next/link";

import { CONFIG_MAP } from "@/lib/configMap";
import HomeHeroRange from "@/components/generator/HomeHeroRange";
import HomeCollections from "@/components/home/HomeCollections";
import ToolHub from "@/components/home/ToolHub";

// Organization and WebSite structured data for homepage
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NumberGenerator.ai",
  url: "https://numbergenerator.ai",
  logo: "https://numbergenerator.ai/icon-512.png",
  description:
    "Free online random generators for numbers, passwords, PINs, dice, coins, and lottery picks. Secure, fast, and privacy-focused.",
  sameAs: [
    "https://twitter.com/NumberGeneratorAI",
    "https://github.com/numbergenerator-ai",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@numbergenerator.ai",
    contactType: "customer service",
  },
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NumberGenerator.ai",
  url: "https://numbergenerator.ai",
  description:
    "Free random number generators, password generators, and more. Secure client-side generation using CSPRNG.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://numbergenerator.ai/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  const tools = Object.values(CONFIG_MAP).filter(
    (t) => !t.slug.startsWith("template-"),
  );

  // High-priority tools to feature prominently
  const featuredTools = tools.filter((t) => (t.priority ?? 0) >= 0.9);

  return (
    <main id="homepage-main" className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 space-y-12">
        {/* Header Section */}
        <header className="text-center space-y-6">
          <h1
            id="page-heading"
            className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent"
          >
            NumberGenerator.ai
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Fast, secure random generators for numbers, passwords, PINs, dice,
            and lottery picks.
          </p>
          <nav
            className="flex flex-col sm:flex-row gap-3 justify-center"
            aria-label="Quick links"
          >
            <Link
              href="/1-100"
              className="h-12 min-h-[44px] px-6 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 dark:from-violet-500 dark:to-indigo-500 dark:hover:from-violet-400 dark:hover:to-indigo-400 text-white font-bold inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25 active:scale-95"
            >
              Random Number 1-100
            </Link>
            <Link
              href="/password-strong"
              className="h-12 min-h-[44px] px-6 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 font-bold inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-zinc-400/50 focus-visible:ring-offset-2 transition-all duration-200 hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:scale-105 active:scale-95"
            >
              Strong Password
            </Link>
            <Link
              href="/combo"
              className="h-12 min-h-[44px] px-6 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 font-bold inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-zinc-400/50 focus-visible:ring-offset-2 transition-all duration-200 hover:border-violet-400 dark:hover:border-violet-600 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:scale-105 active:scale-95"
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
        {/* UsageHeatMap temporarily disabled due to SSR issues */}

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
                    className="group block rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/50 p-5 shadow-sm hover:shadow-lg hover:shadow-violet-500/10 hover:border-violet-300 dark:hover:border-violet-700/50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 h-full hover:-translate-y-1"
                  >
                    <div className="text-lg font-black tracking-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200">
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
                  className="group block rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/50 p-5 shadow-sm hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 h-full hover:-translate-y-0.5 hover:border-violet-300 dark:hover:border-violet-700/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-lg font-black tracking-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200 truncate">
                        {tool.title}
                      </div>
                      <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {tool.description}
                      </div>
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-lg bg-zinc-100/80 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-800/60 flex-shrink-0"
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

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema),
          }}
        />
      </div>
    </main>
  );
}
