import type { Dictionary } from "@/lib/i18n-types";

export const enDictionary: Dictionary = {
  localeLabel: "English",
  languageSwitcherLabel: "Language",
  primaryNavigationLabel: "Primary",
  primarySectionsLabel: "Primary sections",
  profileNavigationLabel: "Profile",
  footprintNavigationLabel: "Footprint",
  navigation: { systems: "Systems", work: "Work", ideas: "Ideas", digests: "Digests" },
  sectionCardKicker: "Section",
  latestWritingEyebrow: "Latest Writing",
  startWithSystemsLabel: "Start with systems",
  footer: "यथा स्वप्नं माया बुद्बुदं छायायथा विद्युत् एवं द्रष्टव्यं संस्कृतम्",
  footerCandidates: [
    "Powered by GitHub Pages",
    "Built with Codex · GPT-5.5",
    "Enhanced with Claude Code · Sonnet 4.6",
    "All conditioned phenomena are like dreams, illusions, bubbles, or flashes of lightning.",
  ],
  articleMetaSeparator: "•",
  articleSectionLabels: { systems: "Systems", work: "Work", ideas: "Ideas", digests: "Digests" },
  llmContextLabel: "LLM context",
  llmContextModelLabel: "Model",
  llmContextDateLabel: "Date",
  llmContextInteractionLabel: "Interaction",
  articleLanguageSuggestion: {
    label: "Language suggestion",
    message: "This article is also available in {locale}.",
    action: "Read in {locale}",
    dismiss: "Dismiss",
  },
  themeToggleLabel: "Toggle color theme",
  themeToggleToDark: "Dark",
  themeToggleToLight: "Light",
  themeToggleToSystem: "System",
  site: {
    title: "Nelson Lin",
    tagline: "ἓν οἶδα ὅτι οὐδὲν οἶδα",
    description: "An engineering knowledge surface for systems, work, ideas, and experiments.",
  },
  home: {
    eyebrow: "Engineering Knowledge Surface",
    title: "Frontend systems built as platforms, not page collections.",
    description:
      "I use this site to accumulate system design decisions, delivery patterns, and the working ideas behind platform engineering, CI, and agent-driven engineering loops.",
    focusAreas: ["Agent Workflows", "Platform Engineering", "CI/CD"],
    latestWritingTitle: "Recent entries across systems, work, ideas, and digests.",
    latestWritingDescription:
      "The first version stays small on purpose: enough surface area to prove the content model and the deployment path.",
  },
  profilePage: {
    eyebrow: "Engineering Since 2010",
    title: "Senior-level platform and frontend systems work, presented as operating evidence.",
    description:
      "A curated view of Nelson Lin's recent roles, platform strengths, and selected projects across enterprise, e-commerce, and product engineering.",
    contactTitle: "Profile contact links",
    capabilitiesTitle: "Core Strengths",
    selectedExperienceTitle: "Positions Across the AI Wave",
    priorExperienceTitle: "Earlier-Stage Software Development Roles",
    priorExperienceDescription:
      "Earlier roles are grouped here to keep the page readable while preserving the longer arc across enterprise systems, cloud delivery, and full-stack product work.",
    projectsTitle: "Recent Projects",
    activitiesTitle: "Talks, Side Work, Certs",
    activityLabels: {
      talks: "Talks",
      certifications: "Certifications",
      sideProjects: "Side Projects",
      hackathons: "Hackathons",
    },
  },
  footprintPage: {
    eyebrow: "Geographic Footprint",
    title: "Where the work has been done.",
    description:
      "Taiwan is the current base. Earlier work spans Asia-Pacific and remote-first teams across time zones.",
    mapLabel: "World map showing locations",
    locationsLabel: "Locations",
    currentBaseLabel: "Current base",
  },
  settingsPanel: {
    buttonLabel: "Settings",
    themeLabel: "Theme",
    languageLabel: "Language",
  },
  sectionPages: {
    systems: {
      eyebrow: "Systems",
      title: "Architecture notes and platform-level engineering decisions.",
      description: "How interfaces, tooling, and operating constraints shape product teams over time.",
      cardDescription:
        "Architecture decisions, SDK surfaces, and the infrastructure choices that constrain product velocity.",
    },
    work: {
      eyebrow: "Work",
      title: "Case studies framed around engineering judgment, not resume bullets.",
      description: "The emphasis is on constraints, decision quality, and what changed because the system changed.",
      cardDescription:
        "Case-based engineering stories focused on judgment, tradeoffs, and the mechanics behind shipped outcomes.",
    },
    ideas: {
      eyebrow: "Ideas",
      title: "Raw thinking, critiques, and positions still being tested.",
      description: "Useful ideas do not need to wait until they are fully productized or socially polished.",
      cardDescription:
        "Working notes, critiques, and unfinished thinking that is still useful before it becomes doctrine.",
    },
    digests: {
      eyebrow: "Digests",
      title: "Condensed engineering notes shaped through LLM-assisted discussion.",
      description: "Short synthesis posts that preserve model context while keeping the engineering subject in focus.",
      cardDescription:
        "Model-assisted summaries and condensed notes with enough context to understand how the post was shaped.",
    },
  },
};
