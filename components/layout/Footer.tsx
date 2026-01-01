import Link from "next/link";
import { memo } from "react";
import { Github, Twitter, Mail, Heart } from "lucide-react";

const currentYear = new Date().getFullYear();

const footerSections = [
  {
    title: "Product",
    links: [
      { href: "/#all-tools", label: "All Tools" },
      { href: "/combo", label: "Combo Generator" },
      { href: "#", label: "API", disabled: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Blog", disabled: true },
      { href: "/guides", label: "Guides" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      {
        href: "mailto:hello@numbergenerator.ai",
        label: "Contact",
        external: true,
      },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/cookies", label: "Cookie Policy" },
    ],
  },
];

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/numbergenerator-ai",
    icon: Github,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/NumberGeneratorAI",
    icon: Twitter,
  },
  {
    name: "Email",
    href: "mailto:hello@numbergenerator.ai",
    icon: Mail,
  },
];

interface FooterLinkProps {
  href: string;
  label: string;
  disabled?: boolean;
  external?: boolean;
}

function FooterLink({ href, label, disabled, external }: FooterLinkProps) {
  if (disabled) {
    return (
      <li>
        <span
          className="text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
          aria-disabled="true"
        >
          {label}
          <span className="ml-1 text-xs">(Coming Soon)</span>
        </span>
      </li>
    );
  }

  if (external) {
    return (
      <li>
        <a
          href={href}
          className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/50 focus-visible:ring-inset rounded"
          target="_blank"
          rel="noopener noreferrer"
        >
          {label}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/50 focus-visible:ring-inset rounded"
      >
        {label}
      </Link>
    </li>
  );
}

interface FooterSectionProps {
  title: string;
  links: Array<{
    href: string;
    label: string;
    disabled?: boolean;
    external?: boolean;
  }>;
}

function FooterSection({ title, links }: FooterSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
        {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <FooterLink key={link.href} {...link} />
        ))}
      </ul>
    </div>
  );
}

const Footer = memo(function Footer() {
  return (
    <footer className="w-full bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Footer Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section) => (
            <FooterSection key={section.title} {...section} />
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span>Copyright</span>
              <span className="text-zinc-400 dark:text-zinc-600">
                {currentYear}
              </span>
              <span className="font-semibold">NumberGenerator.ai</span>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
            </div>

            {/* Social Links */}
            <nav
              className="flex items-center gap-4"
              aria-label="Social media links"
            >
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/50 focus-visible:ring-inset rounded p-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${social.name}`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </a>
                );
              })}
            </nav>

            {/* Built With */}
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span>Built with</span>
              <Heart
                className="w-4 h-4 text-red-500 fill-red-500"
                aria-hidden="true"
              />
              <span>using Web Crypto CSPRNG</span>
            </div>
          </div>

          {/* Additional Legal Links */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>No tracking. No ads. No data collection.</span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <Link
              href="/sitemap.xml"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/50 focus-visible:ring-inset rounded"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
});

export { Footer };
