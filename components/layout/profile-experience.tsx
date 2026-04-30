import React from "react";

import styles from "@/components/layout/profile-page.module.css";
import type { Dictionary } from "@/lib/i18n";
import type { Profile } from "@/lib/profile";

type ProfileExperienceProps = {
  profile: Profile;
  dictionary: Dictionary;
};

export function ProfileExperience({ profile, dictionary }: ProfileExperienceProps) {
  return (
    <section className={styles.section} data-section="work">
      <div className={styles.sectionHeader}>
        <h2>{dictionary.profilePage.selectedExperienceTitle}</h2>
      </div>

      <div className={`${styles.cardGrid} ${styles.experienceGrid}`}>
        {profile.selectedExperience.map((role) => (
          <article key={`${role.company}-${role.title}-${role.start}`} className={styles.card}>
            <div className={styles.meta}>
              <span>{role.company}</span> <span>{dictionary.articleMetaSeparator}</span>{" "}
              <span>{role.periodLabel}</span>
            </div>
            <h3 className={styles.cardTitle}>{role.title}</h3>
            <p className={styles.cardText}>{role.summary}</p>
            <p className={styles.roleLocation}>{role.location}</p>
            <ul className={styles.list}>
              {role.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <div className={styles.stack}>
              {role.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
