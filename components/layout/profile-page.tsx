import React from "react";

import styles from "@/components/layout/profile-page.module.css";
import type { Dictionary } from "@/lib/i18n";
import type { Profile } from "@/lib/profile";
import { ProfileActivities } from "@/components/layout/profile-activities";
import { ProfileCapabilities } from "@/components/layout/profile-capabilities";
import { ProfileExperience } from "@/components/layout/profile-experience";
import { ProfileHistory } from "@/components/layout/profile-history";
import { ProfileProjects } from "@/components/layout/profile-projects";

type ProfilePageProps = {
  profile: Profile;
  dictionary: Dictionary;
};

export function ProfilePage({ profile, dictionary }: ProfilePageProps) {
  return (
    <main className={styles.root}>
      <section className={styles.hero}>
        <div className={styles.eyebrow}>{dictionary.profilePage.eyebrow}</div>
        <h1 className={styles.title}>{profile.basics.name}</h1>
        <p className={styles.profileTitle}>{profile.basics.title}</p>
        <p className={styles.summary}>{profile.summary}</p>

        <div className={styles.contact} aria-label={dictionary.profilePage.contactTitle}>
          <span>{profile.basics.location}</span>
          <a href={`mailto:${profile.basics.email}`}>{profile.basics.email}</a>
          {profile.basics.linkedin ? (
            <a href={profile.basics.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          ) : null}
        </div>
      </section>

      <ProfileCapabilities profile={profile} dictionary={dictionary} />
      <ProfileExperience profile={profile} dictionary={dictionary} />
      <ProfileHistory profile={profile} dictionary={dictionary} />
      <ProfileProjects profile={profile} dictionary={dictionary} />
      <ProfileActivities profile={profile} dictionary={dictionary} />
    </main>
  );
}
