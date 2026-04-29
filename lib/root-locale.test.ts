import { describe, expect, it } from "vitest";

import { getBestRootLocale } from "@/lib/root-locale";

describe("getBestRootLocale", () => {
  it("falls back to English when browser languages do not match a supported locale", () => {
    expect(getBestRootLocale(["ja-JP", "fr-FR"])).toBe("en");
  });

  it("matches English regional browser locales to English", () => {
    expect(getBestRootLocale(["en-US"])).toBe("en");
  });

  it("matches Traditional Chinese browser locales to zh-tw", () => {
    expect(getBestRootLocale(["zh-Hant-TW"])).toBe("zh-tw");
    expect(getBestRootLocale(["zh_TW"])).toBe("zh-tw");
  });
});
