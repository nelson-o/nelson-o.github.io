import React from "react";
import Link from "next/link";

import styles from "@/components/layout/site-shell.module.css";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getHrefWithLocale, sections, type Dictionary, type Locale } from "@/lib/i18n";
import { getGitHubProfile } from "@/lib/github-profile";

type SiteShellProps = {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
};

export async function SiteShell({ locale, dictionary, children }: SiteShellProps) {
  const { bio } = await getGitHubProfile();
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div>
          <Link href={getHrefWithLocale(locale, "/profile")} className={styles.title}>
            {dictionary.site.title}
          </Link>
          <p className={styles.tagline}>{bio ?? dictionary.site.tagline}</p>
        </div>

        <div className={styles.headerActions}>
          <nav className={styles.nav} aria-label={dictionary.primaryNavigationLabel}>
            {sections.map((section) => (
              <Link key={section} href={getHrefWithLocale(locale, `/${section}`)}>
                {dictionary.navigation[section]}
              </Link>
            ))}
            <ThemeToggle locale={locale} dictionary={dictionary} />
          </nav>
        </div>
      </header>

      {children}

      <footer className={styles.footer}>{dictionary.footer}</footer>
    </div>
  );
}
