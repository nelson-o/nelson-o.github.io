import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { renderMdx, renderMdxWithHeadings } from "@/lib/mdx/render";

describe("renderMdx", () => {
  it("routes mermaid code fences through the mermaid renderer", async () => {
    const Content = await renderMdx(`\`\`\`mermaid
flowchart TD
  A["Spec Draft"] --> B["Human Review"]
\`\`\``);

    const markup = renderToStaticMarkup(React.createElement(Content));

    expect(markup).toContain('data-mermaid-chart="true"');
    expect(markup).toContain("flowchart TD");
  });

  it("keeps non-mermaid code fences as code blocks", async () => {
    const Content = await renderMdx(`\`\`\`ts
const answer = 42;
\`\`\``);

    const markup = renderToStaticMarkup(React.createElement(Content));

    expect(markup).toContain("<pre>");
    expect(markup).toContain('class="language-ts"');
    expect(markup).toContain("const answer = 42;");
    expect(markup).not.toContain('data-mermaid-chart="true"');
  });

  it("wraps markdown tables for article overflow styling", async () => {
    const Content = await renderMdx(`| Header | Value |
| --- | --- |
| Alpha | Beta |`);

    const markup = renderToStaticMarkup(React.createElement(Content));

    expect(markup).toContain('<div class="mdx-table-scroll"><table>');
    expect(markup).toContain("<thead>");
    expect(markup).toContain("<tbody>");
  });
});


describe("article heading anchors", () => {
  it("uses one ordered source for formatted, linked and CJK heading text", async () => {
    const { Content, headings } = await renderMdxWithHeadings(
      "## Build **systems** with `code` and [links](/en/)\n\n### 交付與 CI：実践\n\n## Café & delivery!",
      "連結至章節",
    );
    expect(headings).toEqual([
      { id: "article-build-systems-with-code-and-links", text: "Build systems with code and links", depth: 2 },
      { id: "article-交付與-ci実践", text: "交付與 CI：実践", depth: 3 },
      { id: "article-café-delivery", text: "Café & delivery!", depth: 2 },
    ]);
    const markup = renderToStaticMarkup(React.createElement(Content));
    for (const { id } of headings) expect(markup).toContain(`id="${id}" tabindex="-1"`);
    expect(markup).toContain('aria-label="連結至章節: 交付與 CI：実践"');
    expect(markup).toContain('<a href="/en/">links</a>');
    expect(markup).not.toContain('<a href="#article-build-systems-with-code-and-links"><a');
  });

  it("makes duplicate and empty slugs unique without colliding with suffix titles", async () => {
    const source = "## Repeat\n\n## Repeat\n\n### Repeat-2\n\n## !!!\n\n## ???";
    const { headings } = await renderMdxWithHeadings(source);
    expect(headings.map(({ id }) => id)).toEqual([
      "article-repeat", "article-repeat-2", "article-repeat-2-2", "article-section", "article-section-2",
    ]);
    expect((await renderMdxWithHeadings(source)).headings).toEqual(headings);
  });

  it("ignores code-fence headings and excludes h1 and h4 from the TOC", async () => {
    const { headings } = await renderMdxWithHeadings("# Title\n\n## Section\n\n#### Detail\n\n```md\n## Example\n``` ");
    expect(headings.map(({ text }) => text)).toEqual(["Section"]);
  });
});
