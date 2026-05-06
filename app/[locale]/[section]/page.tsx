import React from "react";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { EntryCard } from "@/components/ui/entry-card";
import { TopicVisual } from "@/components/ui/topic-visual";
import styles from "@/app/[locale]/[section]/page.module.css";
import {
  getAlternates,
  getDictionary,
  getHrefWithLocale,
  getTopicSocialPreviewImageUrl,
  isLocale,
  isSection,
  type Section,
  locales,
  sections,
} from "@/lib/i18n";
import { getAllEntriesForSection, getPublishedEntriesForSection } from "@/lib/mdx/content";

const sectionVisualImages: Partial<Record<Section, readonly string[]>> = {
  systems: ["/og/systems1.png", "/og/systems2.png", "/og/systems3.png", "/og/systems4.png"],
  ideas: ["/og/ideas1.png", "/og/ideas2.png", "/og/ideas3.png"],
  lab: ["/og/lab1.png", "/og/lab2.png", "/og/lab3.png"],
  work: ["/og/work1.png", "/og/work2.png", "/og/work3.png"],
};

export function generateStaticParams() {
  return locales.flatMap((locale) => sections.map((section) => ({ locale, section })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; section: string }>;
}): Promise<Metadata> {
  const { locale, section } = await params;

  if (!isLocale(locale) || !isSection(section)) {
    return {};
  }

  const dictionary = getDictionary(locale);
  const page = dictionary.sectionPages[section];

  return {
    title: `${page.eyebrow} | ${dictionary.site.title}`,
    description: page.description,
    alternates: getAlternates(locale, `/${section}`),
    openGraph: {
      type: "website",
      title: `${page.eyebrow} | ${dictionary.site.title}`,
      description: page.description,
      siteName: dictionary.site.title,
      url: getHrefWithLocale(locale, `/${section}`),
      images: [
        {
          url: getTopicSocialPreviewImageUrl(section),
          alt: `${page.eyebrow} | ${dictionary.site.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.eyebrow} | ${dictionary.site.title}`,
      description: page.description,
      images: [
        {
          url: getTopicSocialPreviewImageUrl(section),
          alt: `${page.eyebrow} | ${dictionary.site.title}`,
        },
      ],
    },
  };
}

export default async function LocalizedSectionPage({
  params,
}: {
  params: Promise<{ locale: string; section: string }>;
}) {
  const { locale, section } = await params;

  if (!isLocale(locale) || !isSection(section)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const page = dictionary.sectionPages[section];
  const isDevMode = process.env.NODE_ENV === "development";
  const entries = isDevMode
    ? getAllEntriesForSection(locale, section)
    : getPublishedEntriesForSection(locale, section);
  const visualImages = sectionVisualImages[section];

  return (
    <main data-section={section}>
      <PageHeader eyebrow={page.eyebrow} title={page.title} description={page.description} />
      {visualImages && <TopicVisual images={visualImages} />}

      <section className={styles.entryList}>
        {entries.map((entry) => (
          <EntryCard
            key={entry.slug}
            entry={entry}
            locale={locale}
            dictionary={dictionary}
            isDraft={!entry.published}
          />
        ))}
      </section>
    </main>
  );
}
