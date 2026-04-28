import Link from "next/link";

import type { Section } from "@/lib/mdx/content";

type SectionCardProps = {
  href: `/${Section}`;
  name: string;
  description: string;
};

export function SectionCard({ href, name, description }: SectionCardProps) {
  return (
    <Link href={href} className="section-card">
      <div className="section-kicker">Section</div>
      <h2>{name}</h2>
      <p>{description}</p>
    </Link>
  );
}
