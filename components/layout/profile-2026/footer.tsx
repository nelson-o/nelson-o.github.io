import React from "react";
import Link from "next/link";
import type { Profile } from "@/lib/profile";
import { getProfileSiteLocale, type ProfileLocale } from "@/lib/profile-locales";
import type { Profile2026Copy } from "@/lib/profile-2026-copy";
import styles from "./footer.module.css";

export function Profile2026Footer({ locale, profile, copy }: { locale: ProfileLocale; profile: Profile; copy: Profile2026Copy }) {
  const site = `/${getProfileSiteLocale(locale)}/`;
  return (
    <footer className={styles.footer}>
      <Link className={styles.wordmark} href={site}>NELSON</Link>
      <span>{profile.basics.title}</span>
      <span className={styles.footerMotto}>{copy.footer}</span>
      <Link href={site}>{copy.site} <span aria-hidden="true">↗</span></Link>
    </footer>
  );
}
