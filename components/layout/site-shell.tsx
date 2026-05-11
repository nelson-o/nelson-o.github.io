import React from "react";
import Link from "next/link";

import styles from "@/components/layout/site-shell.module.css";
import { ScrambledSiteTitle } from "@/components/ui/scrambled-site-title";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getHrefWithLocale, sections, type Dictionary, type Locale } from "@/lib/i18n";
import { getGitHubProfile } from "@/lib/github-profile";
import { FootprintIcon } from "@/components/ui/profile-social-icons";

type SiteShellProps = {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
};

export async function SiteShell({ locale, dictionary, children }: SiteShellProps) {
  const { bio } = await getGitHubProfile();
  return (
    <div className={styles.shell}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to content
      </a>
      <header className={styles.header}>
        <div>
          <Link
            href={getHrefWithLocale(locale, "/profile")}
            className={styles.title}
            aria-label={dictionary.site.displayTitle}
          >
            <ScrambledSiteTitle title={dictionary.site.displayTitle} />
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

      <main id="main-content">
        {children}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <div>{dictionary.footer}</div>
          <div>
            <ScrambledSiteTitle
              title={dictionary.footerCandidates[0]}
              candidates={dictionary.footerCandidates}
            />
          </div>
        </div>
        <Link
          href={getHrefWithLocale(locale, "/footprint")}
          className={styles.footerFootprintLink}
          aria-label={dictionary.footprintNavigationLabel}
        >
          <FootprintIcon className={styles.footerFootprintIcon} />
        </Link>
      </footer>
    </div>
  );
}
