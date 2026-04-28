import type { ContentEntry } from "@/lib/mdx/content";
import type { Dictionary } from "@/lib/i18n";
import { renderMdx } from "@/lib/mdx/render";

type ArticlePageProps = {
  entry: ContentEntry;
  dictionary: Dictionary;
};

export async function ArticlePage({ entry, dictionary }: ArticlePageProps) {
  const Content = await renderMdx(entry.content);

  return (
    <article className="article-shell">
      <header className="article-meta">
        <div className="eyebrow">{dictionary.articleSectionLabels[entry.section]}</div>
        <h1 className="article-title">{entry.title}</h1>
        <p className="article-summary">{entry.summary}</p>
        <div className="entry-meta">{entry.date}</div>
      </header>

      <div className="prose">
        <Content />
      </div>
    </article>
  );
}
