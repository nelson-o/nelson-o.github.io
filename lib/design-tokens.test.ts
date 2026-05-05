import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const globalsCss = readFileSync(
  fileURLToPath(new URL("../app/globals.css", import.meta.url)),
  "utf8",
);

const layoutTsx = readFileSync(
  fileURLToPath(new URL("../app/layout.tsx", import.meta.url)),
  "utf8",
);

const profilePageCss = readFileSync(
  fileURLToPath(new URL("../components/layout/profile-page.module.css", import.meta.url)),
  "utf8",
);

const articlePageCss = readFileSync(
  fileURLToPath(new URL("../components/layout/article-page.module.css", import.meta.url)),
  "utf8",
);

describe("design token CSS contract", () => {
  it("defines semantic color tokens for light and dark themes", () => {
    expect(globalsCss).toContain("--color-bg: #fafafa;");
    expect(globalsCss).toContain("--color-text: #111827;");
    expect(globalsCss).toContain("--color-surface-strong: #ffffff;");
    expect(globalsCss).toContain("--color-accent: #0891b2;");
    expect(globalsCss).toContain("--color-success: #16a34a;");
    expect(globalsCss).toContain("--color-warning: #d97706;");
    expect(globalsCss).toContain("--color-error: #dc2626;");
    expect(globalsCss).toContain("--color-info: #2563eb;");

    expect(globalsCss).toContain(".theme-dark");
    expect(globalsCss).toContain("--color-bg: #0f172a;");
    expect(globalsCss).toContain("--color-text: #e5e7eb;");
    expect(globalsCss).toContain("--color-surface-strong: rgba(30, 41, 59, 0.98);");
    expect(globalsCss).toContain("--color-accent: #22d3ee;");
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
    expect(globalsCss).toContain("--section-lab: #7c3aed;");
  });

  it("defines the compact engineering typography scale", () => {
    expect(globalsCss).toContain("--font-sans: \"IBM Plex Sans\"");
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
    expect(layoutTsx).toContain("<body>{children}</body>");
  });

  it("keeps profile card content aligned to the top", () => {
    expect(profilePageCss).toMatch(/\.card\s*{[^}]*align-content:\s*start;/s);
  });

  it("keeps article code block backgrounds on the pre surface", () => {
    expect(articlePageCss).toMatch(/\.prose pre\s*{[^}]*background:\s*var\(--color-surface-strong\);/s);
    expect(articlePageCss).toMatch(/\.prose pre\s*{[^}]*border:\s*none;/s);
    expect(articlePageCss).toMatch(/\.prose pre code\s*{[^}]*background:\s*transparent;/s);
  });

  it("keeps the article comments separator subtle", () => {
    expect(articlePageCss).toMatch(/\.comments\s*{[^}]*border-top:\s*1px solid color-mix\(in srgb, var\(--border\) 45%, transparent\);/s);
    expect(articlePageCss).toMatch(/\.comments\s*{[^}]*background:\s*color-mix\(in srgb, var\(--accent\) 4%, transparent\);/s);
    expect(articlePageCss).toMatch(/:global\(\.theme-dark\) \.comments\s*{[^}]*background:\s*color-mix\(in srgb, var\(--accent\) 14%, var\(--color-bg-elevated\)\);/s);
  });
});
