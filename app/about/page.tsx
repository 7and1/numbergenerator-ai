import type { Metadata } from "next";
import { Heart, Shield, Zap, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/ui";
import { PAGE_BREADCRUMBS } from "@/lib/breadcrumbs";

const BASE_URL = "https://numbergenerator.ai";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about NumberGenerator.ai - free, secure random number generators with no tracking, no ads, and no data collection.",
  alternates: {
    canonical: `${BASE_URL}/about/`,
  },
  openGraph: {
    title: "About NumberGenerator.ai",
    description:
      "Learn about NumberGenerator.ai - free, secure random number generators with no tracking, no ads, and no data collection.",
    url: `${BASE_URL}/about/`,
    siteName: "NumberGenerator.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About NumberGenerator.ai",
    description:
      "Learn about NumberGenerator.ai - free, secure random number generators with no tracking, no ads, and no data collection.",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumbs items={PAGE_BREADCRUMBS["/about"]} />
        </div>

        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            About NumberGenerator.ai
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Fast, secure random number generators built with privacy-first
            principles. No tracking. No ads. No data collection.
          </p>
        </header>

        {/* Mission */}
        <section className="mb-12">
          <div className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
            <Heart className="w-12 h-12 text-red-500 fill-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-zinc-700 dark:text-zinc-300">
              We believe everyone should have access to fast, secure random
              number generation tools without sacrificing their privacy.
              That&apos;s why we built NumberGenerator.ai - a free, open
              platform that respects your data and your time.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Privacy First */}
            <div className="bg-white dark:bg-zinc-950/30 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Privacy First</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                All generation happens locally in your browser. We don&apos;t
                track, collect, or store any personal data. Your numbers stay
                yours.
              </p>
            </div>

            {/* Fast & Simple */}
            <div className="bg-white dark:bg-zinc-950/30 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast & Simple</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                No clutter, no distractions. Just instant results with a clean,
                intuitive interface that works on any device.
              </p>
            </div>

            {/* Security */}
            <div className="bg-white dark:bg-zinc-950/30 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Cryptographically Secure
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                We use Web Crypto API&apos;s CSPRNG - the same security model
                browsers use for HTTPS encryption. Suitable for
                security-sensitive applications.
              </p>
            </div>

            {/* Free Forever */}
            <div className="bg-white dark:bg-zinc-950/30 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Free Forever</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                No premium tiers, no paywalls, no subscriptions. All tools are
                completely free for everyone, always.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          <div className="bg-white dark:bg-zinc-950/30 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold flex items-center justify-center text-sm">
                  1
                </span>
                <div>
                  <h3 className="font-bold mb-1">Select Your Tool</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Choose from our collection of random generators - numbers,
                    passwords, PINs, dice, coins, and more.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold flex items-center justify-center text-sm">
                  2
                </span>
                <div>
                  <h3 className="font-bold mb-1">Configure Settings</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Adjust parameters like range, count, format, and more
                    depending on the tool.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold flex items-center justify-center text-sm">
                  3
                </span>
                <div>
                  <h3 className="font-bold mb-1">Generate Instantly</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Click generate and get cryptographically secure random
                    results instantly. Copy, save, or generate again.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* Contact */}
        <section className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
            <h2 className="text-xl font-bold">Get In Touch</h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Have questions, suggestions, or feedback? We&apos;d love to hear
            from you at{" "}
            <a
              href="mailto:hello@numbergenerator.ai"
              className="text-zinc-900 dark:text-zinc-100 hover:underline font-medium"
            >
              hello@numbergenerator.ai
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
