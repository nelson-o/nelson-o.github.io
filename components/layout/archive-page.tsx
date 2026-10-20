import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { EntryRow } from "@/components/ui/entry-row";
import { SiteSidebarLayout } from "@/components/layout/site-sidebar";
import { archiveKinds, getArchive, type ArchiveKind } from "@/lib/archives";
import { getDictionary, type Locale } from "@/lib/i18n";
import styles from "./archive-page.module.css";

export function ArchivePage({ locale, kind, id, archive }: {
  locale: Locale;
  kind: ArchiveKind;
  id?: string;
  archive: NonNullable<ReturnType<typeof getArchive>>;
}) {
  const dictionary = getDictionary(locale);
  const copy = dictionary.archives;
  const years = [...new Set(archive.entries.map((entry) => entry.date.slice(0, 4)))];
  return (
    <SiteSidebarLayout locale={locale}>
      <div data-archive-content="">
        <nav className={styles.navigation} aria-label={copy.navigation}>
          {archiveKinds.map((item) => (
            <Link key={item} href={`/${locale}/${item}`} aria-current={item === kind && !id ? "page" : undefined}>
              {copy[item]}
            </Link>
          ))}
        </nav>
        <PageHeader eyebrow={copy[kind]} title={archive.title} description={archive.description} />
        {archive.groups.length > 0 && (
          <ul className={styles.groups} data-archive-groups="">
            {archive.groups.map((group) => (
              <li key={group.id}><Link href={`/${locale}/${kind}/${group.id}`}>
                <span>{group.label}</span><span>({group.count})</span>
              </Link></li>
            ))}
          </ul>
        )}
        {archive.entries.length > 0 && (
          <div className={styles.entries}>
            {years.map((year) => (
              <section key={year} aria-labelledby={`archive-year-${year}`}>
                <h2 id={`archive-year-${year}`} className={styles.year}>{year}</h2>
                {archive.entries.filter((entry) => entry.date.startsWith(year)).map((entry) => (
                  <EntryRow key={`${entry.section}/${entry.slug}`} entry={entry} locale={locale}
                    priority={entry === archive.entries[0]} isDraft={!entry.published} />
                ))}
              </section>
            ))}
          </div>
        )}
        {!archive.groups.length && !archive.entries.length && <p>{copy.empty}</p>}
      </div>
    </SiteSidebarLayout>
  );
}
