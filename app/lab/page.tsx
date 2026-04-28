import { PageHeader } from "@/components/layout/page-header";
import { EntryCard } from "@/components/ui/entry-card";
import { getPublishedEntriesForSection } from "@/lib/mdx/content";

export default function LabPage() {
  const entries = getPublishedEntriesForSection("lab");

  return (
    <main>
      <PageHeader
        eyebrow="Lab"
        title="Experiments, probes, and small builds that test future system directions."
        description="A proving ground for ideas that should be exercised before they are relied on."
      />

      <section className="entry-list">
        {entries.map((entry) => (
          <EntryCard key={entry.slug} entry={entry} />
        ))}
      </section>
    </main>
  );
}
