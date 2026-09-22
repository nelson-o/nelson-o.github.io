import React from "react";
import { Profile2026Icon as Icon } from "@/components/ui/profile-2026-icon";
import type { Profile } from "@/lib/profile";
import type { Dictionary } from "@/lib/i18n";
import styles from "./capabilities.module.css";

export function Profile2026Capabilities({ profile, dictionary }: { profile: Profile; dictionary: Dictionary }) {
  return (
    <section className={styles.capabilities} aria-label={dictionary.profilePage.capabilitiesTitle}>
      {profile.capabilities.map((item, index) => <article key={item.title}>
        <Icon name={(["platform", "chart", "people"] as const)[index % 3]} />
        <div><h2>{item.title}</h2><p>{item.highlights[0]}</p></div>
      </article>)}
    </section>
  );
}
