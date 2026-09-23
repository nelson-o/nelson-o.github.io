import React from "react";
import Image from "next/image";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/profile-social-icons";
import { Profile2026Icon as Icon } from "@/components/ui/profile-2026-icon";
import type { Profile } from "@/lib/profile";
import type { ProfileLocale } from "@/lib/profile-locales";
import type { Profile2026Copy } from "@/lib/profile-2026-copy";
import { localizedProfileAsset } from "@/lib/profile-2026-assets";
import styles from "./contact.module.css";

export function Profile2026Contact({ locale, profile, copy }: { locale: ProfileLocale; profile: Profile; copy: Profile2026Copy }) {
  const artwork = localizedProfileAsset("contact", locale);
  const social = <>
    {profile.basics.github && <a href={profile.basics.github}><GitHubIcon /><span>GitHub</span></a>}
    {profile.basics.linkedin && <a href={profile.basics.linkedin}><LinkedInIcon /><span>LinkedIn</span></a>}
  </>;
  return (
    <section className={styles.contact} id="contact" aria-labelledby="contact-heading">
      <h2 id="contact-heading">
        {artwork ? <Image src={artwork} alt={copy.manifesto.join(" ")}
          width={1120} height={373} sizes="(max-width: 760px) calc(100vw - 44px), 480px" unoptimized /> :
          copy.manifesto.map((line) => <span className={styles.manifestoLine} key={line}>{line}</span>)}
      </h2>
      <div className={styles.social}>{social}</div>
      {profile.basics.linkedin && <a className={styles.contactButton} href={profile.basics.linkedin}>{copy.contact}<Icon name="arrow" /></a>}
    </section>
  );
}
