import React from "react";

import Link from "next/link";

import styles from "@/components/ui/entry-card.module.css";
import type { ContentEntry } from "@/lib/mdx/content";
import { getHrefWithLocale, type Dictionary, type Locale } from "@/lib/i18n";

type EntryCardProps = {
  entry: ContentEntry;
  locale: Locale;
  dictionary: Dictionary;
  isDraft?: boolean;
};

export function EntryCard({ entry, locale, dictionary, isDraft }: EntryCardProps) {
  return (
    <Link
      href={getHrefWithLocale(locale, `/${entry.section}/${entry.slug}`)}
      className={styles.card}
      data-section={entry.section}
    >
      <div className={styles.meta}>
        <span>{dictionary.articleSectionLabels[entry.section]}</span>{" "}
        <span>{dictionary.articleMetaSeparator}</span> <span>{entry.date}</span>
        {isDraft && <span className={styles.draftBadge}>Draft</span>}
      </div>
      <h3 className={styles.title}>{entry.title}</h3>
      <p className={styles.summary}>{entry.summary}</p>
    </Link>
  );
}
