import Link from "next/link";

import type { ContentEntry } from "@/lib/mdx/content";

type EntryCardProps = {
  entry: ContentEntry;
};

export function EntryCard({ entry }: EntryCardProps) {
  return (
    <Link href={`/${entry.section}/${entry.slug}`} className="entry-card">
      <div className="entry-meta">
        <span>{entry.section}</span> <span>•</span> <span>{entry.date}</span>
      </div>
      <h3>{entry.title}</h3>
      <p>{entry.summary}</p>
    </Link>
  );
}
