import React from "react";
import Link from "next/link";

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
    <div className="site-shell">
      <header className="site-header">
        <div>
          <Link href={getHrefWithLocale(locale, "/")} className="site-title">
            {dictionary.site.title}
          </Link>
          <p className="site-tagline">{dictionary.site.tagline}</p>
        </div>

        <div className="site-header-actions">
          <nav className="site-nav" aria-label={dictionary.primaryNavigationLabel}>
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

          <nav className="locale-switcher" aria-label={dictionary.languageSwitcherLabel}>
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

      <footer className="site-footer">{dictionary.footer}</footer>
    </div>
  );
}
