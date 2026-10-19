import React from "react";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { EntryRow } from "@/components/ui/entry-row";
import { getLandingTabsCopy } from "@/lib/i18n-landing-tabs";
import styles from "@/app/[locale]/(site)/[section]/page.module.css";
import {
  getAlternates,
  getDictionary,
  getHrefWithLocale,
  getTopicSocialPreviewImageUrl,
  isLocale,
  isSection,
  locales,
  sections,
} from "@/lib/i18n";
import { getAllEntriesForSection, getPublishedEntriesForSection } from "@/lib/mdx/content";

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
  const years = [...new Set(entries.map((entry) => entry.date.slice(0, 4)))];

  return (
    <div data-section={section}>
      <PageHeader title={getLandingTabsCopy(locale)[section]} description={page.description} />
      <div className={styles.entryList}>
        {years.map((year) => (
          <section key={year} aria-labelledby={`year-${year}`}>
            <h2 id={`year-${year}`} className={styles.year}>{year}</h2>
            {entries.filter((entry) => entry.date.startsWith(year)).map((entry) => (
              <EntryRow key={entry.slug} entry={entry} locale={locale}
                showTags={false} isDraft={!entry.published} priority={entry === entries[0]} />
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
