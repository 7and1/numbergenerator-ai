import Link from "next/link";
import { memo } from "react";
import { Github, Twitter, Mail, Heart } from "lucide-react";

const currentYear = new Date().getFullYear();

const footerSections = [
  {
    title: "Tools",
    links: [
      { href: "/#all-tools", label: "All Tools" },
      { href: "/1-100", label: "Random 1-100" },
      { href: "/password-strong", label: "Password Generator" },
      { href: "/combo", label: "Combo Generator" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/guides", label: "Guides" },
      { href: "/faq", label: "FAQ" },
      { href: "/about", label: "About Us" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/cookies", label: "Cookie Policy" },
    ],
  },
  {
    title: "Contact",
    links: [
      {
        href: "mailto:hello@numbergenerator.ai",
        label: "hello@numbergenerator.ai",
        external: true,
      },
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
          className="text-zinc-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-inset rounded"
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
        className="text-zinc-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-inset rounded"
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
    <footer className="w-full bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 border-t border-zinc-200/60 dark:border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Main Footer Sections */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12 mb-16">
          {footerSections.map((section) => (
            <FooterSection key={section.title} {...section} />
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright & Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <span>© {currentYear}</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                NumberGenerator.ai
              </span>
            </div>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">
              •
            </span>
            <div className="flex items-center gap-1.5">
              <span>Made with</span>
              <Heart
                className="w-4 h-4 text-rose-500 fill-rose-500"
                aria-hidden="true"
              />
              <span>& CSPRNG</span>
            </div>
          </div>

          {/* Social & Legal */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Social Links */}
            <nav className="flex items-center gap-2" aria-label="Social media">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 p-2.5 -m-2.5 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/20"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </a>
                );
              })}
            </nav>

            <div className="hidden sm:block w-px h-5 bg-zinc-200/60 dark:bg-zinc-800/60" />

            <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              <Link
                href="/sitemap.xml"
                className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

export { Footer };
