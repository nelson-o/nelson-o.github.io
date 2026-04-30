import React from "react";

import styles from "@/components/layout/profile-page.module.css";
import type { Dictionary } from "@/lib/i18n";
import type { Profile } from "@/lib/profile";

type ProfileProjectsProps = {
  profile: Profile;
  dictionary: Dictionary;
};

export function ProfileProjects({ profile, dictionary }: ProfileProjectsProps) {
  return (
    <section className={styles.section} data-section="lab">
      <div className={styles.sectionHeader}>
        <h2>{dictionary.profilePage.projectsTitle}</h2>
      </div>

      <div className={`${styles.cardGrid} ${styles.projectGrid}`}>
        {profile.projects.map((project) => (
          <article key={project.name} className={styles.card}>
            <h3 className={styles.cardTitle}>{project.name}</h3>
            <p className={styles.cardText}>{project.summary}</p>
            <ul className={styles.list}>
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
