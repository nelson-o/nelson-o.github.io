// Renders the static 1200×630 link-preview cards: the site default and the 2026 profile.
// Run with `bun run assets:og`; outputs are committed under public/og/.
import path from "node:path";

import sharp from "sharp";

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

// 2026 profile light palette from components/layout/profile-2026/page.module.css.
async function renderProfileCard() {
  const portraitWidth = 520;
  const portrait = await sharp(path.join(root, "public", "profile", "2026", "hero", "portrait.light.webp"))
    .resize(portraitWidth, height, { fit: "cover", position: "top" })
    .toBuffer();
  const fade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${portraitWidth}" height="${height}">
    <defs><linearGradient id="fade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f4faff"/><stop offset="0.35" stop-color="#f4faff" stop-opacity="0"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#fade)"/>
  </svg>`);
  const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#f4faff"/>
    <rect x="96" y="276" width="72" height="6" rx="3" fill="#0069ee"/>
  </svg>`);
  await sharp(background)
    .composite([
      { input: portrait, left: width - portraitWidth, top: 0 },
      { input: fade, left: width - portraitWidth, top: 0 },
      { input: textLayer([
        { text: "NELSON LIN", x: 96, y: 150, size: 24, color: "#0069ee", weight: 600, spacing: 6 },
        { text: "nelson.26", x: 96, y: 240, size: 104, color: "#0b1428", weight: 600 },
        { text: "Principal Web Architect", x: 96, y: 350, size: 40, color: "#0b1428" },
        { text: "Platform, frontend and full-stack engineering", x: 96, y: 410, size: 28, color: "#46536b" },
        { text: "nelson-o.github.io", x: 96, y: 540, size: 24, color: "#46536b" },
      ]) },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDirectory, "profile-2026.png"));
}

await renderDefaultCard();
await renderProfileCard();
console.log("Rendered public/og/default.png and public/og/profile-2026.png");
