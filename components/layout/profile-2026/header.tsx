import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { Profile2026Labels } from "@/lib/profile-2026-labels";
import { getProfileSiteLocale, profileLocales, type ProfileLocale } from "@/lib/profile-locales";
import type { Profile2026Copy } from "@/lib/profile-2026-copy";
import styles from "./header.module.css";

export function Profile2026Header({ locale, dictionary, copy }: { locale: ProfileLocale; dictionary: Profile2026Labels; copy: Profile2026Copy }) {
  const anchors = ["about", "experience", "projects", "talks", "contact"];
  return (
    <header className={styles.header}>
      <Link className={styles.wordmark} href={`/${getProfileSiteLocale(locale)}/`}>NELSON</Link>
      <nav className={styles.nav} aria-label={dictionary.primaryNavigationLabel}>
        {anchors.map((anchor, index) => <a key={anchor} href={`#${anchor}`}>{copy.nav[index]}</a>)}
      </nav>
      <ThemeToggle locale={locale} dictionary={dictionary} languages={profileLocales} />
    </header>
  );
}
