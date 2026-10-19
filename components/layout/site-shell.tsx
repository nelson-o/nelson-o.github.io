import React from "react";
import Link from "next/link";

import styles from "@/components/layout/site-shell.module.css";
import { ScrambledSiteTitle } from "@/components/ui/scrambled-site-title";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getHrefWithLocale, getLocaleHrefLang, type Dictionary, type Locale } from "@/lib/i18n";
import { SiteSectionLinks } from "@/components/ui/site-section-links";
import { getGitHubProfile } from "@/lib/github-profile";
import { SiteFooter } from "@/components/layout/site-footer";

type SiteShellProps = {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
};

export async function SiteShell({ locale, dictionary, children }: SiteShellProps) {
  const { bio } = await getGitHubProfile();
  return (
    <div id="top" className={styles.shell} lang={getLocaleHrefLang(locale)}>
      {/* Unica One is used only by site-shell and profile-page (2025) titles, so it loads with the shell, not site-wide. React hoists it into <head>. */}
      {/* eslint-disable-next-line @next/next/no-css-tags -- Local font loads only with this shell. */}
      <link rel="stylesheet" href="/fonts/unica-one/font.css" precedence="default" />
      <a href="#main-content" className={styles.skipLink}>
        {dictionary.skipToContentLabel}
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
            <SiteSectionLinks locale={locale} labels={dictionary.navigation} />
            <ThemeToggle locale={locale} dictionary={dictionary} />
          </nav>
        </div>
      </header>

      <main id="main-content">
        {children}
      </main>

      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}
