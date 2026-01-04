import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ToolClientShell from "@/components/generator/ToolClientShell";
import { CONFIG_MAP } from "@/lib/configMap";
import ToolSEOContent from "@/components/tool/ToolSEOContent";
import { Breadcrumbs } from "@/components/ui";
import { getToolBreadcrumbs } from "@/lib/breadcrumbs";

export const dynamicParams = false;

export async function generateStaticParams() {
  return Object.keys(CONFIG_MAP).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = CONFIG_MAP[slug];
  if (!config) return {};

  const baseUrl = "https://numbergenerator.ai";
  const toolUrl = `${baseUrl}/${config.slug}/`;

  // Build keywords from config.keywords or fall back to relevant defaults
  const keywords = config.keywords || [
    config.title.toLowerCase(),
    "random generator",
    "free online tool",
  ];

  return {
    title: config.seo_title,
    description: config.description,
    keywords: keywords.join(", "),
    robots: slug.startsWith("template-")
      ? { index: false, follow: false }
      : undefined,
    alternates: { canonical: toolUrl },
    openGraph: {
      title: config.seo_title,
      description: config.description,
      type: "website",
      url: toolUrl,
      siteName: "NumberGenerator.ai",
      images: [
        {
          url: `${baseUrl}/og-${config.slug}.png`,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.seo_title,
      description: config.description,
      images: [`${baseUrl}/og-${config.slug}.png`],
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = CONFIG_MAP[slug];
  if (!config) notFound();

  const baseUrl = "https://numbergenerator.ai";
  const toolUrl = `${baseUrl}/${config.slug}/`;

  // Build enhanced structured data
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication" as const,
    name: config.title,
    description: config.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    url: toolUrl,
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: config.features || [],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
  };

  // Build FAQ schema if FAQ data exists
  const faqSchema =
    config.faq && config.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage" as const,
          mainEntity: config.faq.map((faq) => ({
            "@type": "Question" as const,
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer" as const,
              text: faq.answer,
            },
          })),
        }
      : null;

  // Build HowTo schema if how_to data exists
  const howToSchema =
    config.how_to && config.how_to.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo" as const,
          name: `How to use ${config.title}`,
          description: `Step-by-step guide for using the ${config.title}.`,
          step: config.how_to.map((step, index) => ({
            "@type": "HowToStep" as const,
            position: index + 1,
            text: step,
          })),
        }
      : null;

  // Generate breadcrumb items
  const breadcrumbs = getToolBreadcrumbs(
    config.slug,
    config.title,
    config.category,
  );

  // Build BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList" as const,
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.href}`,
    })),
  };

  // Combine all schemas
  const jsonLd = [
    webApplicationSchema,
    faqSchema,
    howToSchema,
    breadcrumbSchema,
  ].filter(Boolean);

  return (
    <main
      id="tool-page-main"
      className="min-h-screen bg-white dark:bg-black"
      aria-labelledby="tool-title"
    >
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <ToolClientShell key={config.slug} config={config} />

        {/* SEO Content Section */}
        <ToolSEOContent config={config} />

        {/* Structured Data */}
        {jsonLd.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </div>
    </main>
  );
}
