import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { EntryCard } from "@/components/ui/entry-card";
import { SectionCard } from "@/components/ui/section-card";
import {
  getAlternates,
  getDictionary,
  getStaticLocaleParams,
  isLocale,
  sections,
} from "@/lib/i18n";
import { getLatestEntries } from "@/lib/mdx/content";

export function generateStaticParams() {
  return getStaticLocaleParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getDictionary(locale);

  return {
    title: dictionary.site.title,
    description: dictionary.site.description,
    alternates: getAlternates(locale, "/"),
  };
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const latestEntries = getLatestEntries(locale, 4);

  return (
    <main>
      <section className="hero">
        <div className="eyebrow">{dictionary.home.eyebrow}</div>
        <h1>{dictionary.home.title}</h1>
        <p>{dictionary.home.description}</p>
        <div className="hero-focus">
          {dictionary.home.focusAreas.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="section-grid" aria-label={dictionary.primarySectionsLabel}>
        {sections.map((section) => (
          <SectionCard
            key={section}
            href={`/${locale}/${section}`}
            kicker={dictionary.sectionCardKicker}
            name={dictionary.navigation[section]}
            description={dictionary.sectionPages[section].cardDescription}
          />
        ))}
      </section>

      <section className="content-block">
        <div className="content-block-header">
          <PageHeader
            eyebrow={dictionary.latestWritingEyebrow}
            title={dictionary.home.latestWritingTitle}
            description={dictionary.home.latestWritingDescription}
          />
        </div>

        <div className="content-block-link">
          <Link href={`/${locale}/systems`}>{dictionary.startWithSystemsLabel}</Link>
        </div>

        <div className="entry-grid">
          {latestEntries.map((entry) => (
            <EntryCard
              key={`${entry.section}-${entry.slug}`}
              entry={entry}
              locale={locale}
              dictionary={dictionary}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
