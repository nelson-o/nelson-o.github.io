import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { Profile } from "@/lib/profile";
import { getProfileSiteLocale, profileLocales, type ProfileLocale } from "@/lib/profile-locales";
import type { Profile2026Copy } from "@/lib/profile-2026-copy";
import type { Profile2026Labels } from "@/lib/profile-2026-labels";
import styles from "./footer.module.css";

export function Profile2026Footer({ locale, profile, copy, dictionary }: { locale: ProfileLocale; profile: Profile; copy: Profile2026Copy; dictionary: Profile2026Labels }) {
  const site = `/${getProfileSiteLocale(locale)}/`;
  return (
    <footer className={styles.footer}>
      <Link className={styles.wordmark} href={site}>NELSON</Link>
      <span>{profile.basics.title}</span>
      <span className={styles.footerMotto}>{copy.footer}</span>
      <Link href={site}>{copy.site} <span aria-hidden="true">↗</span></Link>
      <div className={styles.settings}>
        <ThemeToggle locale={locale} dictionary={dictionary} languages={profileLocales} panelPlacement="above" rememberLanguage />
      </div>
    </footer>
  );
}
