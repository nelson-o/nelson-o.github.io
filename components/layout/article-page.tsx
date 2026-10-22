import { getEntryCover } from "@/lib/entry-cover";
import React from "react";

import styles from "@/components/layout/article-page.module.css";
import proseStyles from "@/components/layout/article-prose.module.css";
import type { ContentEntry } from "@/lib/mdx/content";
import { type Dictionary, type Locale } from "@/lib/i18n";
import { renderMdxWithHeadings } from "@/lib/mdx/render";
import { GiscusComments } from "@/components/ui/giscus-comments";
import { OgHeroImage } from "@/components/ui/og-hero-image";
import { ArticleToc } from "@/components/ui/article-toc";
import { getArticleTocCopy } from "@/lib/i18n-article-toc";
import { ArticleLanguageSuggestion } from "@/components/ui/article-language-suggestion";
import { ArticleNavigation } from "@/components/ui/article-navigation";

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
  const { Content, headings } = await renderMdxWithHeadings(entry.content, getArticleTocCopy(entry.locale).linkToHeading);
  const cover = getEntryCover(entry);
  const llmContext = entry.section === "digests" ? entry.llm : undefined;

  const needsFontAwesome = entry.content.includes("fa:fa-");

  return (
    <>
      {needsFontAwesome && (
        // eslint-disable-next-line @next/next/no-css-tags -- Local icon font is needed only for these diagrams.
        <link
          rel="stylesheet"
          href="/vendor/fontawesome/css/all.min.css"
        />
      )}
      <article className={styles.root} data-section={entry.section}>
      {!entry.published && (
        <div className={styles.draftBanner}>Draft — not published to production</div>
      )}
      <OgHeroImage
        className={styles.heroImage}
        src={`${cover.light}-1200.webp`}
        cover={cover}
        alt=""
      />
      <header className={styles.meta}>
        <div className={styles.eyebrow}>{dictionary.articleSectionLabels[entry.section]}</div>
        <h1 className={styles.title} tabIndex={-1}>{entry.title}</h1>
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

      <div className={headings.length >= 3 ? styles.bodyWithToc : undefined} data-article-body="">
        <ArticleToc headings={headings} locale={entry.locale} />
        <div className={proseStyles.prose} data-article-prose="">
          <Content />
        </div>
      </div>

      <ArticleNavigation entry={entry} />

      <div className={styles.comments}>
        <GiscusComments locale={entry.locale} />
      </div>
      </article>
    </>
  );
}
