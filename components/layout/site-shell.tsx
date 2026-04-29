import React from "react";
import Link from "next/link";

import styles from "@/components/layout/site-shell.module.css";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  getHrefWithLocale,
  locales,
  sections,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";

type SiteShellProps = {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
};

export function SiteShell({ locale, dictionary, children }: SiteShellProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div>
          <Link href={getHrefWithLocale(locale, "/")} className={styles.title}>
            {dictionary.site.title}
          </Link>
          <p className={styles.tagline}>{dictionary.site.tagline}</p>
        </div>

        <div className={styles.headerActions}>
          <nav className={styles.nav} aria-label={dictionary.primaryNavigationLabel}>
            <Link href={getHrefWithLocale(locale, "/profile")}>{dictionary.profileNavigationLabel}</Link>
            {sections.map((section) => (
              <Link key={section} href={getHrefWithLocale(locale, `/${section}`)}>
                {dictionary.navigation[section]}
              </Link>
            ))}
            <ThemeToggle
              label={dictionary.themeToggleLabel}
              labels={{
                light: dictionary.themeToggleToDark,
                dark: dictionary.themeToggleToLight,
              }}
            />
          </nav>

          <nav className={styles.localeSwitcher} aria-label={dictionary.languageSwitcherLabel}>
            {locales.map((item) => (
              <Link
                key={item}
                href={getHrefWithLocale(item, "/")}
                aria-current={item === locale ? "page" : undefined}
              >
                {item === locale ? dictionary.localeLabel : item === "en" ? "English" : "繁體中文"}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {children}

      <footer className={styles.footer}>{dictionary.footer}</footer>
    </div>
  );
}
