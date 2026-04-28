import { describe, expect, it } from "vitest";

import {
  defaultLocale,
  getDictionary,
  getHrefWithLocale,
  getMetadataBaseUrl,
  isLocale,
  normalizeLocaleParam,
} from "@/lib/i18n";

describe("i18n helpers", () => {
  it("normalizes locale params to supported route locales", () => {
    expect(normalizeLocaleParam("en")).toBe("en");
    expect(normalizeLocaleParam("zh-TW")).toBe("zh-tw");
    expect(normalizeLocaleParam("ZH_tw")).toBe("zh-tw");
    expect(normalizeLocaleParam(undefined)).toBe(defaultLocale);
  });

  it("recognizes supported locales only", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("zh-tw")).toBe(true);
    expect(isLocale("ja")).toBe(false);
  });

  it("builds locale-prefixed internal hrefs", () => {
    expect(getHrefWithLocale("en", "/")).toBe("/en");
    expect(getHrefWithLocale("zh-tw", "/systems/platform-surfaces")).toBe(
      "/zh-tw/systems/platform-surfaces",
    );
  });

  it("returns localized dictionary content", () => {
    expect(getDictionary("en").navigation.systems).toBe("Systems");
    expect(getDictionary("zh-tw").navigation.systems).toBe("系統");
    expect(getDictionary("zh-tw").home.focusAreas).toContain("代理工作流程");
    expect(getDictionary("en").profileNavigationLabel).toBe("Profile");
  });

  it("returns a metadata base url for canonical generation", () => {
    expect(getMetadataBaseUrl().toString()).toBe("https://nelson-o.github.io/");
  });
});
