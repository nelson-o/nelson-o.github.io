import React from "react";
import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/profile-social-icons";
import { Profile2026Icon as Icon } from "@/components/ui/profile-2026-icon";
import { Profile2026Experience } from "@/components/layout/profile-2026-experience";
import { Profile2026Projects } from "@/components/layout/profile-2026-projects";
import { getDictionary, type Locale } from "@/lib/i18n";
import { profile2026Copy } from "@/lib/profile-2026-copy";
import type { Profile } from "@/lib/profile";
import styles from "./profile-2026.module.css";

export function Profile2026({ locale, profile, preview }: { locale: Locale; profile: Profile; preview: boolean }) {
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
          <Link className={styles.wordmark} href={`/${locale}/`}>NELSON<span>LIN</span></Link>
          <nav className={styles.nav} aria-label={dictionary.primaryNavigationLabel}>
            {anchors.map((anchor, index) => <a key={anchor} href={`#${anchor}`}>{copy.nav[index]}</a>)}
          </nav>
          <ThemeToggle locale={locale} dictionary={dictionary} />
        </header>
        {preview && <aside className={styles.preview} aria-label={copy.preview}>
          <span><i aria-hidden="true" />{copy.preview}</span>
          <span className={styles.previewNote}>{copy.previewNote}</span>
          <Link href={`/${locale}/profile/`}>{copy.stable} <span aria-hidden="true">↗</span></Link>
        </aside>}
        <main id="main-content" tabIndex={-1}>
          <section className={styles.hero} id="about" aria-labelledby="profile-headline">
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>{copy.eyebrow}</p>
              <h1 id="profile-headline">{copy.headline[0]}<br /><span>{copy.headline[1]}</span></h1>
              <p className={styles.introduction}>{copy.introduction} <strong>{profile.basics.title}</strong></p>
              <p className={styles.summary}>{profile.summary}</p>
              <div className={styles.social}><span><Icon name="pin" />{profile.basics.location}</span>{social}</div>
              <div className={styles.heroActions}>
                <a className={styles.button} href="#contact">{copy.contact}<Icon name="arrow" /></a>
                <a className={styles.textLink} href="#experience">{copy.experience}<span aria-hidden="true">↓</span></a>
              </div>
            </div>
            <figure className={styles.portrait}>
              <div className={styles.portraitFrame}>
                <Image src="/profile/2026/portrait.jpg" alt={copy.portrait} width={361} height={361} priority unoptimized />
              </div>
              <figcaption><span>NELSON LIN</span><span>{profile.basics.title}</span></figcaption>
              <span className={styles.portraitIndex} aria-hidden="true">01 / ABOUT</span>
            </figure>
          </section>
          <section className={styles.capabilities} aria-label={dictionary.profilePage.capabilitiesTitle}>
            {profile.capabilities.map((item, index) => <article key={item.title}>
              <Icon name={(["platform", "chart", "people"] as const)[index % 3]} />
              <div><h2>{item.title}</h2><p>{item.highlights[0]}</p></div>
            </article>)}
          </section>
          <Profile2026Experience profile={profile} copy={copy} />
          <Profile2026Projects profile={profile} copy={copy} dictionary={dictionary} />
          <section className={styles.contact} id="contact" aria-labelledby="contact-heading">
            <h2 id="contact-heading">{copy.manifesto[0]}<br /><span>{copy.manifesto[1]} {copy.manifesto[2]}</span></h2>
            <div className={styles.social}>{social}</div>
            {profile.basics.linkedin && <a className={styles.contactButton} href={profile.basics.linkedin}>{copy.contact}<Icon name="arrow" /></a>}
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
