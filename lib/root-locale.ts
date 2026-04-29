import { defaultLocale, locales, type Locale } from "@/lib/i18n-types";

function normalizeLanguage(value: string) {
  return value.toLowerCase().replace(/_/g, "-");
}

function isSupportedLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

function getLocaleMatch(language: string): Locale | null {
  const normalized = normalizeLanguage(language);

  if (isSupportedLocale(normalized)) {
    return normalized;
  }

  if (
    normalized === "zh-hant" ||
    normalized.startsWith("zh-hant-") ||
    normalized === "zh-tw" ||
    normalized.startsWith("zh-tw-")
  ) {
    return "zh-tw";
  }

  const baseLanguage = normalized.split("-")[0];

  return isSupportedLocale(baseLanguage) ? baseLanguage : null;
}

export function getBestRootLocale(browserLanguages: readonly string[]): Locale {
  for (const language of browserLanguages) {
    const match = getLocaleMatch(language);

    if (match) {
      return match;
    }
  }

  return defaultLocale;
}
