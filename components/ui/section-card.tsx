import React from "react";

import Link from "next/link";

import styles from "@/components/ui/section-card.module.css";

type SectionCardProps = {
  href: string;
  name: string;
  description: string;
  kicker: string;
};

export function SectionCard({ href, name, description, kicker }: SectionCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.kicker}>{kicker}</div>
      <h2 className={styles.title}>{name}</h2>
      <p className={styles.description}>{description}</p>
    </Link>
  );
}
