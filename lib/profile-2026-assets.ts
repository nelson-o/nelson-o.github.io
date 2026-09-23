import type { ProfileLocale } from "./profile-locales";

// Both Chinese locales intentionally share the supplied handwritten artwork.
// Profile-only languages have no handwritten artwork and render live text instead.
const artworkLanguage: Record<ProfileLocale, "en" | "zh" | "ja" | null> = {
  en: "en", "zh-tw": "zh", "zh-cn": "zh", ja: "ja", ko: null, th: null, vi: null, de: null,
};

export function localizedProfileAsset(section: "hero" | "contact", locale: ProfileLocale): string | null {
  const name = section === "hero" ? "tagline" : "signature";
  const language = artworkLanguage[locale];
  return language && `/profile/2026/${section}/${name}.${language}.webp`;
}

// Locales whose handwritten tagline also ships as a stroke-reveal animation.
const animatedTaglines = new Set(["en", "zh"]);

export function animatedProfileTagline(locale: ProfileLocale): string | null {
  const language = artworkLanguage[locale];
  return language && animatedTaglines.has(language) ? `/profile/2026/hero/tagline.${language}.webm` : null;
}
