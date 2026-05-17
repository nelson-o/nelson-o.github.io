import React from "react";

import styles from "@/components/layout/article-page.module.css";
import type { ContentEntry } from "@/lib/mdx/content";
import { getTopicSocialPreviewImageUrl, type Dictionary, type Locale } from "@/lib/i18n";
import { renderMdx } from "@/lib/mdx/render";
import { GiscusComments } from "@/components/ui/giscus-comments";
import { OgHeroImage } from "@/components/ui/og-hero-image";
import { ArticleLanguageSuggestion } from "@/components/ui/article-language-suggestion";

type ArticlePageProps = {
  entry: ContentEntry;
  dictionary: Dictionary;
  availableLocales?: readonly Locale[];
};

export async function ArticlePage({
  entry,
  dictionary,
  availableLocales = [entry.locale],
}: ArticlePageProps) {
  const Content = await renderMdx(entry.content);
  const previewImage = getTopicSocialPreviewImageUrl(entry.section, entry.slug);
  const llmContext = entry.section === "digests" ? entry.llm : undefined;

  const needsFontAwesome = entry.content.includes("fa:fa-");

  return (
    <>
      {needsFontAwesome && (
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        />
      )}
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

      <ArticleLanguageSuggestion
        currentLocale={entry.locale}
        availableLocales={availableLocales}
        section={entry.section}
        slug={entry.slug}
      />

      {llmContext && (
        <aside className={styles.llmContext} aria-label={dictionary.llmContextLabel}>
          <div className={styles.llmContextTitle}>{dictionary.llmContextLabel}</div>
          <dl className={styles.llmContextGrid}>
            <div>
              <dt>{dictionary.llmContextModelLabel}</dt>
              <dd>{llmContext.model}</dd>
            </div>
            {llmContext.date && (
              <div>
                <dt>{dictionary.llmContextDateLabel}</dt>
                <dd>{llmContext.date}</dd>
              </div>
            )}
            {llmContext.interaction && (
              <div>
                <dt>{dictionary.llmContextInteractionLabel}</dt>
                <dd>{llmContext.interaction}</dd>
              </div>
            )}
          </dl>
          <p>{llmContext.context}</p>
        </aside>
      )}

      <div className={styles.prose}>
        <Content />
      </div>

      <div className={styles.comments}>
        <GiscusComments locale={entry.locale} />
      </div>
      </article>
    </>
  );
}
