import { PageHeader } from "@/components/layout/page-header";
import { EntryCard } from "@/components/ui/entry-card";
import { getPublishedEntriesForSection } from "@/lib/mdx/content";

export default function IdeasPage() {
  const entries = getPublishedEntriesForSection("ideas");

  return (
    <main>
      <PageHeader
        eyebrow="Ideas"
        title="Raw thinking, critiques, and positions still being tested."
        description="Useful ideas do not need to wait until they are fully productized or socially polished."
      />

      <section className="entry-list">
        {entries.map((entry) => (
          <EntryCard key={entry.slug} entry={entry} />
        ))}
      </section>
    </main>
  );
}
