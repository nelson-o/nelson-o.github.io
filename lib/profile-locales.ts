import { defaultLocale, getLocaleHrefLang, isLocale, locales, type Locale } from "@/lib/i18n";
import type { ProfileVersion } from "@/lib/profile-versions";

// Languages that exist only for the 2026 profile. The rest of the site, and
// the 2025 edition, stay limited to the site locales.
export const profileOnlyLocales = ["ko", "th", "vi", "de"] as const;
export const profileLocales = [...locales, ...profileOnlyLocales] as const;

export type ProfileLocale = (typeof profileLocales)[number];
export type ProfileOnlyLocale = (typeof profileOnlyLocales)[number];

export const profileLanguageNames: Record<ProfileLocale, string> = {
  en: "English", "zh-tw": "繁體中文", "zh-cn": "简体中文", ja: "日本語",
  ko: "한국어", th: "ไทย", vi: "Tiếng Việt", de: "Deutsch",
};

export function isProfileLocale(value: string): value is ProfileLocale {
  return profileLocales.includes(value as ProfileLocale);
}

export function getProfileLocales(version: ProfileVersion): readonly ProfileLocale[] {
  return version === "2026" ? profileLocales : locales;
}

export function hasProfileEdition(locale: string, version: ProfileVersion) {
  return (getProfileLocales(version) as readonly string[]).includes(locale);
}

// Profile-only languages link to the English site because it has no translation.
export function getProfileSiteLocale(locale: ProfileLocale): Locale {
  return isLocale(locale) ? locale : defaultLocale;
}

export function getProfileHrefLang(locale: ProfileLocale) {
  return isLocale(locale) ? getLocaleHrefLang(locale) : locale;
}

export function getProfileContentLang(locale: ProfileLocale) {
  if (locale === "zh-tw") return "zh-Hant";
  if (locale === "zh-cn") return "zh-Hans";
  return locale;
}
