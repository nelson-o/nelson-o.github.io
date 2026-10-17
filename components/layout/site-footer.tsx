import React from "react";
import Link from "next/link";

import { FootprintIcon, GitHubIcon, LinkedInIcon } from "@/components/ui/profile-social-icons";
import { getHrefWithLocale, type Dictionary, type Locale } from "@/lib/i18n";
import { getSiteFooterCopy } from "@/lib/i18n-site-footer";
import { getProfile } from "@/lib/profile";
import styles from "./site-footer.module.css";

export function SiteFooter({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const copy = getSiteFooterCopy(locale);
  const { basics } = getProfile(locale);
  const links = [["/profile", copy.about], ["/work", copy.projects], ["/posts", copy.posts], ["/ideas", copy.ideas]] as const;

  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.brand}>
        <Link className={styles.wordmark} href={getHrefWithLocale(locale, "/")} aria-label={dictionary.site.title}>NELSON</Link>
        <p>{copy.tagline}</p>
        <small>© {new Date().getFullYear()} {dictionary.site.title}</small>
      </div>
      <div className={styles.social}>
        {basics.github && <a href={basics.github} aria-label="GitHub"><GitHubIcon /></a>}
        {basics.linkedin && <a href={basics.linkedin} aria-label="LinkedIn"><LinkedInIcon /></a>}
        <a href={`/${locale}/feed.xml`} aria-label="RSS">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="5" cy="19" r="1" fill="currentColor" />
            <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" />
          </svg>
        </a>
        <Link href={getHrefWithLocale(locale, "/footprint")} aria-label={dictionary.footprintNavigationLabel}><FootprintIcon /></Link>
      </div>
      <div className={styles.actions}>
        <nav aria-label={copy.navigation}>
          {links.map(([path, label]) => <Link key={path} href={getHrefWithLocale(locale, path)}>{label}</Link>)}
          <a href="#contact">{copy.contact}</a>
        </nav>
        <a className={styles.top} href="#top" aria-label={copy.top}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 12 6-6 6 6M12 6v12" /></svg>
        </a>
      </div>
    </footer>
  );
}
