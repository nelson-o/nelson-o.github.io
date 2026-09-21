import type { Locale } from "./i18n-types";

// Both Chinese locales intentionally share the supplied handwritten artwork.
const artworkLanguage: Record<Locale, "en" | "zh" | "ja"> = {
  en: "en", "zh-tw": "zh", "zh-cn": "zh", ja: "ja",
};

export function localizedProfileAsset(section: "hero" | "contact", locale: Locale): string {
  const name = section === "hero" ? "tagline" : "signature";
  return `/profile/2026/${section}/${name}.${artworkLanguage[locale]}.webp`;
}
