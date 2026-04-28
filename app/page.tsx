import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { EntryCard } from "@/components/ui/entry-card";
import { SectionCard } from "@/components/ui/section-card";
import { getLatestEntries } from "@/lib/mdx/content";

const sectionDefinitions = [
  {
    href: "/systems" as const,
    name: "Systems",
    description: "Architecture decisions, SDK surfaces, and the infrastructure choices that constrain product velocity.",
  },
  {
    href: "/work" as const,
    name: "Work",
    description: "Case-based engineering stories focused on judgment, tradeoffs, and the mechanics behind shipped outcomes.",
  },
  {
    href: "/ideas" as const,
    name: "Ideas",
    description: "Working notes, critiques, and unfinished thinking that is still useful before it becomes doctrine.",
  },
  {
    href: "/lab" as const,
    name: "Lab",
    description: "Experiments, prototypes, and technical probes that sharpen future systems work.",
  },
];

export default function HomePage() {
  const latestEntries = getLatestEntries(4);

  return (
    <main>
      <section className="hero">
        <div className="eyebrow">Engineering Knowledge Surface</div>
        <h1>Frontend systems built as platforms, not page collections.</h1>
        <p>
          I use this site to accumulate system design decisions, delivery patterns, and the working ideas
          behind WebSDKs, CI, and agent-driven engineering loops.
        </p>
        <div className="hero-focus">
          <span>WebSDK</span>
          <span>CI Systems</span>
          <span>Agent Workflows</span>
        </div>
      </section>

      <section className="section-grid" aria-label="Primary sections">
        {sectionDefinitions.map((section) => (
          <SectionCard key={section.href} {...section} />
        ))}
      </section>

      <section className="content-block">
        <div className="content-block-header">
          <PageHeader
            eyebrow="Latest Writing"
            title="Recent entries across systems, work, ideas, and lab."
            description="The first version stays small on purpose: enough surface area to prove the content model and the deployment path."
          />
          <Link href="/systems">Start with systems</Link>
        </div>

        <div className="entry-grid">
          {latestEntries.map((entry) => (
            <EntryCard key={`${entry.section}-${entry.slug}`} entry={entry} />
          ))}
        </div>
      </section>
    </main>
  );
}
