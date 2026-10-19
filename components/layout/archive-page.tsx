import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { EntryCard } from "@/components/ui/entry-card";
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
  return (
    <div>
      <nav className={styles.navigation} aria-label={copy.navigation}>
        {archiveKinds.map((item) => (
          <Link key={item} href={`/${locale}/${item}`} aria-current={item === kind && !id ? "page" : undefined}>
            {copy[item]}
          </Link>
        ))}
      </nav>
      <PageHeader eyebrow={copy[kind]} title={archive.title} description={archive.description} />
      {archive.groups.length > 0 && (
        <ul className={styles.groups}>
          {archive.groups.map((group) => (
            <li key={group.id}><Link href={`/${locale}/${kind}/${group.id}`}>
              <span>{group.label}</span><span>({group.count})</span>
            </Link></li>
          ))}
        </ul>
      )}
      {archive.entries.length > 0 && (
        <section aria-label={archive.title} className={styles.entries}>
          {archive.entries.map((entry) => <EntryCard key={`${entry.section}/${entry.slug}`} entry={entry} locale={locale} dictionary={dictionary} />)}
        </section>
      )}
      {!archive.groups.length && !archive.entries.length && <p>{copy.empty}</p>}
    </div>
  );
}
