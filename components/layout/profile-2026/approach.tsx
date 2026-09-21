import React from "react";
import type { Profile2026Copy } from "@/lib/profile-2026-copy";
import styles from "./approach.module.css";

export function Profile2026Approach({ copy }: { copy: Profile2026Copy }) {
  return <aside className={styles.approach} aria-label={copy.approach}>
    <div className={styles.scene}>
      <figure className={styles.window}>
        <span className={styles.quoteMark} aria-hidden="true">“</span>
        <blockquote>{copy.approachQuote.map((line) => <span key={line}>{line}</span>)}</blockquote>
        <figcaption><span aria-hidden="true">— </span>NELSON</figcaption>
      </figure>
      <ol className={styles.motto}>
        {copy.approachMotto.map((word) => <li key={word}>{word}</li>)}
      </ol>
    </div>
    <dl className={styles.stats}>
      {copy.approachStats.map((label, index) => <div key={label}>
        <dt>{label}</dt><dd>{["15+", "10+", "4", "∞"][index]}</dd>
      </div>)}
    </dl>
  </aside>;
}
