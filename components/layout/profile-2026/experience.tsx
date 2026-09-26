import React from "react";
import Image from "next/image";

import type { Profile } from "@/lib/profile";
import type { Profile2026Copy } from "@/lib/profile-2026-copy";
import { employerMarks, markDisplaySize } from "@/lib/profile-2026-assets";
import { Profile2026Approach } from "./approach";
import headingStyles from "./section-heading.module.css";
import timelineStyles from "./experience.module.css";

export function Profile2026Experience({ profile, copy }: { profile: Profile; copy: Profile2026Copy }) {
  const roles = [...profile.selectedExperience, ...profile.groupedExperience.roles]
    .sort((a, b) => b.start.localeCompare(a.start));
  function timeline(items: typeof roles) {
    return <ol className={timelineStyles.timeline}>
      {items.map((role) => {
        const mark = employerMarks[role.company];
        // Only the starting year is shown; the full dates stay in the data (#86).
        return <li key={`${role.company}-${role.start}`} data-mark={mark ? undefined : "none"}>
        <p className={timelineStyles.period}><time dateTime={role.start}>{role.start.slice(0, 4)}</time></p>
        {mark && <div className={timelineStyles.brand} aria-hidden="true">
          <Image src={mark.src} alt="" width={mark.width} height={mark.height} className={timelineStyles.logo}
            style={{ "--mark-width": `${markDisplaySize(mark).width}px`, "--mark-height": `${markDisplaySize(mark).height}px` } as React.CSSProperties} />
        </div>}
        <div className={timelineStyles.role}><h3>{role.company}</h3><p className={timelineStyles.title}>{role.title}</p><p>{role.summary}</p></div>
      </li>;
      })}
    </ol>;
  }
  return <section className={timelineStyles.experience} id="experience" aria-labelledby="experience-heading">
    <div className={timelineStyles.career}>
      <h2 className={`${headingStyles.heading} ${timelineStyles.heading}`} id="experience-heading">{copy.experience}<span aria-hidden="true" />
        {/* An invisible twin of the history control reserves its exact width, so any translation fits. */}
        <span className={timelineStyles.reserve} aria-hidden="true">{copy.history}<span> →</span></span></h2>
      {timeline(roles.slice(0, 4))}
      <details className={timelineStyles.history}>
        <summary>{copy.history}<span aria-hidden="true"> →</span></summary>
        {timeline(roles.slice(4))}
      </details>
    </div>
    <Profile2026Approach copy={copy} />
  </section>;
}
