import type { Dictionary } from "@/lib/i18n-types";

export const zhTwDictionary: Dictionary = {
  localeLabel: "繁體中文",
  languageSwitcherLabel: "語言",
  primaryNavigationLabel: "主導覽",
  primarySectionsLabel: "主要章節",
  profileNavigationLabel: "履歷",
  navigation: { systems: "系統", work: "工作", ideas: "觀點", lab: "實驗室" },
  sectionCardKicker: "章節",
  latestWritingEyebrow: "最新文章",
  startWithSystemsLabel: "從系統開始",
  footer: "यथा स्वप्नं माया बुद्बुदं छायायथा विद्युत् एवं द्रष्टव्यं संस्कृतम्",
  footerCandidates: [
    "由 GitHub Pages 驅動",
    "以 Codex · GPT-5.5 構建",
    "由 Claude Code · Sonnet 4.6 強化",
    "一切有為法，如夢幻泡影，如露亦如電，應作如是觀",
  ],
  articleMetaSeparator: "•",
  articleSectionLabels: { systems: "系統", work: "工作", ideas: "觀點", lab: "實驗室" },
  themeToggleLabel: "切換色彩主題",
  themeToggleToDark: "深色",
  themeToggleToLight: "淺色",
  themeToggleToSystem: "系統",
  site: {
    title: "Nelson Lin",
    tagline: "ἓν οἶδα ὅτι οὐδὲν οἶδα",
    description: "一個累積系統、工作、觀點與實驗的工程知識介面",
  },
  home: {
    eyebrow: "工程知識介面",
    title: "把前端系統當成平台來打造，而不是頁面集合",
    description:
      "我用這個網站累積系統設計決策、交付模式，以及 WebSDK、CI 與 Agent 工程迴圈背後的工作思路。",
    focusAreas: ["WebSDK", "CI 系統", "Agent 工作流"],
    latestWritingTitle: "橫跨系統、工作、觀點與實驗室的最新文章",
    latestWritingDescription:
      "第一版刻意保持精簡：只保留足以驗證內容模型與部署路徑的必要表面。",
  },
  profilePage: {
    eyebrow: "自 2010 持續構建",
    title: "以工程操作證據呈現的平台與前端系統工作",
    description:
      "整理 Nelson Lin 近期的角色、平台能力與精選 AI / 平台專案，供重視技術判斷的讀者參考。",
    contactTitle: "聯絡資訊",
    capabilitiesTitle: "核心能力",
    selectedExperienceTitle: "跨越 AI 浪潮的交付紀錄",
    priorExperienceTitle: "更早期的軟體開發角色",
    priorExperienceDescription:
      "較早期的角色在此集中呈現，保留完整脈絡，同時讓頁面維持適合快速掃讀的密度。",
    projectsTitle: "精選 AI / 平台專案",
    activitiesTitle: "演講、認證與個人專案",
    activityLabels: {
      talks: "演講",
      certifications: "認證",
      sideProjects: "個人專案",
      hackathons: "黑客松",
    },
  },
  settingsPanel: {
    buttonLabel: "設定",
    themeLabel: "主題",
    languageLabel: "語言",
  },
  sectionPages: {
    systems: {
      eyebrow: "系統",
      title: "架構筆記與平台層級的工程決策",
      description: "介面、工具鏈與操作限制如何長期塑造產品團隊。",
      cardDescription: "架構決策、SDK 介面，以及限制產品速度的基礎設施選擇。",
    },
    work: {
      eyebrow: "工作",
      title: "以工程判斷為主軸的案例，而非履歷條列",
      description: "重點放在限制條件、決策品質，以及系統改變後真正改變了什麼。",
      cardDescription: "聚焦判斷、取捨與已交付成果背後機制的工程案例。",
    },
    ideas: {
      eyebrow: "觀點",
      title: "仍在驗證中的原始思考、批判與立場",
      description: "有價值的觀點不必等到完全成形才值得記錄。",
      cardDescription: "尚未定稿但已具參考價值的工作筆記、批判與觀點。",
    },
    lab: {
      eyebrow: "實驗室",
      title: "測試未來系統方向的實驗、探針與小型構建",
      description: "在正式依賴之前，先讓構想通過實際驗證。",
      cardDescription: "能夠磨利未來系統工作的實驗、原型與技術探針。",
    },
  },
};
