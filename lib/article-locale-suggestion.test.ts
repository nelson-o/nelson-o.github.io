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
