import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { renderMdx } from "@/lib/mdx/render";

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
