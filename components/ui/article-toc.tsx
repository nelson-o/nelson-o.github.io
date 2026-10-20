import React from "react";
import type { ArticleHeading } from "@/lib/mdx/headings";
import { getArticleTocCopy } from "@/lib/i18n-article-toc";
import type { Locale } from "@/lib/i18n";
import styles from "./article-toc.module.css";

export function ArticleToc({ headings, locale }: { headings: ArticleHeading[]; locale: Locale }) {
  if (headings.length < 3) return null;
  const { title } = getArticleTocCopy(locale);
  const links = <ol className={styles.links}>
    {headings.map(({ id, text, depth }) => (
      <li key={id} className={depth === 3 ? styles.nested : undefined}>
        <a href={`#${id}`}>{text}</a>
      </li>
    ))}
  </ol>;
  return (
    <aside className={styles.root} data-article-toc="">
      <nav className={styles.desktop} aria-label={title}>
        <h2 className={styles.title}>{title}</h2>
        {links}
      </nav>
      <details className={styles.mobile}>
        <summary className={styles.title}>{title}</summary>
        <nav aria-label={title}>{links}</nav>
      </details>
    </aside>
  );
}
