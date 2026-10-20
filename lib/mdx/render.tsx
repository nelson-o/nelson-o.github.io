import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React from "react";

import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";

import { getArticleTocCopy } from "@/lib/i18n-article-toc";
import { collectHeadings, type ArticleHeading } from "@/lib/mdx/headings";
import { MermaidBlock } from "@/components/ui/mermaid-block";

type MdxModule = {
  default: React.ComponentType<{ components?: Record<string, React.ComponentType<unknown>> }>;
};

type CodeElementProps = {
  className?: string;
  children?: React.ReactNode;
};

function MdxPre({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const child = React.Children.only(children);

  if (React.isValidElement<CodeElementProps>(child) && child.props.className === "language-mermaid") {
    return <MermaidBlock chart={String(child.props.children ?? "").trim()} />;
  }

  return <pre {...props}>{children}</pre>;
}

function MdxTable({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="mdx-table-scroll">
      <table {...props}>{children}</table>
    </div>
  );
}

export async function renderMdxWithHeadings(source: string, headingLinkLabel = getArticleTocCopy("en").linkToHeading) {
  const headings: ArticleHeading[] = [];
  const mod = (await evaluate(source, {
    Fragment,
    jsx,
    jsxs,
    remarkPlugins: [remarkGfm, collectHeadings(headings)],
  })) as MdxModule;

  const Content = mod.default;

  function heading(level: "h2" | "h3") {
    return function Heading({ id, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
      if (!id) return React.createElement(level, props, children);
      const text = headings.find((item) => item.id === id)?.text ?? "";
      return React.createElement(level, { ...props, id, tabIndex: -1 }, children,
        <a className="mdx-heading-anchor" href={`#${id}`} aria-label={`${headingLinkLabel}: ${text}`}>
          <span aria-hidden="true">#</span>
        </a>);
    };
  }

  function MdxContent() {
    return (
      <Content
        components={{
          h2: heading("h2") as React.ComponentType<unknown>,
          h3: heading("h3") as React.ComponentType<unknown>,
          pre: MdxPre as React.ComponentType<unknown>,
          table: MdxTable as React.ComponentType<unknown>,
        }}
      />
    );
  }
  return { Content: MdxContent, headings };
}

export async function renderMdx(source: string) {
  return (await renderMdxWithHeadings(source)).Content;
}
