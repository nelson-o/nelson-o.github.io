import React from "react";

import styles from "@/components/layout/article-page.module.css";
import type { ContentEntry } from "@/lib/mdx/content";
import type { Dictionary } from "@/lib/i18n";
import { renderMdx } from "@/lib/mdx/render";
import { GiscusComments } from "@/components/ui/giscus-comments";

type ArticlePageProps = {
  entry: ContentEntry;
  dictionary: Dictionary;
};

export async function ArticlePage({ entry, dictionary }: ArticlePageProps) {
  const Content = await renderMdx(entry.content);

  return (
    <article className={styles.root} data-section={entry.section}>
      <header className={styles.meta}>
        <div className={styles.eyebrow}>{dictionary.articleSectionLabels[entry.section]}</div>
        <h1 className={styles.title}>{entry.title}</h1>
        <p className={styles.summary}>{entry.summary}</p>
        <div className={styles.entryMeta}>{entry.date}</div>
      </header>

      <div className={styles.prose}>
        <Content />
      </div>

      <div className={styles.comments}>
        <GiscusComments />
      </div>
    </article>
  );
}
