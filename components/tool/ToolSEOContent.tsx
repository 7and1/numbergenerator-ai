import type { ToolConfig } from "@/lib/types";
import Link from "next/link";
import { ChevronRight, CheckCircle2, HelpCircle, BookOpen } from "lucide-react";

interface ToolSEOContentProps {
  config: ToolConfig;
}

export default function ToolSEOContent({ config }: ToolSEOContentProps) {
  const { title, description, faq, how_to, features } = config;

  return (
    <article className="mt-16 space-y-12 border-t border-zinc-200 dark:border-zinc-800 pt-12">
      {/* Description Section */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          About {title}
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {description}
        </p>
      </section>

      {/* How To Section */}
      {how_to && how_to.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-zinc-500" />
            <h2 className="text-2xl font-bold tracking-tight">
              How to Use {title}
            </h2>
          </div>
          <ol className="space-y-4">
            {how_to.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-sm font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                  {index + 1}
                </span>
                <span className="text-zinc-600 dark:text-zinc-400 pt-1">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Features Section */}
      {features && features.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-6">Features</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQ Section */}
      {faq && faq.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-zinc-500" />
            <h2 className="text-2xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <dl className="space-y-6">
            {faq.map((item, index) => (
              <div
                key={index}
                className="border-b border-zinc-200 dark:border-zinc-800 pb-6 last:border-0 last:pb-0"
              >
                <dt className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  {item.question}
                </dt>
                <dd className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Related Tools Section */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Related Tools
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <RelatedToolLink
            href="/1-100"
            title="Random Number 1-100"
            description="Generate a random number between 1 and 100"
          />
          <RelatedToolLink
            href="/password-strong"
            title="Strong Password Generator"
            description="Create secure random passwords"
          />
          <RelatedToolLink
            href="/pin-4"
            title="4-Digit PIN Generator"
            description="Generate secure 4-digit PIN codes"
          />
          <RelatedToolLink
            href="/dice-roller"
            title="Dice Roller"
            description="Roll virtual dice for games"
          />
        </div>
      </section>

      {/* Security Notice */}
      <section className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-6">
        <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-2">
          Secure & Private
        </h3>
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          All generation happens locally in your browser using Web Crypto API
          (CSPRNG). Your data never leaves your device. No tracking, no storage,
          complete privacy.
        </p>
      </section>
    </article>
  );
}

function RelatedToolLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/30 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:underline">
            {title}
          </div>
          <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {description}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 flex-shrink-0 mt-0.5" />
      </div>
    </Link>
  );
}
