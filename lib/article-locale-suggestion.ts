import { locales, type Locale } from "@/lib/i18n-types";

type SuggestedArticleLocaleOptions = {
  currentLocale: Locale;
  availableLocales: readonly Locale[];
  browserLanguages: readonly string[];
  dismissed: boolean;
};

function normalizeLanguage(value: string) {
  return value.toLowerCase().replace(/_/g, "-");
}

function getLocaleMatch(language: string): Locale | null {
  const normalized = normalizeLanguage(language);

  if (locales.includes(normalized as Locale)) {
    return normalized as Locale;
  }

  if (
    normalized === "zh-hant" ||
    normalized.startsWith("zh-hant-") ||
    normalized === "zh-tw" ||
    normalized.startsWith("zh-tw-")
  ) {
    return "zh-tw";
  }

  return normalized.split("-")[0] === "en" ? "en" : null;
}

export function getPreferredSupportedLocale(browserLanguages: readonly string[]) {
  for (const language of browserLanguages) {
    const match = getLocaleMatch(language);

    if (match) {
      return match;
    }
  }

  return null;
}

export function languageSuggestionStorageKey(currentLocale: Locale, suggestedLocale: Locale) {
  return `nelson-language-suggestion:${currentLocale}:${suggestedLocale}`;
}

export function getSuggestedArticleLocale({
  currentLocale,
  availableLocales,
  browserLanguages,
  dismissed,
}: SuggestedArticleLocaleOptions) {
  if (dismissed) {
    return null;
  }

  const preferredLocale = getPreferredSupportedLocale(browserLanguages);

  if (!preferredLocale || preferredLocale === currentLocale) {
    return null;
  }

  return availableLocales.includes(preferredLocale) ? preferredLocale : null;
}
