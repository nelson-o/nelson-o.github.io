import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React from "react";

import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";

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

export async function renderMdx(source: string) {
  const mod = (await evaluate(source, {
    Fragment,
    jsx,
    jsxs,
    remarkPlugins: [remarkGfm],
  })) as MdxModule;

  const Content = mod.default;

  return function MdxContent() {
    return (
      <Content
        components={{
          pre: MdxPre as React.ComponentType<unknown>,
          table: MdxTable as React.ComponentType<unknown>,
        }}
      />
    );
  };
}
