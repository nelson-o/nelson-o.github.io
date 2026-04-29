import React from "react";
import Link from "next/link";

import styles from "@/components/layout/localized-home-page.module.css";
import { EntryCard } from "@/components/ui/entry-card";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { sections, type Dictionary, type Locale } from "@/lib/i18n";
import type { ContentEntry } from "@/lib/mdx/content";

type LocalizedHomePageProps = {
  locale: Locale;
  dictionary: Dictionary;
  latestEntries: ContentEntry[];
};

export function LocalizedHomePage({ locale, dictionary, latestEntries }: LocalizedHomePageProps) {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.eyebrow}>{dictionary.home.eyebrow}</div>
        <h1 className={styles.title}>{dictionary.home.title}</h1>
        <p className={styles.description}>{dictionary.home.description}</p>
        <div className={styles.focus}>
          {dictionary.home.focusAreas.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className={styles.sectionGrid} aria-label={dictionary.primarySectionsLabel}>
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

      <section className={styles.contentBlock}>
        <div className={styles.contentBlockHeader}>
          <PageHeader
            eyebrow={dictionary.latestWritingEyebrow}
            title={dictionary.home.latestWritingTitle}
            description={dictionary.home.latestWritingDescription}
          />
        </div>

        <div className={styles.contentBlockLink}>
          <Link href={`/${locale}/systems`}>{dictionary.startWithSystemsLabel}</Link>
        </div>

        <div className={styles.entryGrid}>
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
