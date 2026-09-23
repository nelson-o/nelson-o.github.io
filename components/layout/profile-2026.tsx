import React from "react";
import { getProfile2026Labels } from "@/lib/profile-2026-labels";
import { getProfileContentLang, type ProfileLocale } from "@/lib/profile-locales";
import { profile2026Copy } from "@/lib/profile-2026-copy";
import type { Profile } from "@/lib/profile";
import { Profile2026Header } from "./profile-2026/header";
import { Profile2026Hero } from "./profile-2026/hero";
import { Profile2026Capabilities } from "./profile-2026/capabilities";
import { Profile2026Experience } from "./profile-2026/experience";
import { Profile2026Projects } from "./profile-2026/projects";
import { Profile2026Contact } from "./profile-2026/contact";
import { Profile2026Footer } from "./profile-2026/footer";
import styles from "./profile-2026/page.module.css";

export function Profile2026({ locale, profile }: { locale: ProfileLocale; profile: Profile }) {
  const copy = profile2026Copy[locale];
  const dictionary = getProfile2026Labels(locale);
  return (
    <div className={styles.page} lang={getProfileContentLang(locale)}>
      <div className={styles.container}>
        <a className={styles.skip} href="#main-content">{copy.skip}</a>
        <Profile2026Header locale={locale} dictionary={dictionary} copy={copy} />
        <main id="main-content" tabIndex={-1}>
          <Profile2026Hero locale={locale} profile={profile} />
          <Profile2026Capabilities profile={profile} dictionary={dictionary} />
          <Profile2026Experience profile={profile} copy={copy} />
          <Profile2026Projects profile={profile} copy={copy} dictionary={dictionary} />
          <Profile2026Contact locale={locale} profile={profile} copy={copy} />
        </main>
        <Profile2026Footer locale={locale} profile={profile} copy={copy} />
      </div>
    </div>
  );
}
