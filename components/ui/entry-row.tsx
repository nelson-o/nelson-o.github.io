import React from "react";
import Link from "next/link";
import { OgHeroImage } from "@/components/ui/og-hero-image";
import { getEntryCover } from "@/lib/entry-cover";
import { getHrefWithLocale, type Locale } from "@/lib/i18n";
import type { ContentEntry } from "@/lib/mdx/content";
import { tags } from "@/lib/taxonomy";
import styles from "./entry-row.module.css";

type EntryRowProps = { entry: ContentEntry; locale: Locale; priority?: boolean };

export function EntryRow({ entry, locale, priority = false }: EntryRowProps) {
  const cover = getEntryCover(entry);
  return (
    <Link href={getHrefWithLocale(locale, `/${entry.section}/${entry.slug}`)}
      className={styles.row} aria-label={entry.title} data-entry-row="">
      <span className={styles.thumbnail}>
        <OgHeroImage src={`${cover.light}-1200.webp`} cover={cover} alt=""
          sizes="(min-width: 640px) 160px, 112px" loading={priority ? "eager" : "lazy"} />
      </span>
      <div className={styles.content}>
        <time className={styles.date} dateTime={entry.date}>{entry.date}</time>
        <h3 className={styles.title}>{entry.title}</h3>
        <p className={styles.summary}>{entry.summary}</p>
        {entry.tags?.length ? <div className={styles.tags}>
          {entry.tags.slice(0, 3).map((tag) => <span key={tag}>#{tags[tag][locale]}</span>)}
        </div> : null}
      </div>
    </Link>
  );
}
