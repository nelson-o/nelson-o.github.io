import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React from "react";

import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";

import { getArticleTocCopy } from "@/lib/i18n-article-toc";
import { collectHeadings, type ArticleHeading } from "@/lib/mdx/headings";
import { MermaidBlock } from "@/components/ui/mermaid-block";
import { CodeBlock } from "@/components/ui/code-block";
import { getArticleTableLabel } from "@/lib/i18n-article-table";
import { getCodeBlockCopy } from "@/lib/i18n-code-block";
import type { Locale } from "@/lib/i18n";

type MdxModule = {
  default: React.ComponentType<{ components?: Record<string, React.ComponentType<unknown>> }>;
};

type CodeElementProps = {
  className?: string;
  children?: React.ReactNode;
};

function MdxPre({ children, locale, ...props }: React.HTMLAttributes<HTMLPreElement> & { locale: Locale }) {
  const child = React.Children.only(children);

  if (React.isValidElement<CodeElementProps>(child) && child.props.className === "language-mermaid") {
    return <MermaidBlock chart={String(child.props.children ?? "").trim()} />;
  }

  if (React.isValidElement<CodeElementProps>(child) && child.type === "code" &&
      (typeof child.props.children === "string" || child.props.children == null)) {
    const language = child.props.className?.match(/(?:^|\s)language-(\S+)/)?.[1];
    return <CodeBlock text={child.props.children ?? ""} language={language} copy={getCodeBlockCopy(locale)}>
      <pre {...props} tabIndex={0}>{children}</pre>
    </CodeBlock>;
  }
  return <pre {...props}>{children}</pre>;
}

function MdxTable({ children, locale, ...props }: React.TableHTMLAttributes<HTMLTableElement> & { locale: Locale }) {
  return (
    <div className="mdx-table-scroll" role="region" aria-label={getArticleTableLabel(locale)} tabIndex={0}>
      <table {...props}>{children}</table>
    </div>
  );
}

export async function renderMdxWithHeadings(source: string, headingLinkLabel = getArticleTocCopy("en").linkToHeading, locale: Locale = "en") {
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
          pre: ((props: React.HTMLAttributes<HTMLPreElement>) => <MdxPre {...props} locale={locale} />) as React.ComponentType<unknown>,
          table: ((props: React.TableHTMLAttributes<HTMLTableElement>) => <MdxTable {...props} locale={locale} />) as React.ComponentType<unknown>,
        }}
      />
    );
  }
  return { Content: MdxContent, headings };
}

export async function renderMdx(source: string) {
  return (await renderMdxWithHeadings(source)).Content;
}
