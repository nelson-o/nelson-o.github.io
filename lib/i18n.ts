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

const dictionaries: Record<Locale, Dictionary> = {
  en: {
    localeLabel: "English",
    languageSwitcherLabel: "Language",
    primaryNavigationLabel: "Primary",
    primarySectionsLabel: "Primary sections",
    navigation: {
      systems: "Systems",
      work: "Work",
      ideas: "Ideas",
      lab: "Lab",
    },
    sectionCardKicker: "Section",
    latestWritingEyebrow: "Latest Writing",
    startWithSystemsLabel: "Start with systems",
    footer: "Built with static export for GitHub Pages. Writing-first, infra-light, meant to accumulate.",
    articleMetaSeparator: "•",
    articleSectionLabels: {
      systems: "Systems",
      work: "Work",
      ideas: "Ideas",
      lab: "Lab",
    },
    themeToggleLabel: "Toggle color theme",
    themeToggleToDark: "Switch to dark mode",
    themeToggleToLight: "Switch to light mode",
    site: {
      title: "Nelson Lin",
      tagline: "Frontend systems, platform thinking, and the operating decisions behind engineering work.",
      description: "An engineering knowledge surface for systems, work, ideas, and experiments.",
    },
    home: {
      eyebrow: "Engineering Knowledge Surface",
      title: "Frontend systems built as platforms, not page collections.",
      description:
        "I use this site to accumulate system design decisions, delivery patterns, and the working ideas behind WebSDKs, CI, and agent-driven engineering loops.",
      focusAreas: ["WebSDK", "CI Systems", "Agent Workflows"],
      latestWritingTitle: "Recent entries across systems, work, ideas, and lab.",
      latestWritingDescription:
        "The first version stays small on purpose: enough surface area to prove the content model and the deployment path.",
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
        description:
          "The emphasis is on constraints, decision quality, and what changed because the system changed.",
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
      lab: {
        eyebrow: "Lab",
        title: "Experiments, probes, and small builds that test future system directions.",
        description: "A proving ground for ideas that should be exercised before they are relied on.",
        cardDescription:
          "Experiments, prototypes, and technical probes that sharpen future systems work.",
      },
    },
  },
  "zh-tw": {
    localeLabel: "繁體中文",
    languageSwitcherLabel: "語言",
    primaryNavigationLabel: "主導覽",
    primarySectionsLabel: "主要欄目",
    navigation: {
      systems: "系統",
      work: "工作",
      ideas: "想法",
      lab: "實驗",
    },
    sectionCardKicker: "欄目",
    latestWritingEyebrow: "最新文章",
    startWithSystemsLabel: "先看系統",
    footer: "以 GitHub Pages 靜態匯出部署。以寫作為先，基礎設施保持輕量，持續累積工程判斷。",
    articleMetaSeparator: "•",
    articleSectionLabels: {
      systems: "系統",
      work: "工作",
      ideas: "想法",
      lab: "實驗",
    },
    themeToggleLabel: "切換色彩主題",
    themeToggleToDark: "切換到深色模式",
    themeToggleToLight: "切換到淺色模式",
    site: {
      title: "Nelson Lin",
      tagline: "前端系統、平台思維，以及工程交付背後的操作決策。",
      description: "一個累積系統、工作、想法與實驗的工程知識介面。",
    },
    home: {
      eyebrow: "工程知識介面",
      title: "把前端系統當成平台來打造，而不是頁面集合。",
      description: "我用這個網站整理系統設計決策、交付模式，以及 WebSDK、CI 與代理工程迴圈背後的工作想法。",
      focusAreas: ["WebSDK", "CI 系統", "代理工作流程"],
      latestWritingTitle: "來自系統、工作、想法與實驗的最新文章。",
      latestWritingDescription: "第一版刻意保持精簡：只保留足以驗證內容模型與部署路徑的必要表面。",
    },
    sectionPages: {
      systems: {
        eyebrow: "系統",
        title: "架構筆記與平台層級的工程決策。",
        description: "介面、工具鏈與操作限制如何長期塑造產品團隊。",
        cardDescription: "關於架構決策、SDK 介面與限制產品速度的基礎設施選擇。",
      },
      work: {
        eyebrow: "工作",
        title: "以工程判斷為主軸的案例，而不是履歷條列。",
        description: "重點放在限制條件、決策品質，以及系統改變後真正改變了什麼。",
        cardDescription: "聚焦判斷、取捨與已交付成果背後機制的工程案例。",
      },
      ideas: {
        eyebrow: "想法",
        title: "仍在驗證中的原始思考、批評與立場。",
        description: "有價值的想法不必等到產品化或社交潤飾完成才值得分享。",
        cardDescription: "仍未定稿但已經有用的工作筆記、批判與想法。",
      },
      lab: {
        eyebrow: "實驗",
        title: "測試未來系統方向的實驗、探針與小型建造。",
        description: "在真正依賴之前，先把想法放進驗證場。",
        cardDescription: "能夠磨利未來系統工作的實驗、原型與技術探針。",
      },
    },
  },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function isSection(value: string): value is Section {
  return sections.includes(value as Section);
}

export function normalizeLocaleParam(value?: string) {
  if (!value) {
    return defaultLocale;
  }

  const normalized = value.toLowerCase().replace(/_/g, "-");

  return isLocale(normalized) ? normalized : defaultLocale;
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function getHrefWithLocale(locale: Locale, href: `/${string}` | "/") {
  if (href === "/") {
    return `/${locale}`;
  }

  return `/${locale}${href}`;
}

export function getMetadataBaseUrl() {
  return new URL("https://nelson-o.github.io/");
}

export function getStaticLocaleParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

export function getLocaleHrefLang(locale: Locale) {
  return locale === "zh-tw" ? "zh-TW" : locale;
}

export function getAlternates(
  locale: Locale,
  href: `/${string}` | "/",
  availableLocales: readonly Locale[] = locales,
) {
  return {
    canonical: getHrefWithLocale(locale, href),
    languages: Object.fromEntries(
      [
        ...availableLocales.map((item) => [getLocaleHrefLang(item), getHrefWithLocale(item, href)]),
        ["x-default", getHrefWithLocale(defaultLocale, href)],
      ],
    ),
  };
}
