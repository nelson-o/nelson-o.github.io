import { stat } from "node:fs/promises";
import path from "node:path";

import { chromium } from "@playwright/test";
import sharp from "sharp";

import { profileOnlyCopy } from "@/lib/profile-2026-copy-profile-only";
import type { ProfileOnlyLocale } from "@/lib/profile-locales";

// Profile-only languages have no supplied handwriting, so their tagline and
// contact signature are set in open-licence handwriting typefaces and composed
// like the supplied en/zh/ja artwork: pale ink on a transparent ground, a slanted
// baseline, and a cyan brush underline.
const fonts: Record<ProfileOnlyLocale, { family: string; weight: number }> = {
  ko: { family: "Nanum Pen Script", weight: 400 },
  th: { family: "Sriracha", weight: 400 },
  vi: { family: "Dancing Script", weight: 500 },
  de: { family: "Dancing Script", weight: 500 },
};

// Where each tagline breaks onto its second line. Thai has no word spaces.
const taglineBreaks: Record<ProfileOnlyLocale, [string, string]> = {
  ko: ["아이디어에서", "임팩트로"],
  th: ["จากไอเดีย", "สู่ผลลัพธ์"],
  vi: ["Từ ý tưởng", "đến tác động"],
  de: ["Von der Idee", "zur Wirkung"],
};

const layouts = {
  hero: { width: 580, height: 435, angle: -14, indent: 0.45, maxSize: 132 },
  contact: { width: 1120, height: 373, angle: -3, indent: 0, maxSize: 92 },
} as const;

type Layout = (typeof layouts)[keyof typeof layouts];
type Artwork = { lines: [string, string]; family: string; weight: number; layout: Layout; hero: boolean };

const artworkDirectory = path.join(process.cwd(), "public", "profile", "2026");
const fontsUrl = "https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&family=Sriracha"
  + "&family=Dancing+Script:wght@500&display=block";

// Runs in the page: returns characters the typeface lacks. A covered glyph
// measures the same whatever the fallback; a missing one takes the fallback's width.
async function missingGlyphs({ family, weight, text }: { family: string; weight: number; text: string }) {
  await document.fonts.load(`${weight} 64px "${family}"`, text);
  const context = document.createElement("canvas").getContext("2d")!;
  const width = (character: string, fallback: string) => {
    context.font = `${weight} 64px "${family}", ${fallback}`;
    return context.measureText(character).width;
  };
  return [...new Set(text.replace(/\s/g, ""))]
    .filter((character) => width(character, "monospace") !== width(character, "serif"));
}

// Runs in the page: draws the largest size whose ink stays inside the frame.
function drawArtwork({ lines, family, weight, layout, hero }: Artwork) {
  const { width, height, angle, indent, maxSize } = layout;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true })!;
  const margin = 18;

  const brush = (x0: number, x1: number, y: number, thickness: number) => {
    // A tapered stroke that rises slightly to the right, like a quick marker swipe.
    const lift = (x1 - x0) * 0.05;
    const steps = 48;
    const top: [number, number][] = [];
    const bottom: [number, number][] = [];
    for (let step = 0; step <= steps; step++) {
      const t = step / steps;
      const x = x0 + (x1 - x0) * t;
      const cy = y - lift * t + Math.sin(t * Math.PI) * thickness * 0.6;
      const half = thickness * (0.35 + 0.65 * Math.sin(Math.min(1, t * 1.15) * Math.PI * 0.5)) * (1 - 0.55 * t * t) / 2;
      top.push([x, cy - half]);
      bottom.unshift([x, cy + half]);
    }
    context.beginPath();
    [...top, ...bottom].forEach(([x, py], index) => (index ? context.lineTo(x, py) : context.moveTo(x, py)));
    context.closePath();
    context.fillStyle = "#12e3ec";
    context.fill();
  };

  const draw = (size: number) => {
    context.clearRect(0, 0, width, height);
    context.save();
    context.font = `${weight} ${size}px "${family}"`;
    const [first, second] = lines.map((line) => context.measureText(line).width);
    const offset = size * indent * 1.6;
    const blockWidth = Math.max(first, offset + second);
    const lineGap = size * (hero ? 1.05 : 1.2);
    context.translate(width / 2, height / 2);
    context.rotate((angle * Math.PI) / 180);
    const left = -blockWidth / 2;
    const top = hero ? -lineGap * 0.55 : -lineGap * 0.65;
    context.fillStyle = "rgba(244, 246, 246, 0.94)";
    context.fillText(lines[0], left, top);
    context.fillText(lines[1], left + offset, top + lineGap);
    // Sit the stroke just under the second line's deepest descender.
    const underline = top + lineGap + context.measureText(lines[1]).actualBoundingBoxDescent + size * 0.14;
    if (hero) brush(left + offset + second * 0.25, left + offset + second * 1.02, underline, size * 0.14);
    else brush(left + size * 1.3, left + size * 1.3 + Math.min(second * 0.45, size * 3.4), underline, size * 0.16);
    context.restore();
  };

  const fits = () => {
    const { data } = context.getImageData(0, 0, width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const inside = x >= margin && x < width - margin && y >= margin && y < height - margin;
        if (!inside && data[(y * width + x) * 4 + 3] > 8) return false;
      }
    }
    return true;
  };

  for (let size = maxSize; size >= 24; size -= 2) {
    draw(size);
    if (fits()) return { size, png: canvas.toDataURL("image/png") };
  }
  throw new Error(`${lines.join(" / ")} does not fit`);
}

async function renderHandwrittenArtwork() {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(`<link rel="stylesheet" href="${fontsUrl}">`, { waitUntil: "networkidle" });

    for (const locale of Object.keys(fonts) as ProfileOnlyLocale[]) {
      const copy = profileOnlyCopy[locale];
      const { family, weight } = fonts[locale];
      const tagline = taglineBreaks[locale];
      if (tagline.join(locale === "th" ? "" : " ") !== copy.tagline) {
        throw new Error(`${locale} tagline break is out of date with "${copy.tagline}"`);
      }
      const [first, ...rest] = copy.manifesto;
      const signature: [string, string] = [first, rest.join(" ")];

      const missing = await page.evaluate(missingGlyphs, { family, weight, text: [...tagline, ...signature].join("") });
      if (missing.length) throw new Error(`${family} lacks ${locale} glyphs: ${missing.join(" ")}`);

      for (const [section, lines] of [["hero", tagline], ["contact", signature]] as const) {
        const artwork: Artwork = { lines, family, weight, layout: layouts[section], hero: section === "hero" };
        const { size, png } = await page.evaluate(drawArtwork, artwork);
        const output = `${section}/${section === "hero" ? "tagline" : "signature"}.${locale}.webp`;
        const outputPath = path.join(artworkDirectory, output);
        await sharp(Buffer.from(png.split(",")[1], "base64")).webp({ effort: 6, quality: 85 }).toFile(outputPath);
        const { size: bytes } = await stat(outputPath);
        console.log(`${output}\t${family} ${size}px\t${bytes.toLocaleString()} bytes`);
      }
    }
  } finally {
    await browser.close();
  }
}

await renderHandwrittenArtwork();
