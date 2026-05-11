import { defaultLocale, locales, sections, type Locale, type Section } from "@/lib/i18n-types";
import { enDictionary } from "@/lib/i18n-en";
import { zhTwDictionary } from "@/lib/i18n-zh-tw";
import { zhCnDictionary } from "@/lib/i18n-zh-cn";
import { jaDictionary } from "@/lib/i18n-ja";

export type { Dictionary, Locale, Section } from "@/lib/i18n-types";
export { defaultLocale, locales, sections } from "@/lib/i18n-types";

const dictionaries: Record<Locale, typeof enDictionary> = {
  en: enDictionary,
  "zh-tw": zhTwDictionary,
  "zh-cn": zhCnDictionary,
  ja: jaDictionary,
};

const topicSocialPreviewImages: Record<Section, readonly string[]> = {
  systems: ["/og/systems1.png", "/og/systems2.png"],
  ideas: ["/og/ideas1.png", "/og/ideas2.png"],
  digests: ["/og/digests1.png", "/og/digests2.png"],
  work: ["/og/work1.png", "/og/work2.png"],
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

export function getSocialPreviewImageUrl() {
  return "/og/default.png";
}

function hashSeed(seed: string) {
  let hash = 2166136261;

  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function getTopicSocialPreviewImages(section: Section) {
  return topicSocialPreviewImages[section];
}

export function getTopicSocialPreviewImageUrl(section: Section, seed?: string) {
  const images = topicSocialPreviewImages[section];

  if (!seed) {
    return `/og/${section}.png`;
  }

  const index = hashSeed(`${section}:${seed}`) % images.length;

  return images[index];
}

export function getStaticLocaleParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

export function getLocaleHrefLang(locale: Locale) {
  if (locale === "zh-tw") return "zh-TW";
  if (locale === "zh-cn") return "zh-CN";
  if (locale === "ja") return "ja";
  return locale;
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
