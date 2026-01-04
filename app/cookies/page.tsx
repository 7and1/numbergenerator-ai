import type { Metadata } from "next";
import { Cookie, Eye, Trash2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui";
import { PAGE_BREADCRUMBS } from "@/lib/breadcrumbs";

const BASE_URL = "https://numbergenerator.ai";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Learn how NumberGenerator.ai uses cookies and local storage. We use minimal, essential storage only - no tracking cookies.",
  alternates: {
    canonical: `${BASE_URL}/cookies/`,
  },
  openGraph: {
    title: "Cookie Policy - NumberGenerator.ai",
    description:
      "Learn how NumberGenerator.ai uses cookies and local storage. Minimal, essential storage only.",
    url: `${BASE_URL}/cookies/`,
    siteName: "NumberGenerator.ai",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cookie Policy - NumberGenerator.ai",
    description:
      "Learn how NumberGenerator.ai uses cookies and local storage. Minimal, essential storage only.",
  },
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumbs items={PAGE_BREADCRUMBS["/cookies"]} />
        </div>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900">
              <Cookie className="w-8 h-8 text-zinc-900 dark:text-zinc-100" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Cookie Policy
            </h1>
          </div>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </header>

        {/* Summary */}
        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 mb-12">
          <h2 className="text-xl font-bold mb-4">Key Takeaway</h2>
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            <strong>We do not use tracking cookies.</strong> We only use
            essential local storage to remember your preferences and recent
            tools. Everything stays on your device and can be cleared at any
            time.
          </p>
        </div>

        {/* Cookie Sections */}
        <section className="space-y-8">
          {/* What We Use */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">What We Use</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                NumberGenerator.ai uses browser local storage for essential
                functionality only:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
                <li>
                  <strong>Recent Tools:</strong> Saves the tools you&apos;ve
                  used recently for quick access
                </li>
                <li>
                  <strong>Favorites:</strong> Remembers your favorited tools and
                  settings
                </li>
                <li>
                  <strong>Theme Preference:</strong> Remembers if you prefer
                  light or dark mode
                </li>
                <li>
                  <strong>Session Data:</strong> Temporary storage during active
                  tool usage
                </li>
              </ul>
            </div>
          </div>

          {/* What We Don't Use */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Eye className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">What We Don&apos;t Use</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                We explicitly do NOT use the following types of cookies and
                tracking:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
                <li>
                  <strong>No Analytics Cookies:</strong> We don&apos;t use
                  Google Analytics or any similar services
                </li>
                <li>
                  <strong>No Advertising Cookies:</strong> We don&apos;t show
                  ads or track you for advertising purposes
                </li>
                <li>
                  <strong>No Third-Party Cookies:</strong> We don&apos;t embed
                  third-party scripts that set cookies
                </li>
                <li>
                  <strong>No Tracking Pixels:</strong> We don&apos;t use
                  invisible tracking beacons
                </li>
                <li>
                  <strong>No Fingerprinting:</strong> We don&apos;t create
                  device fingerprints for tracking
                </li>
              </ul>
            </div>
          </div>

          {/* Local Storage vs Cookies */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">
                Local Storage vs Cookies
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                We primarily use Local Storage instead of traditional cookies
                because:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
                <li>
                  <strong>More Storage:</strong> Local Storage can hold more
                  data than cookies
                </li>
                <li>
                  <strong>Better Performance:</strong> Local Storage
                  doesn&apos;t get sent with every HTTP request
                </li>
                <li>
                  <strong>No Cross-Site Tracking:</strong> Local Storage is
                  restricted to the current domain
                </li>
                <li>
                  <strong>Easier to Clear:</strong> You can clear site data
                  without affecting other sites
                </li>
              </ul>
            </div>
          </div>

          {/* Browser Settings */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">Controlling Your Data</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                You have full control over your stored data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
                <li>
                  <strong>Clear Site Data:</strong> Use your browser&apos;s
                  &quot;Clear site data&quot; option in the address bar lock
                  menu
                </li>
                <li>
                  <strong>Private Browsing:</strong> Use incognito/private mode
                  for sessions that leave no trace
                </li>
                <li>
                  <strong>Browser Settings:</strong> Configure your browser to
                  block all cookies/storage (note: this will break the favorites
                  feature)
                </li>
                <li>
                  <strong>In-App Clear:</strong> Use the clear button in our
                  tools to reset your preferences
                </li>
              </ul>
              <p className="text-zinc-600 dark:text-zinc-400 mt-3">
                Note: Disabling local storage will prevent the favorites and
                recent tools features from working, but all generators will
                still function normally.
              </p>
            </div>
          </div>

          {/* GDPR/CCPA */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">
                Your Rights (GDPR/CCPA)
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Since we only store data locally on your device and process
                nothing on our servers, standard GDPR and CCPA rights around
                data access and deletion don&apos;t apply in the traditional
                sense - you control your data entirely through your browser. If
                you have questions, contact us at{" "}
                <a
                  href="mailto:hello@numbergenerator.ai"
                  className="text-zinc-900 dark:text-zinc-100 hover:underline"
                >
                  hello@numbergenerator.ai
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-12 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold mb-3">Questions?</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            If you have any questions about our use of cookies or local storage,
            please contact us at{" "}
            <a
              href="mailto:hello@numbergenerator.ai"
              className="text-zinc-900 dark:text-zinc-100 hover:underline"
            >
              hello@numbergenerator.ai
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
