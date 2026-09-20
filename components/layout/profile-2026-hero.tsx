import React from "react";
import Image from "next/image";

import { GitHubIcon, LinkedInIcon } from "@/components/ui/profile-social-icons";
import { Profile2026Icon as Icon } from "@/components/ui/profile-2026-icon";
import type { Locale } from "@/lib/i18n";
import type { Profile } from "@/lib/profile";
import { profile2026Copy } from "@/lib/profile-2026-copy";
import styles from "./profile-2026-hero.module.css";

const taglineAssets: Record<Locale, string> = {
  en: "en", "zh-tw": "zh", "zh-cn": "zh", ja: "jp",
};

export function Profile2026Hero({ locale, profile }: { locale: Locale; profile: Profile }) {
  const copy = profile2026Copy[locale];
  return (
    <section className={styles.hero} id="about" aria-labelledby="profile-headline">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h1 id="profile-headline">{copy.headline[0]}<br /><span>{copy.headline[1]}</span></h1>
        <p className={styles.introduction}>{copy.introduction} <strong>{profile.basics.title}</strong></p>
        <p className={styles.summary}>{profile.summary}</p>
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
        <Image className={styles.portrait} src="/profile/2026/hero.webp" alt={copy.portrait}
          width={1122} height={1402} sizes="(max-width: 760px) 75vw, 600px" priority unoptimized />
        <div className={styles.tag}>
          <Image src={`/profile/2026/hero-tag.${taglineAssets[locale]}.webp`} alt={copy.tagline}
            width={580} height={435} sizes="(max-width: 760px) 28vw, 150px" unoptimized />
          <ul>{copy.heroTopics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
          <p className={styles.since}>{copy.since}</p>
        </div>
      </div>
    </section>
  );
}
