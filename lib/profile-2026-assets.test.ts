import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { localizedProfileAsset } from "./profile-2026-assets";
import { locales } from "./i18n-types";

describe("2026 asset references", () => {
  it.each(locales)("resolves existing localized artwork for %s", (locale) => {
    for (const section of ["hero", "contact"] as const) {
      const asset = localizedProfileAsset(section, locale);
      expect(existsSync(path.join(process.cwd(), "public", asset))).toBe(true);
      expect(asset).not.toContain(".jp.");
    }
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
});
