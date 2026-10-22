import React from "react";
import Link from "next/link";

import styles from "@/components/layout/site-shell.module.css";
import { SiteSearch } from "@/components/ui/site-search";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getHrefWithLocale, getLocaleHrefLang, type Dictionary, type Locale } from "@/lib/i18n";
import { SiteSectionLinks } from "@/components/ui/site-section-links";
import { SiteFooter } from "@/components/layout/site-footer";

type SiteShellProps = {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
};

export async function SiteShell({ locale, dictionary, children }: SiteShellProps) {
  return (
    <div id="top" className={styles.shell} lang={getLocaleHrefLang(locale)}>
      <a href="#main-content" className={styles.skipLink}>
        {dictionary.skipToContentLabel}
      </a>
      <header className={styles.header}>
        <Link href={getHrefWithLocale(locale, "/")} className={styles.title} aria-label={dictionary.site.displayTitle}>NELSON</Link>
        <SiteSectionLinks locale={locale} navigationLabel={dictionary.primaryNavigationLabel} />
        <SiteSearch key={locale} locale={locale} />
        <ThemeToggle locale={locale} dictionary={dictionary} icon="theme" />
      </header>

      <main id="main-content">
        {children}
      </main>

      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}
