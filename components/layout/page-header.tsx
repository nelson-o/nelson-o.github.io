import React from "react";

import styles from "@/components/layout/page-header.module.css";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  headingLevel?: 1 | 2;
};

export function PageHeader({ eyebrow, title, description, headingLevel = 1 }: PageHeaderProps) {
  const Heading = headingLevel === 2 ? "h2" : "h1";

  return (
    <header className={styles.root}>
      <div className={styles.eyebrow}>{eyebrow}</div>
      <Heading className={styles.title}>{title}</Heading>
      <p className={styles.description}>{description}</p>
    </header>
  );
}
