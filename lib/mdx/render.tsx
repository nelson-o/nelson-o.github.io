import { Fragment, jsx, jsxs } from "react/jsx-runtime";

import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";

type MdxModule = {
  default: React.ComponentType;
};

export async function renderMdx(source: string) {
  const mod = (await evaluate(source, {
    Fragment,
    jsx,
    jsxs,
    remarkPlugins: [remarkGfm],
  })) as MdxModule;

  return mod.default;
}
