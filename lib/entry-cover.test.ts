import React from "react";
import { mkdtemp, readFile, rm, stat, mkdir, symlink } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import sharp from "sharp";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getEntryCover, getCoverKey } from "./entry-cover";
import { coverWidths } from "./cover-variants";
import { getAllEntriesForSection } from "./mdx/content";
import { resolveCoverSourcePath } from "./mdx/content-cover";
import { locales, sections } from "./i18n";
import { fallbackSvg, writeCover, generateExplicitCover } from "../scripts/generate-entry-covers";
import { OgHeroImage } from "../components/ui/og-hero-image";

const entry = getAllEntriesForSection("en", "ideas")[0];
describe("static entry covers", () => {
  it("selects primary tag before section, consistently across translations", () => {
    expect(getEntryCover({ ...entry, tags: ["agents", "teams"] }).light).toBe("/covers/fallback-agents.light");
    expect(getEntryCover({ ...entry, tags: undefined }).light).toBe("/covers/fallback-ideas.light");
    expect(getEntryCover({ ...entry, locale: "ja" })).toEqual(getEntryCover(entry));
    expect(getCoverKey({ ...entry, cover: "/image.webp" })).not.toEqual(getCoverKey({ ...entry, cover: "/image.webp", slug: `${entry.slug}/nested` }));
  });
  it("ships every referenced source and generated variant, including drafts", async () => {
    const checked = new Set<string>();
    for (const locale of locales) for (const section of sections) {
      for (const post of getAllEntriesForSection(locale, section)) {
        const source = resolveCoverSourcePath(post);
        if (source) expect((await stat(source)).isFile()).toBe(true);
        for (const prefix of Object.values(getEntryCover(post))) for (const width of coverWidths) {
          const path = join(process.cwd(), "public", `${prefix}-${width}.webp`);
          if (checked.has(path)) continue;
          checked.add(path);
          const metadata = await sharp(path).metadata();
          expect(metadata.width).toBe(width);
          expect(metadata.height).toBe(Math.round(width * 0.618));
          if (width === 640 && !post.cover) expect((await stat(path)).size).toBeLessThan(40_000);
          if (width < 640 && !post.cover) {
            expect((await stat(path)).size).toBeLessThan((await stat(join(process.cwd(), "public", `${prefix}-640.webp`))).size);
          }
        }
      }
    }
  });
  it("generates repeatable responsive covers and fails on missing sources", async () => {
    const root = await mkdtemp(join(tmpdir(), "covers-"));
    try {
      const prefix = join(root, "cover");
      const svg = Buffer.from(fallbackSvg("agents", false));
      await writeCover(svg, prefix);
      const before = await readFile(`${prefix}-640.webp`);
      await writeCover(svg, prefix);
      expect(await readFile(`${prefix}-640.webp`)).toEqual(before);
      expect(fallbackSvg("agents", true)).not.toBe(fallbackSvg("agents", false));
      await expect(writeCover(join(root, "missing.png"), prefix)).rejects.toThrow();
    } finally { await rm(root, { recursive: true, force: true }); }
  }, 30000);
  it("resolves nested relative and public explicit sources through the production generator", async () => {
    const root = await mkdtemp(join(tmpdir(), "explicit-covers-"));
    try {
      const content = join(root, "content"), publicRoot = join(root, "public"), output = join(root, "output");
      const nested = join(content, "en/ideas/nested");
      await Promise.all([mkdir(nested, { recursive: true }), mkdir(publicRoot), mkdir(output)]);
      const source = join(nested, "art.png");
      await sharp({ create: { width: 80, height: 60, channels: 3, background: "#abcdef" } }).png().toFile(source);
      await sharp(source).png().toFile(join(publicRoot, "art.png"));
      for (const cover of ["./art.png", "/art.png"]) {
        const post = { ...entry, slug: "nested/post", cover };
        await generateExplicitCover(post, output, content, publicRoot);
        for (const width of coverWidths) {
          expect((await sharp(join(output, `${getCoverKey(post)}.light-${width}.webp`)).metadata()).width).toBe(width);
        }
      }
      await expect(generateExplicitCover({ ...entry, cover: "/missing.png" }, output, content, publicRoot)).rejects.toThrow();
      await symlink(source, join(publicRoot, "escape.png"));
      await expect(generateExplicitCover({ ...entry, cover: "/escape.png" }, output, content, publicRoot)).rejects.toThrow("escapes asset root");
    } finally { await rm(root, { recursive: true, force: true }); }
  }, 30000);
  it("renders both theme variants with reserved dimensions and lazy card hints", () => {
    const html = renderToStaticMarkup(React.createElement(OgHeroImage, { src: "", cover: getEntryCover(entry), alt: "", loading: "lazy" }));
    for (const theme of ["light", "dark"]) for (const width of coverWidths) {
      expect(html).toContain(`.${theme}-${width}.webp ${width}w`);
    }
    expect(html).toContain('width="1200" height="742" loading="lazy"');
  });
});
