// Renders the static 1200×630 link-preview cards: the site default and the 2026 profile.
// Run with `bun run assets:og`; outputs are committed under public/og/.
import path from "node:path";

import sharp from "sharp";

import { getProfile } from "@/lib/profile";
import { profile2026Copy } from "@/lib/profile-2026-copy";
import { profileLocales, type ProfileLocale } from "@/lib/profile-locales";

const width = 1200;
const height = 630;
const root = process.cwd();
const outputDirectory = path.join(root, "public", "og");
const fontStack = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

function textLayer(lines: { text: string; x: number; y: number; size: number; color: string; weight?: number; spacing?: number }[]) {
  const nodes = lines.map(({ text, x, y, size, color, weight = 400, spacing = 0 }) =>
    `<text x="${x}" y="${y}" font-family="${fontStack}" font-size="${size}" font-weight="${weight}" letter-spacing="${spacing}" fill="${color}">${escapeXml(text)}</text>`);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${nodes.join("")}</svg>`);
}

// Site palette from app/globals.css: --color-bg, --color-text, --color-text-muted, --color-accent.
async function renderDefaultCard() {
  const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs><linearGradient id="wash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6f4f8"/><stop offset="1" stop-color="#fafafa"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#wash)"/>
    <rect x="96" y="232" width="72" height="6" rx="3" fill="#0891b2"/>
  </svg>`);
  await sharp(background)
    .composite([{ input: textLayer([
      { text: "NELSON-O.GITHUB.IO", x: 96, y: 150, size: 24, color: "#0e7490", weight: 600, spacing: 6 },
      { text: "Nelson Lin", x: 96, y: 330, size: 96, color: "#111827", weight: 600 },
      { text: "An engineering knowledge surface for systems,", x: 96, y: 420, size: 36, color: "#4b5563" },
      { text: "work, ideas, and experiments.", x: 96, y: 468, size: 36, color: "#4b5563" },
    ]) }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDirectory, "default.png"));
}

// Pango (sharp's text input) sets the profile card copy: it falls back per script for CJK, Hangul
// and Thai, and reports the rendered size so each headline can be fitted to the text column.
async function pangoText(markup: string, size: number, weight = "") {
  const font = `Helvetica Neue ${weight} ${size}`.replace(/\s+/g, " ");
  const { data, info } = await sharp({ text: { text: markup, font, rgba: true, dpi: 72, spacing: Math.round(size * 0.12) } })
    .png().toBuffer({ resolveWithObject: true });
  return { input: data, width: info.width, height: info.height };
}

// Largest size (≤ 88px) at which the two headline lines fit 560 × 230px, clear of the portrait fade.
async function fittedHeadline([first, second]: readonly string[]) {
  const markup = `<span foreground="#0b1428">${escapeXml(first)}</span>\n<span foreground="#0069ee">${escapeXml(second)}</span>`;
  for (let size = 88; ; size -= 4) {
    const layer = await pangoText(markup, size, "Medium");
    if ((layer.width <= 560 && layer.height <= 230) || size <= 40) return layer;
  }
}

// One card per locale, titled with the hero headline; the tab title stays nelson.26.
// 2026 profile light palette from components/layout/profile-2026/page.module.css.
async function renderProfileCard(locale: ProfileLocale, portrait: Buffer, fade: Buffer) {
  const headline = await fittedHeadline(profile2026Copy[locale].headline);
  const role = await pangoText(`<span foreground="#46536b">${escapeXml(getProfile(locale, undefined, "2026").basics.title)}</span>`, 32);
  const eyebrow = await pangoText('<span foreground="#0069ee" letter_spacing="6144">NELSON LIN</span>', 22, "Medium");
  const site = await pangoText('<span foreground="#46536b">nelson-o.github.io</span>', 22);
  const headlineTop = 330 - headline.height;
  const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#f4faff"/>
    <rect x="96" y="${headlineTop + headline.height + 26}" width="72" height="6" rx="3" fill="#0069ee"/>
  </svg>`);
  await sharp(background)
    .composite([
      { input: portrait, left: width - portraitWidth, top: 0 },
      { input: fade, left: width - portraitWidth, top: 0 },
      { input: eyebrow.input, left: 96, top: headlineTop - eyebrow.height - 28 },
      { input: headline.input, left: 96, top: headlineTop },
      { input: role.input, left: 96, top: headlineTop + headline.height + 62 },
      { input: site.input, left: 96, top: height - 96 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(outputDirectory, `profile-2026.${locale}.jpg`));
}

const portraitWidth = 520;
const portrait = await sharp(path.join(root, "public", "profile", "2026", "hero", "portrait.light.webp"))
  .resize(portraitWidth, height, { fit: "cover", position: "top" })
  .toBuffer();
const fade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${portraitWidth}" height="${height}">
  <defs><linearGradient id="fade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f4faff"/><stop offset="0.35" stop-color="#f4faff" stop-opacity="0"/></linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#fade)"/>
</svg>`);

await renderDefaultCard();
for (const locale of profileLocales) await renderProfileCard(locale, portrait, fade);
console.log(`Rendered public/og/default.png and ${profileLocales.length} public/og/profile-2026.<locale>.jpg cards`);
