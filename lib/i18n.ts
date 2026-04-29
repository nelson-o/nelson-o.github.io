import { defaultLocale, locales, sections, type Locale, type Section } from "@/lib/i18n-types";
import { enDictionary } from "@/lib/i18n-en";
import { zhTwDictionary } from "@/lib/i18n-zh-tw";

export type { Dictionary, Locale, Section } from "@/lib/i18n-types";
export { defaultLocale, locales, sections } from "@/lib/i18n-types";

const dictionaries: Record<Locale, typeof enDictionary> = {
  en: enDictionary,
  "zh-tw": zhTwDictionary,
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
