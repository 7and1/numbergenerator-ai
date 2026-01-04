import type { Metadata } from "next";
import { HelpCircle, Shield, Zap, Smartphone, Globe, Code } from "lucide-react";
import { Breadcrumbs } from "@/components/ui";
import { PAGE_BREADCRUMBS } from "@/lib/breadcrumbs";

const BASE_URL = "https://numbergenerator.ai";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions",
  description:
    "Find answers to common questions about NumberGenerator.ai - privacy, security, how it works, and more.",
  alternates: {
    canonical: `${BASE_URL}/faq/`,
  },
  openGraph: {
    title: "FAQ - NumberGenerator.ai",
    description:
      "Find answers to common questions about NumberGenerator.ai - privacy, security, how it works, and more.",
    url: `${BASE_URL}/faq/`,
    siteName: "NumberGenerator.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ - NumberGenerator.ai",
    description:
      "Find answers to common questions about NumberGenerator.ai - privacy, security, how it works, and more.",
  },
};

const faqs = [
  {
    icon: HelpCircle,
    iconColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    question: "How does the random number generation work?",
    answer:
      "We use the Web Crypto API's getRandomValues() method, which provides cryptographically secure random numbers (CSPRNG). This is the same technology browsers use for HTTPS/TLS encryption, ensuring truly unpredictable results suitable for security-sensitive applications.",
  },
  {
    icon: Shield,
    iconColor: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    question: "Is my data private? Do you track me?",
    answer:
      "Absolutely. All number generation happens locally in your browser. Nothing is sent to our servers. We don&apos;t use tracking cookies, analytics, or collect any personal information. Your generated numbers, settings, and usage patterns remain completely private.",
  },
  {
    icon: Zap,
    iconColor: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    question: "Can I use these random numbers for gambling or passwords?",
    answer:
      "Our generators use cryptographically secure methods (CSPRNG), making them suitable for many applications including password generation. However, for gambling or regulated activities, always verify compliance with local regulations and use certified RNG systems as required by law.",
  },
  {
    icon: Smartphone,
    iconColor: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    question: "Does this work on mobile devices?",
    answer:
      "Yes! NumberGenerator.ai is fully responsive and works on all devices - smartphones, tablets, and desktop computers. The site can also be installed as a PWA (Progressive Web App) for offline use on supported devices.",
  },
  {
    icon: Code,
    iconColor: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    question: "Can I integrate this into my website?",
    answer:
      "We offer embed codes for most tools. Look for the 'Embed' button on any tool page to get copy-paste HTML code. We're also working on a REST API for programmatic access (coming soon).",
  },
  {
    icon: Globe,
    iconColor: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    question: "Do I need an account to use these tools?",
    answer:
      "No account required! All tools are free to use without registration. Your favorites and recent tools are stored locally in your browser for convenience, but you can use everything anonymously.",
  },
  {
    icon: Shield,
    iconColor: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    question: "Are these truly random? What about pseudo-random?",
    answer:
      "The 'pseudo' in CSPRNG refers to how the numbers are algorithmically generated, but they are cryptographically indistinguishable from true randomness. The Web Crypto API draws from the operating system's entropy pool (which includes hardware events, thermal noise, etc.), making the output suitable for cryptographic applications.",
  },
  {
    icon: HelpCircle,
    iconColor: "text-zinc-600 dark:text-zinc-400",
    bgColor: "bg-zinc-100 dark:bg-zinc-900",
    question: "What's the difference between the various generators?",
    answer:
      "Each tool is optimized for specific use cases: Range generators for number picking, Password generators for secure credentials, PIN generators for numeric codes, Dice/Coin for game simulation, and Lottery for number combinations. The Combo Generator lets you run multiple operations at once.",
  },
];

// Build FAQPage schema for structured data
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage" as const,
  mainEntity: faqs.map((faq) => ({
    "@type": "Question" as const,
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer" as const,
      text: faq.answer,
    },
  })),
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      {/* FAQPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumbs items={PAGE_BREADCRUMBS["/faq"]} />
        </div>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900">
              <HelpCircle className="w-8 h-8 text-zinc-900 dark:text-zinc-100" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Everything you need to know about NumberGenerator.ai
          </p>
        </header>

        {/* FAQ List */}
        <div className="space-y-6">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            return (
              <article
                key={index}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/30 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-xl ${faq.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${faq.iconColor}`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold mb-2">{faq.question}</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Still Have Questions */}
        <section className="mt-12 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold mb-3">Still have questions?</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Can&apos;t find the answer you&apos;re looking for? Please reach out
            to our team at{" "}
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
