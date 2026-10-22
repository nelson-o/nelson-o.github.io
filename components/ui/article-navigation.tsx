import React from "react";
import Link from "next/link";
import { EntryRow } from "@/components/ui/entry-row";
import { getHrefWithLocale } from "@/lib/i18n";
import { getArticleNavigationCopy } from "@/lib/i18n-article-navigation";
import type { ContentEntry } from "@/lib/mdx/content";
import { getAdjacentEntries, getRelatedEntries } from "@/lib/mdx/content-taxonomy";
import styles from "./article-navigation.module.css";

export function ArticleNavigation({ entry }: { entry: ContentEntry }) {
  const neighbors = getAdjacentEntries(entry);
  const related = getRelatedEntries(entry, 3);
  if (!neighbors.previous && !neighbors.next && !related.length) return null;
  const copy = getArticleNavigationCopy(entry.locale);

  return <div className={styles.root} data-article-navigation="">
    {(neighbors.previous || neighbors.next) && <nav aria-labelledby="post-continuation-title" data-article-pager="">
      <h2 id="post-continuation-title" className={styles.heading}>{entry.series ? copy.series : copy.section}</h2>
      <div className={styles.pager}>
        {(["previous", "next"] as const).map((direction) => {
          const neighbor = neighbors[direction];
          return neighbor && <Link key={direction} rel={direction === "previous" ? "prev" : "next"}
            href={getHrefWithLocale(entry.locale, `/${neighbor.section}/${neighbor.slug}`)} className={direction === "next" ? styles.next : undefined}>
            <span className={styles.direction}>{copy[direction]}</span>
            <span className={styles.title}>{neighbor.title}</span>
          </Link>;
        })}
      </div>
    </nav>}
    {related.length > 0 && <section aria-labelledby="post-related-title" data-article-related="">
      <h2 id="post-related-title" className={styles.heading}>{copy.related}</h2>
      {related.map((item) => <EntryRow key={`${item.section}/${item.slug}`} entry={item} locale={entry.locale} />)}
    </section>}
  </div>;
}
