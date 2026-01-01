import type { Metadata } from "next";
import Link from "next/link";
import { FileText, AlertTriangle, Gavel, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/ui";
import { PAGE_BREADCRUMBS } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for NumberGenerator.ai. Free random number generators with no warranties and no data collection.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumbs items={PAGE_BREADCRUMBS["/terms"]} />
        </div>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900">
              <FileText className="w-8 h-8 text-zinc-900 dark:text-zinc-100" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Terms of Service
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

        {/* Notice */}
        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900 p-6 mb-12">
          <div className="flex gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-2">
                Please Read Carefully
              </h2>
              <p className="text-amber-800 dark:text-amber-200">
                By using NumberGenerator.ai, you agree to these terms. If you do
                not agree, please do not use our service.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
        <section className="space-y-8">
          {/* Acceptance */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                <Gavel className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                By accessing or using NumberGenerator.ai (&quot;the
                Service&quot;), you agree to be bound by these Terms of Service
                (&quot;Terms&quot;). These Terms constitute a legally binding
                agreement between you and NumberGenerator.ai. If you do not
                agree to these Terms, please do not use the Service.
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">
                2. Description of Service
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                NumberGenerator.ai provides free online random number generation
                tools including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
                <li>Random number generators within specified ranges</li>
                <li>Password and PIN generators</li>
                <li>Dice rollers and coin flip simulators</li>
                <li>Lottery number pickers</li>
                <li>Combination generators</li>
                <li>Other randomization tools</li>
              </ul>
              <p className="text-zinc-600 dark:text-zinc-400 mt-3">
                All generation occurs locally in your browser using
                cryptographically secure methods. No data is sent to our
                servers.
              </p>
            </div>
          </div>

          {/* No Warranty */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">3. No Warranty</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
                AVAILABLE&quot; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
                <li>MERCHANTABILITY</li>
                <li>FITNESS FOR A PARTICULAR PURPOSE</li>
                <li>NON-INFRINGEMENT</li>
                <li>ACCURACY, RELIABILITY, OR AVAILABILITY</li>
              </ul>
              <p className="text-zinc-600 dark:text-zinc-400 mt-3">
                While we use cryptographically secure random number generation
                (CSPRNG), we make no guarantees about the suitability of
                generated values for security-critical applications, gambling,
                or other high-stakes uses.
              </p>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">
                4. Limitation of Liability
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, NumberGenerator.ai SHALL
                NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
                <li>
                  ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES
                </li>
                <li>LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES</li>
                <li>
                  DAMAGES RESULTING FROM USE OR INABILITY TO USE THE SERVICE
                </li>
                <li>
                  DAMAGES FROM UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR
                  TRANSMISSIONS
                </li>
              </ul>
              <p className="text-zinc-600 dark:text-zinc-400 mt-3">
                In no event shall our total liability exceed the amount you
                paid, if any, to use the Service (currently $0).
              </p>
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">
                5. User Responsibilities
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                You agree to use the Service responsibly and:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
                <li>Not attempt to disrupt or compromise the Service</li>
                <li>Not use automated tools to abuse the Service</li>
                <li>
                  Understand that generated values are not guaranteed for any
                  specific purpose
                </li>
                <li>
                  Verify results independently for high-stakes applications
                </li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">
                6. Intellectual Property
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                All content, features, and functionality of NumberGenerator.ai,
                including but not limited to text, graphics, logos, and
                software, are owned by NumberGenerator.ai and protected by
                international copyright, trademark, and other intellectual
                property laws. Generated numbers themselves are not subject to
                copyright and are free for you to use as you see fit.
              </p>
            </div>
          </div>

          {/* Modifications */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">
                7. Modifications to Terms
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                We reserve the right to modify these Terms at any time. Changes
                will be posted on this page with an updated revision date. Your
                continued use of the Service after such modifications
                constitutes your acceptance of the new Terms.
              </p>
            </div>
          </div>

          {/* Termination */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                <Gavel className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">8. Termination</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                We may terminate or suspend your access to the Service
                immediately, without prior notice, for any breach of these
                Terms. Upon termination, your right to use the Service will
                cease immediately.
              </p>
            </div>
          </div>

          {/* Governing Law */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                <Gavel className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">9. Governing Law</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                These Terms shall be governed by and construed in accordance
                with the laws of the jurisdiction in which NumberGenerator.ai is
                established, without regard to its conflict of law provisions.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-12 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold mb-3">Questions?</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            If you have any questions about these Terms, please contact us at{" "}
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
