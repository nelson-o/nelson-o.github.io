import React from "react";
import Link from "next/link";

import styles from "@/app/page.module.css";
import { SiteShell } from "@/components/layout/site-shell";
import { defaultLocale, getDictionary, locales, type Locale } from "@/lib/i18n";

const localeLabels: Record<Locale, string> = {
  en: "English",
  "zh-tw": "繁體中文",
};

export default function LocaleGatewayPage() {
  return (
    <SiteShell locale={defaultLocale} dictionary={getDictionary(defaultLocale)}>
      <main className={styles.root}>
        <div className={styles.panel}>
          <div className={styles.eyebrow}>Language</div>
          <h1 className={styles.title}>Choose a reading language.</h1>
          <p className={styles.description}>
            The site now publishes localized routes for global readers. Pick a language to enter the
            writing surface.
          </p>

          <div className={styles.links}>
            {locales.map((locale) => (
              <Link key={locale} href={`/${locale}`}>
                <h2>{localeLabels[locale]}</h2>
                <p>/{locale}/</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
