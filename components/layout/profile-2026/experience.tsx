import React from "react";
import Image from "next/image";

import type { Profile } from "@/lib/profile";
import type { Profile2026Copy } from "@/lib/profile-2026-copy";
import { Profile2026Approach } from "./approach";
import headingStyles from "./section-heading.module.css";
import timelineStyles from "./experience.module.css";

const companyLogos: Record<string, string> = {
  "momoshop.tw": "momo",
  "SWAG.live": "swag",
  foodpanda: "foodpanda",
  ViewSonic: "viewsonic",
};

export function Profile2026Experience({ profile, copy }: { profile: Profile; copy: Profile2026Copy }) {
  const roles = [...profile.selectedExperience, ...profile.groupedExperience.roles]
    .sort((a, b) => b.start.localeCompare(a.start));
  function timeline(items: typeof roles) {
    return <ol className={timelineStyles.timeline}>
      {items.map((role) => <li key={`${role.company}-${role.start}`}>
        <p className={timelineStyles.period}><time dateTime={role.start}>{role.start.slice(0, 4)}</time> – {role.end ? <time dateTime={role.end}>{role.end.slice(0, 4)}</time> : copy.present}</p>
        <div className={timelineStyles.brand} aria-hidden="true">
          {companyLogos[role.company] && <Image
            src={`/profile/2026/brands/${companyLogos[role.company]}.png`}
            alt="" width={80} height={60} className={timelineStyles.logo}
          />}
        </div>
        <div className={timelineStyles.role}><h3>{role.company}</h3><p className={timelineStyles.title}>{role.title}</p><p>{role.summary}</p></div>
      </li>)}
    </ol>;
  }
  return <section className={timelineStyles.experience} id="experience" aria-labelledby="experience-heading">
    <div className={timelineStyles.career}>
      <h2 className={`${headingStyles.heading} ${timelineStyles.heading}`} id="experience-heading">{copy.experience}<span aria-hidden="true" /></h2>
      {timeline(roles.slice(0, 4))}
      <details className={timelineStyles.history}>
        <summary>{copy.history}<span aria-hidden="true"> →</span></summary>
        {timeline(roles.slice(4))}
      </details>
    </div>
    <Profile2026Approach copy={copy} />
  </section>;
}
