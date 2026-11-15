import React from "react";
import Link from "next/link";
import { EntryRow } from "@/components/ui/entry-row";
import { getHrefWithLocale, type Locale } from "@/lib/i18n";
import { getArticleHeaderCopy } from "@/lib/i18n-article-header";
import { getSeriesPathCopy } from "@/lib/i18n-series-path";
import type { ContentEntry } from "@/lib/mdx/content";
import styles from "./series-path.module.css";

export function SeriesPath({ entries, locale }: { entries: ContentEntry[]; locale: Locale }) {
  const first = entries[0];
  if (!first) return null;
  const copy = getSeriesPathCopy(locale);
  const { part } = getArticleHeaderCopy(locale);
  return (
    <section aria-labelledby="series-reading-order" data-series-path="">
      <div className={styles.introduction}>
        <h2 id="series-reading-order">{copy.sequence}</h2>
        <p>{copy.introduction}</p>
        <Link className={styles.start} href={getHrefWithLocale(locale, `/${first.section}/${first.slug}`)}>
          {copy.start}<span aria-hidden="true"> →</span>
        </Link>
      </div>
      <ol className={styles.steps} role="list">
        {entries.map((entry, index) => (
          <li key={`${entry.section}/${entry.slug}`}>
            <p className={styles.part}>{part(index + 1, entries.length)}</p>
            <EntryRow entry={entry} locale={locale} priority={index === 0} />
          </li>
        ))}
      </ol>
    </section>
  );
}
