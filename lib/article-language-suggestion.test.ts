import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ArticleLanguageSuggestionContent } from "@/components/ui/article-language-suggestion";

describe("ArticleLanguageSuggestionContent", () => {
  it("renders the full prompt in the suggested Traditional Chinese locale", () => {
    const markup = renderToStaticMarkup(
      React.createElement(ArticleLanguageSuggestionContent, {
        suggestedLocale: "zh-tw",
        section: "ideas",
        slug: "260505-compute-power-to-productivity",
        onDismiss: () => undefined,
      }),
    );

    expect(markup).toContain('aria-label="語言建議"');
    expect(markup).toContain("這篇文章也提供繁體中文版本。");
    expect(markup).toContain("閱讀繁體中文");
    expect(markup).toContain("關閉");
    expect(markup).not.toContain("This article is also available");
    expect(markup).not.toContain(">Dismiss<");
  });

  it("renders the full prompt in the suggested English locale", () => {
    const markup = renderToStaticMarkup(
      React.createElement(ArticleLanguageSuggestionContent, {
        suggestedLocale: "en",
        section: "ideas",
        slug: "260505-compute-power-to-productivity",
        onDismiss: () => undefined,
      }),
    );

    expect(markup).toContain('aria-label="Language suggestion"');
    expect(markup).toContain("This article is also available in English.");
    expect(markup).toContain("Read in English");
    expect(markup).toContain("Dismiss");
    expect(markup).not.toContain("這篇文章也提供");
    expect(markup).not.toContain("關閉");
  });
});
