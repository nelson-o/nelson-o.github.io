import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { animatedProfileTagline, localizedProfileAsset } from "./profile-2026-assets";
import { locales } from "./i18n-types";
import { profileOnlyLocales } from "./profile-locales";

describe("2026 asset references", () => {
  it.each(locales)("resolves existing localized artwork for %s", (locale) => {
    for (const section of ["hero", "contact"] as const) {
      const asset = localizedProfileAsset(section, locale)!;
      expect(existsSync(path.join(process.cwd(), "public", asset))).toBe(true);
      expect(asset).not.toContain(".jp.");
    }
  });

  it.each(locales)("resolves an existing tagline animation for %s when one ships", (locale) => {
    const animation = animatedProfileTagline(locale);
    if (locale === "ja") {
      expect(animation).toBeNull();
      return;
    }
    expect(animation).toBe(`/profile/2026/hero/tagline.${locale === "en" ? "en" : "zh"}.webm`);
    expect(existsSync(path.join(process.cwd(), "public", animation!))).toBe(true);
  });

  it.each(profileOnlyLocales)("uses its own rendered handwriting, without animation, for %s", (locale) => {
    expect(localizedProfileAsset("hero", locale)).toBe(`/profile/2026/hero/tagline.${locale}.webp`);
    expect(localizedProfileAsset("contact", locale)).toBe(`/profile/2026/contact/signature.${locale}.webp`);
    for (const section of ["hero", "contact"] as const) {
      expect(existsSync(path.join(process.cwd(), "public", localizedProfileAsset(section, locale)!))).toBe(true);
    }
    expect(animatedProfileTagline(locale)).toBeNull();
  });

  it("keeps paired theme assets available for exported CSS and hero markup", () => {
    for (const theme of ["light", "dark"]) {
      for (const asset of ["hero/portrait", "approach/mountains", "projects/waves", "projects/developer-tools", "projects/signals"]) {
        expect(existsSync(`public/profile/2026/${asset}.${theme}.webp`)).toBe(true);
      }
    }
    for (const section of ["approach", "projects"]) {
      const css = readFileSync(`components/layout/profile-2026/${section}.module.css`, "utf8");
      for (const match of css.matchAll(/url\(['"]?(\/profile\/2026\/[^)'"\s]+)/g)) {
        expect(existsSync(path.join("public", match[1]))).toBe(true);
      }
    }
  });

  // docs/profile-2026-assets.md (#103): handwriting keeps the runtime ink filter, illustrations are asset-time.
  it("keeps handwritten artwork on the runtime light-theme ink filter", () => {
    for (const section of ["hero", "contact"]) {
      expect(readdirSync(`public/profile/2026/${section}`).filter((file) => /^(tagline|signature)\..*\.light\./.test(file))).toEqual([]);
    }
    for (const cssModule of ["hero", "hero-tagline", "contact"]) {
      expect(readFileSync(`components/layout/profile-2026/${cssModule}.module.css`, "utf8")).toMatch(/invert\(1\) hue-rotate\(180deg\)/);
    }
  });
});
