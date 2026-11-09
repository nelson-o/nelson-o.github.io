import { createProcessor } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";

type Node = { type: string; value?: string; children?: Node[] };
const processor = createProcessor({ remarkPlugins: [remarkGfm] });
const containers = new Set(["root", "paragraph", "heading", "blockquote", "list", "listItem", "table", "tableRow", "tableCell", "emphasis", "strong", "delete", "link", "linkReference"]);
const inline = new Set(["paragraph", "heading", "emphasis", "strong", "delete", "link", "linkReference"]);

// Parse only: never evaluate MDX. Unknown/executable nodes and their children
// are excluded, including JSX, expressions, ESM, HTML, images and code fences.
export function getSearchArticleText(source: string) {
  function text(node: Node): string {
    if (node.type === "text" || node.type === "inlineCode") return node.value ?? "";
    if (node.type === "break") return " ";
    if (!containers.has(node.type)) return " ";
    return (node.children ?? []).map(text).join(inline.has(node.type) ? "" : " ");
  }
  return text(processor.parse(source)).normalize("NFKC").replace(/\s+/gu, " ").trim();
}
