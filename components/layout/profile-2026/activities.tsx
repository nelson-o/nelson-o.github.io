import React from "react";
import { Profile2026Icon as Icon } from "@/components/ui/profile-2026-icon";
import type { Profile } from "@/lib/profile";
import type { Profile2026Labels } from "@/lib/profile-2026-labels";
import type { Profile2026Copy } from "@/lib/profile-2026-copy";
import styles from "./activities.module.css";
import headingStyles from "./section-heading.module.css";

export function Profile2026Activities({ profile, copy, dictionary }: { profile: Profile; copy: Profile2026Copy; dictionary: Profile2026Labels }) {
  const activityGroups = ["talks", "sideProjects", "hackathons", "certifications"] as const;
  return (
    <aside className={styles.activities} id="talks" aria-labelledby="activities-heading">
      <h2 className={`${headingStyles.heading} ${styles.heading}`} id="activities-heading">{copy.beyond}</h2>
      {activityGroups.map((group, index) => <details key={group}>
        <summary><Icon name={(["talk", "code", "people", "award"] as const)[index]} />{dictionary.profilePage.activityLabels[group]}</summary>
        <ul>{profile.activities[group].map((entry) => <li key={`${entry.date}-${entry.label}`}><span>{entry.date}</span>{entry.label}</li>)}</ul>
      </details>)}
    </aside>
  );
}
