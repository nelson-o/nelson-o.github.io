import { describe, expect, it } from "vitest";

import {
  getSuggestedArticleLocale,
  languageSuggestionStorageKey,
} from "@/lib/article-locale-suggestion";

describe("getSuggestedArticleLocale", () => {
  it("suggests the preferred translated article when browser language differs", () => {
    expect(
      getSuggestedArticleLocale({
        currentLocale: "en",
        availableLocales: ["en", "zh-tw"],
        browserLanguages: ["zh-Hant-TW", "en-US"],
        dismissed: false,
      }),
    ).toBe("zh-tw");
  });

  it.each([
    ["ja-JP", "ja"],
    ["JA_jp", "ja"],
    ["zh-Hans", "zh-cn"],
    ["zh-Hans-CN", "zh-cn"],
    ["zh_CN", "zh-cn"],
    ["zh-CN-x-private", "zh-cn"],
  ] as const)("suggests %s before the fallback English preference", (language, expected) => {
    expect(getSuggestedArticleLocale({
      currentLocale: "en",
      availableLocales: ["en", "ja", "zh-cn"],
      browserLanguages: [language, "en-US"],
      dismissed: false,
    })).toBe(expected);
  });

  it("does not infer an English preference from unsupported languages", () => {
    expect(getSuggestedArticleLocale({
      currentLocale: "ja",
      availableLocales: ["en", "ja"],
      browserLanguages: ["fr-FR"],
      dismissed: false,
    })).toBeNull();
  });

  it("does not suggest the regional preference on its matching article", () => {
    expect(getSuggestedArticleLocale({
      currentLocale: "ja",
      availableLocales: ["en", "ja"],
      browserLanguages: ["ja-JP", "en-US"],
      dismissed: false,
    })).toBeNull();
  });

  it("does not suggest missing translated articles", () => {
    expect(
      getSuggestedArticleLocale({
        currentLocale: "en",
        availableLocales: ["en"],
        browserLanguages: ["zh-TW"],
        dismissed: false,
      }),
    ).toBeNull();
  });

  it("does not suggest after the prompt has been dismissed", () => {
    expect(
      getSuggestedArticleLocale({
        currentLocale: "en",
        availableLocales: ["en", "zh-tw"],
        browserLanguages: ["zh-TW"],
        dismissed: true,
      }),
    ).toBeNull();
  });

  it("uses a stable storage key for the route locale and preferred locale pair", () => {
    expect(languageSuggestionStorageKey("en", "zh-tw")).toBe(
      "nelson-language-suggestion:en:zh-tw",
    );
  });
});
