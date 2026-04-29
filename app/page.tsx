"use client";

import React from "react";

import styles from "@/app/page.module.css";
import { SiteShell } from "@/components/layout/site-shell";
import { defaultLocale, getDictionary } from "@/lib/i18n";
import { getBestRootLocale } from "@/lib/root-locale";

export default function LocaleGatewayPage() {
  React.useEffect(() => {
    const browserLanguages = navigator.languages.length > 0 ? navigator.languages : [navigator.language];
    const locale = getBestRootLocale(browserLanguages);

    window.location.replace(`/${locale}/`);
  }, []);

  return (
    <SiteShell locale={defaultLocale} dictionary={getDictionary(defaultLocale)}>
      <main className={styles.root}>
        <div className={styles.panel}>
          <div className={styles.eyebrow}>Language</div>
          <h1 className={styles.title}>Entering the site.</h1>
          <p className={styles.description}>Selecting the best language from your browser settings.</p>

          <a className={styles.fallbackLink} href="/en/">
            Continue to English
          </a>
        </div>
      </main>
    </SiteShell>
  );
}
