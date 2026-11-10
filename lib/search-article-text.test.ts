import { describe, expect, it } from "vitest";
import { getSearchArticleText } from "./search-article-text";

describe("build-time article search text", () => {
  it("keeps prose, headings, inline code and link labels without destinations", () => {
    expect(getSearchArticleText("## Heading\n\nVisible **bold** and `inline` [label](https://hidden.example).\n\n- Item\n\n| Key | Value |\n| --- | --- |\n| A | B |"))
      .toBe("Heading Visible bold and inline label. Item Key Value A B");
  });
  it("excludes executable markup and nested JSX instead of evaluating it", () => {
    const source = 'import Hidden from "hidden-import"\n\nexport const secret = "hidden-export"\n\nVisible {"hidden-expression"} tail.\n\n<Hidden token="hidden-attribute">hidden-child</Hidden>\n\n<script>hidden-script</script>\n\n![hidden-image](https://hidden.example)\n\n```js\nhidden-code\n```\n\n```mermaid\nhidden-diagram\n```';
    const text = getSearchArticleText(source);
    expect(text).toBe("Visible tail.");
    expect(text).not.toContain("hidden");
  });
  it("normalizes Unicode and whitespace but preserves visible punctuation", () => {
    expect(getSearchArticleText("ＡＩ\n\n工程循環 &amp; e\u0301clair" )).toBe("AI 工程循環 & éclair");
    expect(getSearchArticleText("")).toBe("");
    expect(getSearchArticleText("```txt\nonly code\n```" )).toBe("");
  });
});
