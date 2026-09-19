import React from "react";

import { Profile2026Icon as Icon } from "@/components/ui/profile-2026-icon";
import type { Profile } from "@/lib/profile";
import type { Dictionary } from "@/lib/i18n";
import type { Profile2026Copy } from "@/lib/profile-2026-copy";
import styles from "./profile-2026-sections.module.css";

export function Profile2026Projects({ profile, copy, dictionary }: { profile: Profile; copy: Profile2026Copy; dictionary: Dictionary }) {
  const activityGroups = ["talks", "sideProjects", "hackathons", "certifications"] as const;
  return <section className={styles.work} id="projects" aria-labelledby="projects-heading">
    <div className={styles.projects}>
      <h2 className={styles.heading} id="projects-heading">{copy.projects}<span aria-hidden="true" /></h2>
      <div className={styles.projectGrid}>
        {profile.projects.map((project, index) => <article className={styles.project} data-art={index % 3} key={project.name}>
          <span className={styles.category}>{copy.categories[index % 3]}</span>
          <h3>{project.name}</h3>
          <p>{project.summary}</p>
          <details>
            <summary>{copy.projectDetails}<span aria-hidden="true"> +</span></summary>
            <ul>{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
          </details>
        </article>)}
      </div>
    </div>
    <aside className={styles.activities} id="talks" aria-labelledby="activities-heading">
      <h2 className={styles.heading} id="activities-heading">{copy.beyond}</h2>
      {activityGroups.map((group, index) => <details key={group}>
        <summary><Icon name={(["talk", "code", "people", "award"] as const)[index]} />{dictionary.profilePage.activityLabels[group]}</summary>
        <ul>{profile.activities[group].map((entry) => <li key={`${entry.date}-${entry.label}`}><span>{entry.date}</span>{entry.label}</li>)}</ul>
      </details>)}
    </aside>
  </section>;
}
