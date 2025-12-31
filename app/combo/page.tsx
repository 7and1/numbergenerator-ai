import type { Metadata } from "next";
import { ComboGenerator } from "@/components/generator/ComboGenerator";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Combination Generator - Run Multiple Tools at Once",
  description:
    "Run multiple random generators simultaneously. Generate numbers, passwords, dice rolls, and more with a single click. Export results as CSV or JSON.",
  openGraph: {
    title: "Combination Generator - Run Multiple Tools at Once",
    description:
      "Run multiple random generators simultaneously. Generate numbers, passwords, dice rolls, and more with a single click.",
    type: "website",
    url: "https://numbergenerator.ai/combo/",
    siteName: "NumberGenerator.ai",
  },
  alternates: {
    canonical: "https://numbergenerator.ai/combo/",
  },
};

export default function ComboPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black py-12 px-4">
      <ComboGenerator />

      {/* SEO Content */}
      <article className="max-w-4xl mx-auto mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          About the Combination Generator
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          The Combination Generator allows you to run multiple random generators
          simultaneously with a single click. Perfect for game nights, classroom
          activities, or any situation where you need multiple random values at
          once.
        </p>

        <h3 className="text-xl font-bold tracking-tight mt-6 mb-3">Features</h3>
        <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500">✓</span>
            <span>Add multiple generator slots with different tools</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500">✓</span>
            <span>Generate all results with one click or individually</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500">✓</span>
            <span>Customize parameters for each generator independently</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500">✓</span>
            <span>Export all results as TXT, CSV, or JSON</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500">✓</span>
            <span>Share your combination setup with a unique URL</span>
          </li>
        </ul>

        <h3 className="text-xl font-bold tracking-tight mt-6 mb-3">
          Use Cases
        </h3>
        <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
          <li>
            • <strong>Game Nights:</strong> Roll multiple dice types, draw
            cards, and pick random numbers all at once
          </li>
          <li>
            • <strong>Classroom Activities:</strong> Generate random student
            groups, quiz questions, and prizes
          </li>
          <li>
            • <strong>Contests:</strong> Draw multiple winners with different
            prize tiers simultaneously
          </li>
          <li>
            • <strong>Password Management:</strong> Generate passwords for
            multiple accounts at once
          </li>
          <li>
            • <strong>Data Generation:</strong> Create test data with multiple
            random values
          </li>
        </ul>

        <div className="mt-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-6">
          <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-2">
            Secure & Private
          </h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-400">
            All generation happens locally in your browser using Web Crypto API
            (CSPRNG). Your data never leaves your device. No tracking, no
            storage, complete privacy.
          </p>
        </div>
      </article>
    </main>
  );
}
