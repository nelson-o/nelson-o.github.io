import React from "react";

import styles from "@/components/layout/profile-page.module.css";
import type { Dictionary } from "@/lib/i18n";
import type { Profile } from "@/lib/profile";

type ProfileHistoryProps = {
  profile: Profile;
  dictionary: Dictionary;
};

export function ProfileHistory({ profile, dictionary }: ProfileHistoryProps) {
  return (
    <section className={styles.section} data-section="work">
      <div className={styles.sectionHeader}>
        <h2>{dictionary.profilePage.priorExperienceTitle}</h2>
      </div>

      <p className={styles.sectionSummary}>{dictionary.profilePage.priorExperienceDescription}</p>

      <div className={styles.historyList}>
        {profile.groupedExperience.roles.map((role) => (
          <article key={`${role.company}-${role.title}-${role.start}`} className={styles.historyItem}>
            <div className={styles.meta}>
              <span>{role.company}</span> <span>{dictionary.articleMetaSeparator}</span>{" "}
              <span>{role.periodLabel}</span>
            </div>
            <h3 className={styles.cardTitle}>{role.title}</h3>
            <p className={styles.cardText}>{role.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
