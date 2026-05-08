import React from "react";

import styles from "@/components/layout/article-page.module.css";
import type { ContentEntry } from "@/lib/mdx/content";
import { getTopicSocialPreviewImageUrl, type Dictionary } from "@/lib/i18n";
import { renderMdx } from "@/lib/mdx/render";
import { GiscusComments } from "@/components/ui/giscus-comments";
import { OgHeroImage } from "@/components/ui/og-hero-image";

type ArticlePageProps = {
  entry: ContentEntry;
  dictionary: Dictionary;
};

export async function ArticlePage({ entry, dictionary }: ArticlePageProps) {
  const Content = await renderMdx(entry.content);
  const previewImage = getTopicSocialPreviewImageUrl(entry.section, entry.slug);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />
      <article className={styles.root} data-section={entry.section}>
      {!entry.published && (
        <div className={styles.draftBanner}>Draft — not published to production</div>
      )}
      <OgHeroImage
        className={styles.heroImage}
        src={previewImage}
        alt=""
      />
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
    </>
  );
}
