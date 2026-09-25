import React from "react";

import { Profile2026Icon as Icon } from "@/components/ui/profile-2026-icon";
import type { Profile } from "@/lib/profile";
import type { Profile2026Labels } from "@/lib/profile-2026-labels";
import type { Profile2026Copy } from "@/lib/profile-2026-copy";
import { Profile2026Activities } from "./activities";
import headingStyles from "./section-heading.module.css";
import styles from "./projects.module.css";

export function Profile2026Projects({ profile, copy, dictionary }: { profile: Profile; copy: Profile2026Copy; dictionary: Profile2026Labels }) {
  return <section className={styles.work} id="projects" aria-labelledby="projects-heading">
    <div>
      <h2 className={headingStyles.heading} id="projects-heading">{copy.projects}<span aria-hidden="true" /></h2>
      <div className={styles.projectGrid}>
        {profile.projects.map((project) => <article className={styles.project} data-art={project.category} key={project.name}>
          {project.category && <span className={styles.category}>{copy.categories[project.category]}</span>}
          <h3>{project.name}</h3>
          <p>{project.summary}</p>
          <details>
            <summary>{copy.projectDetails}<Icon name="arrow" /></summary>
            <ul>{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
          </details>
        </article>)}
      </div>
    </div>
    <Profile2026Activities profile={profile} copy={copy} dictionary={dictionary} />
  </section>;
}
