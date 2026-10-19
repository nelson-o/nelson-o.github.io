import React from "react";
import { sections, type Locale } from "@/lib/i18n";
import { getLandingTabsCopy } from "@/lib/i18n-landing-tabs";
import styles from "./landing-tabs.module.css";

export function LandingTabs({ locale }: { locale: Locale }) {
  const copy = getLandingTabsCopy(locale);
  return (
    <nav className={styles.tabs} aria-label={copy.navigation}>
      <a href={`/${locale}/`} aria-current="page">{copy.latest}</a>
      {sections.map((section) => (
        <a key={section} href={`/${locale}/${section}/`}>{copy[section]}</a>
      ))}
    </nav>
  );
}
