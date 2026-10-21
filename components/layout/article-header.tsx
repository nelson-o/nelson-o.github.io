import React from "react";
import Link from "next/link";
import type { ContentEntry } from "@/lib/mdx/content";
import { getLandingTabsCopy } from "@/lib/i18n-landing-tabs";
import { getEntryCover } from "@/lib/entry-cover";
import { estimateReadingMinutes, getArticleSeries } from "@/lib/article-header";
import { getArticleHeaderCopy } from "@/lib/i18n-article-header";
import { tags } from "@/lib/taxonomy";
import { OgHeroImage } from "@/components/ui/og-hero-image";
import styles from "./article-header.module.css";

export function ArticleHeader({ entry }: { entry: ContentEntry }) {
  const cover = getEntryCover(entry);
  const copy = getArticleHeaderCopy(entry.locale);
  const series = getArticleSeries(entry);
  return (
    <header className={styles.root} data-article-header="">
      <div className={styles.metadata}>
        <Link className={styles.chip} href={`/${entry.locale}/${entry.section}/`}>
          {getLandingTabsCopy(entry.locale)[entry.section]}
        </Link>
        <time dateTime={entry.date}>{entry.date}</time>
        <span>{copy.reading(estimateReadingMinutes(entry.content))}</span>
      </div>
      <h1 className={styles.title} tabIndex={-1}>{entry.title}</h1>
      <p className={styles.summary}>{entry.summary}</p>
      {!!entry.tags?.length && (
        <nav aria-label={copy.tags} className={styles.tags}>
          {entry.tags.map((tag) => <Link key={tag} className={styles.chip} href={`/${entry.locale}/topics/${tag}/`}>#{tags[tag][entry.locale]}</Link>)}
        </nav>
      )}
      {series && <p className={styles.series} data-article-series="">
        <Link href={`/${entry.locale}/series/${series.id}/`}>{series.label}</Link>
        <span>{copy.part(series.part, series.total)}</span>
      </p>}
      <OgHeroImage className={styles.cover} src={`${cover.light}-1200.webp`} cover={cover} alt="" />
    </header>
  );
}
