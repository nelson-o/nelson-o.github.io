import { PageHeader } from "@/components/layout/page-header";
import { EntryCard } from "@/components/ui/entry-card";
import { getPublishedEntriesForSection } from "@/lib/mdx/content";

export default function SystemsPage() {
  const entries = getPublishedEntriesForSection("systems");

  return (
    <main>
      <PageHeader
        eyebrow="Systems"
        title="Architecture notes and platform-level engineering decisions."
        description="How interfaces, tooling, and operating constraints shape product teams over time."
      />

      <section className="entry-list">
        {entries.map((entry) => (
          <EntryCard key={entry.slug} entry={entry} />
        ))}
      </section>
    </main>
  );
}
