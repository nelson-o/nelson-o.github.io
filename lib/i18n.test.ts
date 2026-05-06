import { describe, expect, it } from "vitest";

import {
  defaultLocale,
  getDictionary,
  getHrefWithLocale,
  getMetadataBaseUrl,
  getTopicSocialPreviewImageUrl,
  getTopicSocialPreviewImages,
  getSocialPreviewImageUrl,
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
    expect(getDictionary("zh-tw").home.focusAreas).toContain("Agent 工作流");
    expect(getDictionary("en").profileNavigationLabel).toBe("Profile");
    expect(getDictionary("en").profilePage.eyebrow.length).toBeGreaterThan(0);
    expect(getDictionary("zh-tw").profilePage.eyebrow.length).toBeGreaterThan(0);
  });

  it("returns a metadata base url for canonical generation", () => {
    expect(getMetadataBaseUrl().toString()).toBe("https://nelson-o.github.io/");
  });

  it("returns the shared social preview image path", () => {
    expect(getSocialPreviewImageUrl()).toBe("/og/default.png");
  });

  it("returns topic social preview image paths", () => {
    expect(getTopicSocialPreviewImageUrl("ideas")).toBe("/og/ideas.png");
    expect(getTopicSocialPreviewImageUrl("systems")).toBe("/og/systems.png");
    expect(getTopicSocialPreviewImageUrl("lab")).toBe("/og/lab.png");
    expect(getTopicSocialPreviewImageUrl("work")).toBe("/og/work.png");
    expect(getTopicSocialPreviewImageUrl("ideas", "260505-compute-power-to-productivity")).toBe(
      "/og/ideas1.png",
    );
    expect(getTopicSocialPreviewImageUrl("ideas", "260506-codex-goal-primitive-shift")).toBe(
      "/og/ideas2.png",
    );
    expect(getTopicSocialPreviewImages("ideas")).toEqual(["/og/ideas1.png", "/og/ideas2.png"]);
  });
});
