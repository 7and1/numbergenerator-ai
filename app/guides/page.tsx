import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Dice6, Key, Hash, Loader2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui";
import { PAGE_BREADCRUMBS } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title: "Guides & Tutorials",
  description:
    "Learn how to use NumberGenerator.ai tools with our comprehensive guides and tutorials.",
};

const guides = [
  {
    title: "Getting Started with Random Numbers",
    description:
      "Learn the basics of generating random numbers in any range, from simple dice rolls to complex numeric sequences.",
    icon: Hash,
    iconColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    tags: ["Beginner", "Numbers"],
  },
  {
    title: "Creating Secure Passwords",
    description:
      "Generate strong, unique passwords for your accounts. Learn about password strength, entropy, and best practices.",
    icon: Key,
    iconColor: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    tags: ["Security", "Passwords"],
  },
  {
    title: "Using the Combo Generator",
    description:
      "Generate multiple random values at once - mix numbers, letters, and symbols in powerful combinations.",
    icon: Loader2,
    iconColor: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    tags: ["Advanced", "Combos"],
  },
  {
    title: "Digital Dice & Coin Flips",
    description:
      "Simulate dice rolls, coin flips, and other random events for games, decisions, and probability experiments.",
    icon: Dice6,
    iconColor: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    tags: ["Games", "Simulation"],
  },
];

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumbs items={PAGE_BREADCRUMBS["/guides"]} />
        </div>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900">
              <BookOpen className="w-8 h-8 text-zinc-900 dark:text-zinc-100" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Guides & Tutorials
            </h1>
          </div>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Learn how to get the most out of NumberGenerator.ai with our
            comprehensive guides.
          </p>
        </header>

        {/* Coming Soon Notice */}
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900 p-6 mb-12">
          <div className="flex gap-3">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
                Guides Coming Soon
              </h2>
              <p className="text-blue-800 dark:text-blue-200">
                We&apos;re working on detailed guides for all our tools. In the
                meantime, each tool includes built-in help and keyboard
                shortcuts (press ? to see them).
              </p>
            </div>
          </div>
        </div>

        {/* Guide Preview Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Upcoming Guides</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {guides.map((guide) => {
              const Icon = guide.icon;
              return (
                <article
                  key={guide.title}
                  className="bg-white dark:bg-zinc-950/30 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-md transition-shadow opacity-75"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${guide.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${guide.iconColor}`} />
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                      Coming Soon
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{guide.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    {guide.description}
                  </p>
                  <div className="flex gap-2">
                    {guide.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Quick Tips */}
        <section className="mt-12 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold mb-4">Quick Tips</h2>
          <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
            <li className="flex gap-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                .
              </span>
              Press{" "}
              <kbd className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-xs font-mono">
                Space
              </kbd>{" "}
              or{" "}
              <kbd className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-xs font-mono">
                Enter
              </kbd>{" "}
              to quickly generate new values
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                .
              </span>
              Press{" "}
              <kbd className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-xs font-mono">
                ?
              </kbd>{" "}
              to see all keyboard shortcuts
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                .
              </span>
              Your recent tools and favorites are saved locally for quick access
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                .
              </span>
              Use the Combo Generator to run multiple generators at once
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
