import type { Metadata } from "next";
import "@/styles/globals.css";
import { Header, MobileBottomNav, Footer } from "@/components/layout";

export const metadata: Metadata = {
  metadataBase: new URL("https://numbergenerator.ai"),
  title: {
    default:
      "NumberGenerator.ai - Free Random Number Generators, Passwords & PINs",
    template: "%s | NumberGenerator.ai",
  },
  description:
    "Free online random generators: numbers 1-10, 1-100, 1-1000, strong passwords, PIN codes, dice roller, coin flip, lottery pickers, and more. Secure, fast, no ads.",
  keywords: [
    "random number generator",
    "password generator",
    "PIN generator",
    "dice roller",
    "coin flip",
    "lottery number generator",
    "random picker",
    "spin wheel",
    "CSPRNG",
    "secure random",
  ],
  authors: [{ name: "NumberGenerator.ai" }],
  creator: "NumberGenerator.ai",
  publisher: "NumberGenerator.ai",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://numbergenerator.ai",
    title: "NumberGenerator.ai - Free Random Number Generators",
    description:
      "Fast, secure random generators: numbers, passwords, PINs, dice, coins, and lottery picks. No tracking, no ads.",
    siteName: "NumberGenerator.ai",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NumberGenerator.ai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NumberGenerator.ai - Free Random Generators",
    description:
      "Fast, secure random generators: numbers, passwords, PINs, dice, coins, and lottery picks.",
    images: ["/og-image.png"],
    creator: "@NumberGeneratorAI",
  },
  alternates: {
    canonical: "https://numbergenerator.ai/",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NumberGenerator",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="antialiased min-h-full font-sans flex flex-col">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <Header />
        <div id="main-content" className="lg:pb-0 pb-16 flex-1" tabIndex={-1}>
          {children}
        </div>
        <MobileBottomNav />
        <Footer />
      </body>
    </html>
  );
}
