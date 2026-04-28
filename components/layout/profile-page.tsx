import React from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Profile } from "@/lib/profile";

type ProfilePageProps = {
  profile: Profile;
  dictionary: Dictionary;
};

export function ProfilePage({ profile, dictionary }: ProfilePageProps) {
  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div className="eyebrow">{dictionary.profilePage.eyebrow}</div>
        <h1>{profile.basics.name}</h1>
        <p className="profile-title">{profile.basics.title}</p>
        <p className="profile-summary">{profile.summary}</p>

        <div className="profile-contact" aria-label={dictionary.profilePage.contactTitle}>
          <span>{profile.basics.location}</span>
          <a href={`mailto:${profile.basics.email}`}>{profile.basics.email}</a>
          {profile.basics.linkedin ? (
            <a href={profile.basics.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          ) : null}
        </div>
      </section>

      <section className="content-block">
        <div className="content-block-header">
          <h2>{dictionary.profilePage.capabilitiesTitle}</h2>
        </div>

        <div className="profile-capability-grid">
          {profile.capabilities.map((capability) => (
            <article key={capability.title} className="section-card">
              <h3>{capability.title}</h3>
              <ul className="profile-list">
                {capability.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="content-block">
        <div className="content-block-header">
          <h2>{dictionary.profilePage.selectedExperienceTitle}</h2>
        </div>

        <div className="profile-experience-grid">
          {profile.selectedExperience.map((role) => (
            <article key={`${role.company}-${role.title}-${role.start}`} className="entry-card">
              <div className="entry-meta">
                <span>{role.company}</span> <span>{dictionary.articleMetaSeparator}</span>{" "}
                <span>{role.periodLabel}</span>
              </div>
              <h3>{role.title}</h3>
              <p>{role.summary}</p>
              <p className="profile-role-location">{role.location}</p>
              <ul className="profile-list">
                {role.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <div className="hero-focus">
                {role.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-block">
        <div className="content-block-header">
          <h2>{dictionary.profilePage.priorExperienceTitle}</h2>
        </div>

        <p className="profile-section-summary">{dictionary.profilePage.priorExperienceDescription}</p>

        <div className="profile-history-list">
          {profile.groupedExperience.roles.map((role) => (
            <article key={`${role.company}-${role.title}-${role.start}`} className="profile-history-item">
              <div className="entry-meta">
                <span>{role.company}</span> <span>{dictionary.articleMetaSeparator}</span>{" "}
                <span>{role.periodLabel}</span>
              </div>
              <h3>{role.title}</h3>
              <p>{role.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-block">
        <div className="content-block-header">
          <h2>{dictionary.profilePage.projectsTitle}</h2>
        </div>

        <div className="profile-project-grid">
          {profile.projects.map((project) => (
            <article key={project.name} className="section-card">
              <h3>{project.name}</h3>
              <p>{project.summary}</p>
              <ul className="profile-list">
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="content-block">
        <div className="content-block-header">
          <h2>{dictionary.profilePage.activitiesTitle}</h2>
        </div>

        <div className="profile-activity-grid">
          <article className="section-card">
            <h3>{dictionary.profilePage.activityLabels.talks}</h3>
            <ul className="profile-list">
              {profile.activities.talks.map((item) => (
                <li key={`${item.date}-${item.label}`}>
                  <strong>{item.date}</strong> {item.label}
                </li>
              ))}
            </ul>
          </article>

          <article className="section-card">
            <h3>{dictionary.profilePage.activityLabels.certifications}</h3>
            <ul className="profile-list">
              {profile.activities.certifications.map((item) => (
                <li key={`${item.date}-${item.label}`}>
                  <strong>{item.date}</strong> {item.label}
                </li>
              ))}
            </ul>
          </article>

          <article className="section-card">
            <h3>{dictionary.profilePage.activityLabels.sideProjects}</h3>
            <ul className="profile-list">
              {profile.activities.sideProjects.map((item) => (
                <li key={`${item.date}-${item.label}`}>
                  <strong>{item.date}</strong> {item.label}
                </li>
              ))}
            </ul>
          </article>

          <article className="section-card">
            <h3>{dictionary.profilePage.activityLabels.hackathons}</h3>
            <ul className="profile-list">
              {profile.activities.hackathons.map((item) => (
                <li key={`${item.date}-${item.label}`}>
                  <strong>{item.date}</strong> {item.label}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
