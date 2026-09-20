import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Profile2026Hero } from "@/components/layout/profile-2026-hero";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/profile-social-icons";
import { Profile2026Icon as Icon } from "@/components/ui/profile-2026-icon";
import { Profile2026Experience } from "@/components/layout/profile-2026-experience";
import { Profile2026Projects } from "@/components/layout/profile-2026-projects";
import { getDictionary, type Locale } from "@/lib/i18n";
import { profile2026Copy } from "@/lib/profile-2026-copy";
import type { Profile } from "@/lib/profile";
import styles from "./profile-2026.module.css";
import contactStyles from "./profile-2026-contact.module.css";

const footerTagAssets: Record<Locale, string> = {
  en: "en", "zh-tw": "zh", "zh-cn": "zh", ja: "jp",
};

export function Profile2026({ locale, profile }: { locale: Locale; profile: Profile }) {
  const copy = profile2026Copy[locale];
  const dictionary = getDictionary(locale);
  const anchors = ["about", "experience", "projects", "talks", "contact"];
  const social = <>
    {profile.basics.github && <a href={profile.basics.github}><GitHubIcon /><span>GitHub</span></a>}
    {profile.basics.linkedin && <a href={profile.basics.linkedin}><LinkedInIcon /><span>LinkedIn</span></a>}
  </>;

  return (
    <div className={styles.page} lang={locale === "zh-tw" ? "zh-Hant" : locale === "zh-cn" ? "zh-Hans" : locale}>
      <div className={styles.container}>
        <a className={styles.skip} href="#main-content">{copy.skip}</a>
        <header className={styles.header}>
          <Link className={styles.wordmark} href={`/${locale}/`}>NELSON</Link>
          <nav className={styles.nav} aria-label={dictionary.primaryNavigationLabel}>
            {anchors.map((anchor, index) => <a key={anchor} href={`#${anchor}`}>{copy.nav[index]}</a>)}
          </nav>
          <ThemeToggle locale={locale} dictionary={dictionary} />
        </header>
        <main id="main-content" tabIndex={-1}>
          <Profile2026Hero locale={locale} profile={profile} />
          <section className={styles.capabilities} aria-label={dictionary.profilePage.capabilitiesTitle}>
            {profile.capabilities.map((item, index) => <article key={item.title}>
              <Icon name={(["platform", "chart", "people"] as const)[index % 3]} />
              <div><h2>{item.title}</h2><p>{item.highlights[0]}</p></div>
            </article>)}
          </section>
          <Profile2026Experience profile={profile} copy={copy} />
          <Profile2026Projects profile={profile} copy={copy} dictionary={dictionary} />
          <section className={contactStyles.contact} id="contact" aria-labelledby="contact-heading">
            <h2 id="contact-heading">
              <Image src={`/profile/2026/signature.${footerTagAssets[locale]}.webp`} alt={copy.manifesto.join(" ")}
                width={1120} height={373} sizes="(max-width: 760px) calc(100vw - 44px), 480px" unoptimized />
            </h2>
            <div className={contactStyles.social}>{social}</div>
            {profile.basics.linkedin && <a className={contactStyles.contactButton} href={profile.basics.linkedin}>{copy.contact}<Icon name="arrow" /></a>}
          </section>
        </main>
        <footer className={styles.footer}>
          <Link className={styles.wordmark} href={`/${locale}/`}>NELSON</Link>
          <span>{profile.basics.title}</span>
          <span className={styles.footerMotto}>{copy.footer}</span>
          <Link href={`/${locale}/`}>{copy.site} <span aria-hidden="true">↗</span></Link>
        </footer>
      </div>
    </div>
  );
}
