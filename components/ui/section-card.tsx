import Link from "next/link";

import type { Section } from "@/lib/i18n";

type SectionCardProps = {
  href: string;
  name: string;
  description: string;
  kicker: string;
};

export function SectionCard({ href, name, description, kicker }: SectionCardProps) {
  return (
    <Link href={href} className="section-card">
      <div className="section-kicker">{kicker}</div>
      <h2>{name}</h2>
      <p>{description}</p>
    </Link>
  );
}
