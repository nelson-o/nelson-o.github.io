import React from "react";
import Link from "next/link";
import styles from "@/components/layout/site-sidebar.module.css";
import type { Locale } from "@/lib/i18n";
import { getSidebarCopy } from "@/lib/i18n-sidebar";
import { getSeries, getTagCounts } from "@/lib/mdx/content-taxonomy";

export function SiteSidebar({ locale }: { locale: Locale }) {
  const copy = getSidebarCopy(locale);
  return (
    <aside className={styles.sidebar} aria-label={copy.label}>
      <section className={styles.panel}>
        <h2>{copy.about}</h2>
        <p>{copy.intro}</p>
        <Link className={styles.more} href={`/${locale}/profile/`}>{copy.learnMore} <span aria-hidden="true">→</span></Link>
      </section>
      <section className={styles.panel}>
        <h2>{copy.topics}</h2>
        <ul className={styles.topics}>
          {getTagCounts(locale).slice(0, 4).map(({ id, label, count }) => (
            <li key={id}><Link href={`/${locale}/topics/${id}/`}>#{label} ({count})</Link></li>
          ))}
        </ul>
        <Link className={styles.more} href={`/${locale}/topics/`}>{copy.moreTopics} <span aria-hidden="true">→</span></Link>
      </section>
      <section className={styles.panel}>
        <h2>{copy.series}</h2>
        <ul className={styles.series}>
          {getSeries(locale).map(({ id, label, count }) => (
            <li key={id}>
              <Link href={`/${locale}/series/${id}/`}>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h6l2 2 2-2h6v16h-6l-2 2-2-2H4V4Zm8 2v16" />
                </svg>
                <span>{label}<span className={styles.count}>{count} {copy.posts}</span></span>
              </Link>
            </li>
          ))}
        </ul>
        <Link className={styles.more} href={`/${locale}/series/`}>{copy.allSeries} <span aria-hidden="true">→</span></Link>
      </section>
    </aside>
  );
}

export function SiteSidebarLayout({ locale, children }: { locale: Locale; children?: React.ReactNode }) {
  return <div className={styles.layout} data-sidebar-layout><div className={styles.content}>{children}</div><SiteSidebar locale={locale} /></div>;
}
