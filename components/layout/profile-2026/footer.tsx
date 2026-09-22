import React from "react";
import Link from "next/link";
import type { Profile } from "@/lib/profile";
import type { Locale } from "@/lib/i18n";
import type { Profile2026Copy } from "@/lib/profile-2026-copy";
import styles from "./footer.module.css";

export function Profile2026Footer({ locale, profile, copy }: { locale: Locale; profile: Profile; copy: Profile2026Copy }) {
  return (
    <footer className={styles.footer}>
      <Link className={styles.wordmark} href={`/${locale}/`}>NELSON</Link>
      <span>{profile.basics.title}</span>
      <span className={styles.footerMotto}>{copy.footer}</span>
      <Link href={`/${locale}/`}>{copy.site} <span aria-hidden="true">↗</span></Link>
    </footer>
  );
}
