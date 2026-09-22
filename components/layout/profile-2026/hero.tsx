import React from "react";
import Image from "next/image";
import { ProfileHeroTagline } from "./hero-tagline";

import { GitHubIcon, LinkedInIcon } from "@/components/ui/profile-social-icons";
import { Profile2026Icon as Icon } from "@/components/ui/profile-2026-icon";
import type { Locale } from "@/lib/i18n";
import type { Profile } from "@/lib/profile";
import { profile2026Copy } from "@/lib/profile-2026-copy";
import { animatedProfileTagline, localizedProfileAsset } from "@/lib/profile-2026-assets";
import styles from "./hero.module.css";

export function Profile2026Hero({ locale, profile }: { locale: Locale; profile: Profile }) {
  const copy = profile2026Copy[locale];
  const animated = animatedProfileTagline(locale) !== null;
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
        <Image className={`${styles.portrait} ${styles.darkPortrait}`} src="/profile/2026/hero/portrait.dark.webp" alt={copy.portrait}
          width={1122} height={1402} sizes="(max-width: 760px) 75vw, (max-width: 1440px) 53vw, 760px" priority unoptimized />
        <Image className={`${styles.portrait} ${styles.lightPortrait}`} src="/profile/2026/hero/portrait.light.webp" alt={copy.portrait}
          width={1122} height={1402} sizes="(max-width: 760px) 75vw, (max-width: 1440px) 53vw, 760px" priority unoptimized />
        <div className={`${styles.tag} ${animated ? styles.animatedTag : ""}`}>
          {animated ? <ProfileHeroTagline locale={locale} alt={copy.tagline} /> :
            <Image src={localizedProfileAsset("hero", locale)} alt={copy.tagline}
              width={580} height={435} sizes="(max-width: 760px) 28vw, 150px" unoptimized />}
          <ul>{copy.heroTopics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
          <p className={styles.since}>{copy.since}</p>
        </div>
      </div>
    </section>
  );
}
