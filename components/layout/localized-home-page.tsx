import React from "react";
import Link from "next/link";

import styles from "@/components/layout/localized-home-page.module.css";
import { EntryRow } from "@/components/ui/entry-row";
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
    <div>
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
            headingLevel={2}
            eyebrow={dictionary.latestWritingEyebrow}
            title={dictionary.home.latestWritingTitle}
            description={dictionary.home.latestWritingDescription}
          />
        </div>

        <div className={styles.entryList}>
          {latestEntries.slice(0, 10).map((entry, index) => (
            <EntryRow
              key={`${entry.section}-${entry.slug}`}
              entry={entry}
              locale={locale}
              priority={index === 0}
            />
          ))}
        </div>
        <div className={styles.contentBlockLink}>
          <Link href={`/${locale}/posts/`}>{dictionary.archives.morePosts}</Link>
        </div>
      </section>
    </div>
  );
}
