export const locales = ["en", "zh-tw"] as const;
export const defaultLocale = "en";
export const sections = ["systems", "work", "ideas", "lab"] as const;

export type Locale = (typeof locales)[number];
export type Section = (typeof sections)[number];

export type Dictionary = {
  localeLabel: string;
  languageSwitcherLabel: string;
  primaryNavigationLabel: string;
  primarySectionsLabel: string;
  profileNavigationLabel: string;
  navigation: Record<Section, string>;
  sectionCardKicker: string;
  latestWritingEyebrow: string;
  startWithSystemsLabel: string;
  footer: string;
  articleMetaSeparator: string;
  articleSectionLabels: Record<Section, string>;
  themeToggleLabel: string;
  themeToggleToDark: string;
  themeToggleToLight: string;
  themeToggleToSystem: string;
  site: {
    title: string;
    tagline: string;
    description: string;
  };
  home: {
    eyebrow: string;
    title: string;
    description: string;
    focusAreas: string[];
    latestWritingTitle: string;
    latestWritingDescription: string;
  };
  profilePage: {
    eyebrow: string;
    title: string;
    description: string;
    contactTitle: string;
    capabilitiesTitle: string;
    selectedExperienceTitle: string;
    priorExperienceTitle: string;
    priorExperienceDescription: string;
    projectsTitle: string;
    activitiesTitle: string;
    activityLabels: {
      talks: string;
      certifications: string;
      sideProjects: string;
      hackathons: string;
    };
  };
  settingsPanel: {
    buttonLabel: string;
    themeLabel: string;
    languageLabel: string;
  };
  sectionPages: Record<
    Section,
    {
      eyebrow: string;
      title: string;
      description: string;
      cardDescription: string;
    }
  >;
};
