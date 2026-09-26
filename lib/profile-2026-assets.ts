import type { ProfileLocale } from "./profile-locales";

// Both Chinese locales intentionally share the supplied handwritten artwork.
// Profile-only languages use artwork rendered by `bun run assets:handwriting`.
// A locale mapped to null renders live text instead.
const artworkLanguage: Record<ProfileLocale, "en" | "zh" | "ja" | "ko" | "th" | "vi" | "de" | null> = {
  en: "en", "zh-tw": "zh", "zh-cn": "zh", ja: "ja", ko: "ko", th: "th", vi: "vi", de: "de",
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

// Employer marks beside the experience timeline, keyed by company name, with
// intrinsic pixel sizes. Sources are recorded in docs/profile-2026-assets.md.
// An employer with no verifiable official mark is absent and renders as text.
export type EmployerMark = { src: string; width: number; height: number };

export const employerMarks: Record<string, EmployerMark> = {
  "momoshop.tw": { src: "/profile/2026/brands/momo.png", width: 2000, height: 388 },
  "SWAG.live": { src: "/profile/2026/brands/swag.svg", width: 64, height: 64 },
  foodpanda: { src: "/profile/2026/brands/foodpanda.png", width: 457, height: 294 },
  ViewSonic: { src: "/profile/2026/brands/viewsonic.png", width: 360, height: 159 },
  "Ampos HRM": { src: "/profile/2026/brands/ampos.svg", width: 109, height: 55 },
  "Lilee Systems": { src: "/profile/2026/brands/lilee.svg", width: 180, height: 81 },
  Owlstand: { src: "/profile/2026/brands/owlstand.png", width: 346, height: 402 },
  "Elan Microelectronics": { src: "/profile/2026/brands/elan.png", width: 187, height: 128 },
};

// Marks range from a square badge to 6:1 wordmarks. Fitting them all to one box
// makes wide marks look small and compact ones loud, so each is sized to about
// the same visual area, then contained in the box. Values are CSS pixels.
export const markBox = { width: 88, height: 36, area: 1500 };

export function markDisplaySize({ width, height }: Pick<EmployerMark, "width" | "height">) {
  const ratio = width / height;
  let w = Math.min(markBox.width, Math.sqrt(markBox.area * ratio));
  let h = w / ratio;
  if (h > markBox.height) [h, w] = [markBox.height, markBox.height * ratio];
  return { width: Math.round(w), height: Math.round(h) };
}
