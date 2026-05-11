import type { Page } from "@playwright/test";

export const EN = {
  siteTitle: "neℓson",
  homeHeading: "Frontend systems built as platforms, not page collections.",
  localeGatewayHeading: "Choose a reading language.",
  systemsSectionTitle: "Architecture notes and platform-level engineering decisions.",
  profilePageTitle: "Senior-level platform and frontend systems work, presented as operating evidence.",
  primaryNavLabel: "Primary",
  primarySectionsLabel: "Primary sections",
  settingsButtonLabel: "Settings",
  themeLabel: "Theme",
  languageLabel: "Language",
  themeChips: {
    system: "System",
    dark: "Dark",
    light: "Light",
  },
} as const;

export const ZHTW = {
  homeHeading: "把前端系統當成平台來打造，而不是頁面集合",
  settingsButtonLabel: "設定",
  themeLabel: "主題",
  languageLabel: "語言",
  themeChips: {
    system: "系統",
    dark: "深色",
    light: "淺色",
  },
} as const;

// themeStorageKey from lib/theme.ts
export const THEME_STORAGE_KEY = "nelson-theme";

export async function waitForHydration(page: Page) {
  await page.waitForFunction(() =>
    document.documentElement.classList.contains("theme-light") ||
    document.documentElement.classList.contains("theme-dark")
  );
}

/** Open the settings panel — works across all locales (the button is .theme-toggle). */
export function settingsButton(page: Page) {
  return page.locator("button.theme-toggle");
}
