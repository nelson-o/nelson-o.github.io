import React from "react";

import styles from "@/components/layout/profile-page.module.css";
import type { Dictionary } from "@/lib/i18n";
import type { Profile } from "@/lib/profile";

type ProfileActivitiesProps = {
  profile: Profile;
  dictionary: Dictionary;
};

export function ProfileActivities({ profile, dictionary }: ProfileActivitiesProps) {
  const groups = [
    {
      key: "talks",
      title: dictionary.profilePage.activityLabels.talks,
      items: profile.activities.talks,
    },
    {
      key: "certifications",
      title: dictionary.profilePage.activityLabels.certifications,
      items: profile.activities.certifications,
    },
    {
      key: "sideProjects",
      title: dictionary.profilePage.activityLabels.sideProjects,
      items: profile.activities.sideProjects,
    },
    {
      key: "hackathons",
      title: dictionary.profilePage.activityLabels.hackathons,
      items: profile.activities.hackathons,
    },
  ];

  return (
    <section className={styles.section} data-section="ideas">
      <div className={styles.sectionHeader}>
        <h2>{dictionary.profilePage.activitiesTitle}</h2>
      </div>

      <div className={`${styles.cardGrid} ${styles.activityGrid}`}>
        {groups.map((group) => (
          <article key={group.key} className={styles.card}>
            <h3 className={styles.cardTitle}>{group.title}</h3>
            <ul className={styles.list}>
              {group.items.map((item) => (
                <li key={`${item.date}-${item.label}`}>
                  <strong>{item.date}</strong> {item.label}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
