import React from "react";

import styles from "@/components/layout/footprint-page.module.css";
import type { Dictionary } from "@/lib/i18n";
import type { Profile } from "@/lib/profile";
import { getProfileLocations, locationsToMarkers, periodLabel } from "@/lib/locations";
import { WorldMap } from "@/components/ui/world-map";

type FootprintPageProps = {
  dictionary: Dictionary;
  profile: Profile;
};

export function FootprintPage({ dictionary, profile }: FootprintPageProps) {
  const locations = getProfileLocations(profile);
  const markers = locationsToMarkers(locations);
  const allLocations = [locations.primary, ...locations.rest];

  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>{dictionary.footprintPage.eyebrow}</div>
        <h1 className={styles.title}>{dictionary.footprintPage.title}</h1>
        <p className={styles.description}>{dictionary.footprintPage.description}</p>
      </header>

      <section className={styles.mapSection}>
        <div className={styles.mapFrame}>
          <WorldMap markers={markers} ariaLabel={dictionary.footprintPage.mapLabel} />
        </div>
      </section>

      <ul className={styles.locationList} aria-label="Locations">
        {allLocations.map((location) => (
          <li key={location.key} className={location.key === locations.primary.key ? styles.locationItemPrimary : styles.locationItem}>
            <div className={styles.locationName}>
              <span className={styles.locationDot} aria-hidden="true" />
              {location.displayName}
            </div>
            <ul className={styles.roleList}>
              {location.roles.map((role, i) => (
                <li key={i} className={styles.roleItem}>
                  <span className={styles.roleCompany}>{role.company}</span>
                  <span className={styles.roleSep} aria-hidden="true">·</span>
                  <span className={styles.roleTitle}>{role.title}</span>
                  <span className={styles.rolePeriod}>{periodLabel(role.start, role.end)}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
