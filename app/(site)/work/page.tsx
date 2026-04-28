import { PageHeader } from "@/components/layout/page-header";
import { EntryCard } from "@/components/ui/entry-card";
import { getPublishedEntriesForSection } from "@/lib/mdx/content";

export default function WorkPage() {
  const entries = getPublishedEntriesForSection("work");

  return (
    <main>
      <PageHeader
        eyebrow="Work"
        title="Case studies framed around engineering judgment, not résumé bullets."
        description="The emphasis is on constraints, decision quality, and what changed because the system changed."
      />

      <section className="entry-list">
        {entries.map((entry) => (
          <EntryCard key={entry.slug} entry={entry} />
        ))}
      </section>
    </main>
  );
}
