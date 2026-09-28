import React from "react";
import Image from "next/image";
import { ProfileHeroTagline } from "./hero-tagline";

import { GitHubIcon, LinkedInIcon } from "@/components/ui/profile-social-icons";
import { Profile2026Icon as Icon } from "@/components/ui/profile-2026-icon";
import type { Profile } from "@/lib/profile";
import { profile2026Copy } from "@/lib/profile-2026-copy";
import { animatedProfileTagline, localizedProfileAsset } from "@/lib/profile-2026-assets";
import type { ProfileLocale } from "@/lib/profile-locales";
import { type Theme, themedImagePreloadScript } from "@/lib/theme";
import styles from "./hero.module.css";

// Only one portrait is fetched: the <img>s are lazy, so the one CSS hides is never requested, and an
// async script (hoisted into <head> by React) preloads the resolved theme's portrait at high priority.
// Async scripts don't wait for stylesheets, so it starts as early as a <link> preload would, but it
// also honours a stored or ?theme= preference (#132). As a data: URL it costs no extra request.
const portraitPath = (theme: Theme) => `/profile/2026/hero/portrait.${theme}.webp`;
const portraitPreload = `data:text/javascript,${encodeURIComponent(
  themedImagePreloadScript({ light: portraitPath("light"), dark: portraitPath("dark") }).replace(/\s*\n\s*/g, " "))}`;

export function Profile2026Hero({ locale, profile }: { locale: ProfileLocale; profile: Profile }) {
  const copy = profile2026Copy[locale];
  const animated = animatedProfileTagline(locale) !== null;
  const artwork = localizedProfileAsset("hero", locale);
  return (
    <section className={styles.hero} id="about" aria-labelledby="profile-headline">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h1 id="profile-headline">{copy.headline[0]}<br /><span>{copy.headline[1]}</span></h1>
        <p className={styles.summary}>{copy.introduction} {profile.basics.title}. {profile.summary}</p>
        <div className={styles.social}>
          <span><Icon name="pin" />{profile.basics.location}</span>
          {profile.basics.github && <a href={profile.basics.github}><GitHubIcon /><span>GitHub</span></a>}
          {profile.basics.linkedin && <a href={profile.basics.linkedin}><LinkedInIcon /><span>LinkedIn</span></a>}
        </div>
        <div className={styles.actions}>
          <a className={styles.button} href="#contact">{copy.contact}<Icon name="arrow" /></a>
          <a className={styles.textLink} href="#experience">{copy.experience}<span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <div className={styles.visual}>
        <script async src={portraitPreload} />
        <Image className={`${styles.portrait} ${styles.darkPortrait}`} src={portraitPath("dark")} alt={copy.portrait}
          width={1122} height={1402} sizes="(max-width: 760px) 75vw, (max-width: 1440px) 53vw, 760px" loading="lazy" fetchPriority="high" unoptimized />
        <Image className={`${styles.portrait} ${styles.lightPortrait}`} src={portraitPath("light")} alt={copy.portrait}
          width={1122} height={1402} sizes="(max-width: 760px) 75vw, (max-width: 1440px) 53vw, 760px" loading="lazy" fetchPriority="high" unoptimized />
        <div className={`${styles.tag} ${animated ? styles.animatedTag : ""}`}>
          {animated ? <ProfileHeroTagline locale={locale} alt={copy.tagline} /> : artwork ?
            <Image src={artwork} alt={copy.tagline}
              width={580} height={435} sizes="(max-width: 760px) 28vw, 150px" unoptimized /> :
            <p className={styles.taglineText}>{copy.tagline}</p>}
          <ul>{copy.heroTopics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
          <p className={styles.since}>{copy.since}</p>
        </div>
      </div>
    </section>
  );
}
