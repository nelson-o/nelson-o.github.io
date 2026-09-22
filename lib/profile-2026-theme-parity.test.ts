import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const moduleDirectory = fileURLToPath(new URL("../components/layout/profile-2026/", import.meta.url));

// Light and dark share layout and typography. A theme-scoped rule may only
// restate colour, shadow, outline, blend, filter, or artwork. `border-color`
// carries an outline change without the box-model shift a `border` shorthand
// would introduce.
const themeableProperties = new Set([
  "color", "background", "background-color", "background-image",
  "border-color", "box-shadow", "text-shadow",
  "filter", "mix-blend-mode", "opacity", "mask-image",
]);

// The hero paints one portrait per theme; both reserve the same frame.
const artworkSwapSelectors = [".lightPortrait", ".darkPortrait"];

function themeDeclarations(css: string) {
  return [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)]
    .map(([, selector, body]) => ({ selector: selector.trim(), body }))
    .filter(({ selector }) => selector.includes("theme-light") || selector.includes("theme-dark"))
    .flatMap(({ selector, body }) => body.split(";")
      .map((declaration) => declaration.trim())
      .filter(Boolean)
      .map((declaration) => ({ selector, property: declaration.slice(0, declaration.indexOf(":")).trim() })));
}

describe("2026 profile theme parity", () => {
  const files = readdirSync(moduleDirectory).filter((file) => file.endsWith(".module.css"));

  it("styles every section with a colocated CSS Module", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)("%s only re-themes colour, shadow, outline, and artwork", (file) => {
    const declarations = themeDeclarations(readFileSync(moduleDirectory + file, "utf8"));
    const offenders = declarations.filter(({ selector, property }) =>
      !themeableProperties.has(property)
      && !property.startsWith("--profile-")
      && !property.startsWith("--project-")
      && !(property === "display" && artworkSwapSelectors.some((swap) => selector.includes(swap))));
    expect(offenders).toEqual([]);
  });
});
