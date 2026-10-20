export type ArticleHeading = { id: string; text: string; depth: 2 | 3 };

type MarkdownNode = {
  type: string;
  depth?: number;
  value?: string;
  alt?: string;
  children?: MarkdownNode[];
  data?: { hProperties?: Record<string, unknown> };
};

function headingText(node: MarkdownNode): string {
  if (node.type === "text" || node.type === "inlineCode") return node.value ?? "";
  if (node.type === "image") return node.alt ?? "";
  return (node.children ?? []).map(headingText).join("");
}

// Collect from the same syntax tree that MDX renders, so code fences, inline
// formatting and CJK titles cannot drift between the TOC and its destinations.
export function collectHeadings(headings: ArticleHeading[]) {
  return () => (tree: MarkdownNode) => {
    const used = new Set<string>();
    function visit(node: MarkdownNode) {
      if (node.type === "heading" && (node.depth === 2 || node.depth === 3)) {
        const text = headingText(node).trim().replace(/\s+/g, " ");
        const slug = text.normalize("NFKC").toLowerCase()
          .replace(/[^\p{L}\p{N}\p{M}\s-]/gu, "").trim().replace(/\s+/g, "-");
        const base = `article-${slug || "section"}`;
        let id = base;
        let suffix = 2;
        while (used.has(id)) id = `${base}-${suffix++}`;
        used.add(id);
        node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } };
        headings.push({ id, text: text || "§", depth: node.depth });
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
