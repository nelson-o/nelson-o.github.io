import React from "react";

import styles from "@/components/layout/profile-page.module.css";
import type { Dictionary } from "@/lib/i18n";
import type { Profile } from "@/lib/profile";

type ProfileCapabilitiesProps = {
  profile: Profile;
  dictionary: Dictionary;
};

export function ProfileCapabilities({ profile, dictionary }: ProfileCapabilitiesProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>{dictionary.profilePage.capabilitiesTitle}</h2>
      </div>

      <div className={`${styles.cardGrid} ${styles.capabilityGrid}`}>
        {profile.capabilities.map((capability) => (
          <article key={capability.title} className={styles.card}>
            <h3 className={styles.cardTitle}>{capability.title}</h3>
            <ul className={styles.list}>
              {capability.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
