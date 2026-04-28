import Link from "next/link";

import type { ContentEntry } from "@/lib/mdx/content";
import { getHrefWithLocale, type Dictionary, type Locale } from "@/lib/i18n";

type EntryCardProps = {
  entry: ContentEntry;
  locale: Locale;
  dictionary: Dictionary;
};

export function EntryCard({ entry, locale, dictionary }: EntryCardProps) {
  return (
    <Link href={getHrefWithLocale(locale, `/${entry.section}/${entry.slug}`)} className="entry-card">
      <div className="entry-meta">
        <span>{dictionary.articleSectionLabels[entry.section]}</span>{" "}
        <span>{dictionary.articleMetaSeparator}</span> <span>{entry.date}</span>
      </div>
      <h3>{entry.title}</h3>
      <p>{entry.summary}</p>
    </Link>
  );
}
