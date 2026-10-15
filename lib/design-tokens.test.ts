import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";
import tokens from "@/docs/design-tokens.json";

const globalsCss = readFileSync(
  fileURLToPath(new URL("../app/globals.css", import.meta.url)),
  "utf8",
);

const layoutTsx = readFileSync(
  fileURLToPath(new URL("../app/layout.tsx", import.meta.url)),
  "utf8",
);

const profileSectionsCss = readFileSync(
  fileURLToPath(new URL("../components/layout/profile-sections.module.css", import.meta.url)),
  "utf8",
);

const articlePageCss = readFileSync(
  fileURLToPath(new URL("../components/layout/article-page.module.css", import.meta.url)),
  "utf8",
);

const articleProseCss = readFileSync(
  fileURLToPath(new URL("../components/layout/article-prose.module.css", import.meta.url)),
  "utf8",
);

describe("design token CSS contract", () => {
  it("defines semantic color tokens for light and dark themes", () => {
    expect(globalsCss).toContain("--color-bg: #fbfcfe;");
    expect(globalsCss).toContain("--color-text: #0f172a;");
    expect(globalsCss).toContain("--color-surface-strong: #ffffff;");
    expect(globalsCss).toContain("--color-accent: #1f5fe0;");
    expect(globalsCss).toContain("--color-success: #16a34a;");
    expect(globalsCss).toContain("--color-warning: #d97706;");
    expect(globalsCss).toContain("--color-error: #dc2626;");
    expect(globalsCss).toContain("--color-info: #2563eb;");

    expect(globalsCss).toContain(".theme-dark");
    expect(globalsCss).toContain("--color-bg: #0b1220;");
    expect(globalsCss).toContain("--color-text: #e6ebf5;");
    expect(globalsCss).toContain("--color-surface-strong: #111a2e;");
    expect(globalsCss).toContain("--color-accent: #5b9dff;");
  });

  it("keeps legacy aliases backed by the new semantic tokens", () => {
    expect(globalsCss).toContain("--bg: var(--color-bg);");
    expect(globalsCss).toContain("--surface: var(--color-surface);");
    expect(globalsCss).toContain("--ink: var(--color-text);");
    expect(globalsCss).toContain("--muted: var(--color-text-muted);");
    expect(globalsCss).toContain("--border: var(--color-border);");
    expect(globalsCss).toContain("--accent: var(--color-accent);");
  });

  it("defines meaningful section accent namespaces", () => {
    expect(globalsCss).toContain("--section-systems: #0891b2;");
    expect(globalsCss).toContain("--section-work: #2563eb;");
    expect(globalsCss).toContain("--section-ideas: #64748b;");
    expect(globalsCss).toContain("--section-digests: #7c3aed;");
  });

  it("defines the compact engineering typography scale", () => {
    expect(globalsCss).toContain("--font-sans-latin: \"IBM Plex Sans\"");
    expect(globalsCss).toContain("--font-mono: \"IBM Plex Mono\"");
    expect(globalsCss).toContain("--font-size-xs: 12px;");
    expect(globalsCss).toContain("--font-size-sm: 13px;");
    expect(globalsCss).toContain("--font-size-md: 14px;");
    expect(globalsCss).toContain("--font-size-lg: 16px;");
    expect(globalsCss).toContain("--font-size-xl: 18px;");
    expect(globalsCss).toContain("--font-size-2xl: 22px;");
    expect(globalsCss).toContain("--font-size-3xl: 28px;");
    expect(globalsCss).toContain("--font-size-4xl: 36px;");
  });

  it("applies technical typography defaults globally", () => {
    expect(globalsCss).toContain("font-family: var(--font-sans)");
    expect(globalsCss).toContain("font-size: var(--font-size-md);");
    expect(globalsCss).toContain("font-variant-numeric: tabular-nums;");
    expect(globalsCss).toContain("font-family: var(--font-mono)");
  });

  it("keeps typography free of build-time remote font fetching", () => {
    expect(layoutTsx).not.toContain("next/font/google");
    expect(layoutTsx).not.toContain("IBM_Plex_Sans");
    expect(layoutTsx).not.toContain("IBM_Plex_Mono");
  });

  it("renders the document root without generated font classes", () => {
    expect(layoutTsx).toContain('<html lang="en" suppressHydrationWarning>');
    expect(layoutTsx).toContain("<body>{children}");
    expect(layoutTsx).not.toMatch(/<body[^>]*className/);
  });

  it("keeps profile card content aligned to the top", () => {
    expect(profileSectionsCss).toMatch(/\.card\s*{[^}]*align-content:\s*start;/s);
  });

  it("keeps article code block backgrounds on the pre surface", () => {
    expect(articleProseCss).toMatch(/\.prose pre\s*{[^}]*background:\s*var\(--color-surface-strong\);/s);
    expect(articleProseCss).toMatch(/\.prose pre\s*{[^}]*border:\s*none;/s);
    expect(articleProseCss).toMatch(/\.prose pre code\s*{[^}]*background:\s*transparent;/s);
  });

  it("keeps article markdown tables full width while scrollable", () => {
    expect(articleProseCss).toMatch(
      /\.prose :global\(\.mdx-table-scroll\)\s*{[^}]*overflow-x:\s*auto;/s,
    );
    expect(articleProseCss).toMatch(/\.prose table\s*{[^}]*width:\s*100%;/s);
    expect(articleProseCss).toMatch(/\.prose table\s*{[^}]*min-width:\s*100%;/s);
  });

  it("keeps the article comments separator subtle", () => {
    expect(articlePageCss).toMatch(/\.comments\s*{[^}]*border-top:\s*1px solid color-mix\(in srgb, var\(--border\) 45%, transparent\);/s);
    expect(articlePageCss).toMatch(/\.comments\s*{[^}]*background:\s*color-mix\(in srgb, var\(--accent\) 4%, transparent\);/s);
    expect(articlePageCss).toMatch(/:global\(\.theme-dark\) \.comments\s*{[^}]*background:\s*color-mix\(in srgb, var\(--accent\) 14%, var\(--color-bg-elevated\)\);/s);
  });
});

function luminance(hex: string) {
  const rgb = hex.slice(1).match(/../g)!.map((channel) => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

describe("approved D2 contrast and token documentation", () => {
  for (const theme of ["light", "dark"] as const) {
    const base = tokens.color.base;
    const accent = tokens.color.accent.default[theme];
    const pairs: [string, string, number][] = [];
    for (const surface of [base.background[theme], base.surfaceStrong[theme], base.panel[theme]]) {
      for (const text of [base.text[theme], base.textMuted[theme], base.textSubtle[theme], accent]) {
        pairs.push([text, surface, 4.5]);
      }
    }
    pairs.push([base["on-accent"][theme], base["accent-fill"][theme], 4.5]);
    pairs.push([base["accent-fill"][theme], base.background[theme], 3]);
    pairs.push([base["chip-text"][theme], base.chip[theme], 4.5]);
    pairs.push([accent, base["chip-tag"][theme], 4.5]);
    it(`${theme} meets AA for every specified text/control pair`, () => {
      for (const [foreground, background, minimum] of pairs) {
        const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
        expect((values[0] + 0.05) / (values[1] + 0.05), `${foreground} on ${background}`).toBeGreaterThanOrEqual(minimum);
      }
    });
    it(`${theme} CSS agrees with the documented colors`, () => {
      const block = theme === "light" ? globalsCss.split(".theme-dark {")[0] : globalsCss.split(".theme-dark {")[1].split("}")[0];
      const names: Record<string, string> = {
        background: "bg", backgroundElevated: "bg-elevated", text: "text", textMuted: "text-muted",
        textSubtle: "text-subtle", surfaceStrong: "surface-strong", border: "border",
      };
      for (const [name, value] of Object.entries(base)) {
        expect(block).toContain(`--color-${names[name] ?? name}: ${value[theme]};`);
      }
      expect(block).toContain(`--color-accent: ${accent};`);
    });
  }
});
