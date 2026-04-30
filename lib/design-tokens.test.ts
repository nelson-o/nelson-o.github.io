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

describe("design token CSS contract", () => {
  it("defines semantic color tokens for light and dark themes", () => {
    expect(globalsCss).toContain("--color-bg: #fafafa;");
    expect(globalsCss).toContain("--color-text: #111827;");
    expect(globalsCss).toContain("--color-accent: #0891b2;");
    expect(globalsCss).toContain("--color-success: #16a34a;");
    expect(globalsCss).toContain("--color-warning: #d97706;");
    expect(globalsCss).toContain("--color-error: #dc2626;");
    expect(globalsCss).toContain("--color-info: #2563eb;");

    expect(globalsCss).toContain(".theme-dark");
    expect(globalsCss).toContain("--color-bg: #0f172a;");
    expect(globalsCss).toContain("--color-text: #e5e7eb;");
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
    expect(globalsCss).toContain("--font-sans: var(--font-plex-sans)");
    expect(globalsCss).toContain("--font-mono: var(--font-plex-mono)");
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

  it("loads IBM Plex Sans and IBM Plex Mono through next/font", () => {
    expect(layoutTsx).toContain("IBM_Plex_Sans");
    expect(layoutTsx).toContain("IBM_Plex_Mono");
    expect(layoutTsx).toContain('variable: "--font-plex-sans"');
    expect(layoutTsx).toContain('variable: "--font-plex-mono"');
  });

  it("applies font variables at the document root", () => {
    expect(layoutTsx).toContain('<html lang="en" className={`${plexSans.variable} ${plexMono.variable}`');
    expect(layoutTsx).toContain("<body>{children}</body>");
  });

  it("keeps profile card content aligned to the top", () => {
    expect(profilePageCss).toMatch(/\.card\s*{[^}]*align-content:\s*start;/s);
  });
});
