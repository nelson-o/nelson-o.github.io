import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { SeriesPath } from "@/components/layout/series-path";
import { EntryRow } from "@/components/ui/entry-row";
import { SiteSidebarLayout } from "@/components/layout/site-sidebar";
import { archiveKinds, getArchive, type ArchiveKind } from "@/lib/archives";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getArchiveYearsCopy } from "@/lib/i18n-archive-years";
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
  const showYearNavigation = kind === "posts" && !id && years.length > 0;
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
        {showYearNavigation && (
          <nav className={styles.yearNavigation} aria-labelledby="archive-years-label" data-archive-years="">
            <p id="archive-years-label">{getArchiveYearsCopy(locale)}</p>
            <ul>
              {years.map((year) => <li key={year}><a href={`#archive-year-${year}`}>{year}</a></li>)}
            </ul>
          </nav>
        )}
        {archive.groups.length > 0 && (
          <ul className={styles.groups} data-archive-groups="">
            {archive.groups.map((group) => (
              <li key={group.id}><Link href={`/${locale}/${kind}/${group.id}`}>
                <span>{group.label}</span><span>({group.count})</span>
              </Link></li>
            ))}
          </ul>
        )}
        {kind === "series" && id ? (
          <SeriesPath entries={archive.entries} locale={locale} />
        ) : archive.entries.length > 0 && (
          <div className={styles.entries}>
            {years.map((year) => (
              <section key={year} aria-labelledby={`archive-year-${year}`}>
                <h2 id={`archive-year-${year}`} className={styles.year} tabIndex={showYearNavigation ? -1 : undefined}>{year}</h2>
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
