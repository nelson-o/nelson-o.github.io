import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium } from "@playwright/test";

// The English tagline ships as a supplied 312 × 234 handwriting animation that
// the hero plays at 3x. Localized taglines are animated from their existing
// still artwork so every locale reveals its strokes the same way.
const taglines = [{ artwork: "tagline.zh.webp", output: "tagline.zh.webm" }] as const;

const heroDirectory = path.join(process.cwd(), "public", "profile", "2026", "hero");
const frame = { width: 312, height: 234, rate: 24 };
const duration = 8;

// Runs in the page: reveals ink in writing order, then records the canvas.
async function recordTagline(options: {
  source: string; width: number; height: number; rate: number; duration: number;
}) {
  const { source, width, height, rate } = options;
  const image = new Image();
  image.src = source;
  await image.decode();

  const read = document.createElement("canvas");
  read.width = width;
  read.height = height;
  const readContext = read.getContext("2d", { willReadFrequently: true })!;
  readContext.drawImage(image, 0, 0, width, height);
  const pixels = readContext.getImageData(0, 0, width, height);

  // Handwriting sits on a slanted baseline. Rotating by the angle that leaves
  // the clearest gap between lines separates them; `along` then orders strokes
  // inside a line the way they were written.
  const ink: { index: number; x: number; y: number; underline: boolean }[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      if (pixels.data[index + 3] < 32) continue;
      const [r, g, b] = [pixels.data[index], pixels.data[index + 1], pixels.data[index + 2]];
      ink.push({ index, x, y, underline: b > r + 25 && g > r + 25 });
    }
  }
  const strokes = ink.filter((point) => !point.underline);
  const across = (angle: number, point: { x: number; y: number }) =>
    -point.x * Math.sin(angle) + point.y * Math.cos(angle);

  let baseline = 0;
  let clearest = Number.POSITIVE_INFINITY;
  for (let degrees = -24; degrees <= 8; degrees += 1) {
    const angle = (degrees * Math.PI) / 180;
    const values = strokes.map((point) => across(angle, point));
    const [low, high] = [Math.min(...values), Math.max(...values)];
    const bins = new Array(60).fill(0);
    for (const value of values) bins[Math.min(59, Math.floor(((value - low) / (high - low)) * 60))]++;
    const valley = Math.min(...bins.slice(15, 45));
    if (valley < clearest) { clearest = valley; baseline = angle; }
  }

  const values = strokes.map((point) => across(baseline, point));
  const [low, high] = [Math.min(...values), Math.max(...values)];
  const bins = new Array(60).fill(0);
  for (const value of values) bins[Math.min(59, Math.floor(((value - low) / (high - low)) * 60))]++;
  let split = 30;
  for (let bin = 15; bin < 45; bin++) if (bins[bin] <= bins[split]) split = bin;
  const boundary = low + ((split + 0.5) / 60) * (high - low);

  const along = (point: { x: number; y: number }) =>
    point.x * Math.cos(baseline) + point.y * Math.sin(baseline);
  const groups = [
    strokes.filter((point) => across(baseline, point) <= boundary),
    strokes.filter((point) => across(baseline, point) > boundary),
    ink.filter((point) => point.underline),
  ].filter((group) => group.length > 0);

  // Lines share the reveal in proportion to their ink; the underline finishes
  // it off, and the last tenth holds the completed artwork.
  const strokeWeight = groups.slice(0, -1).reduce((total, group) => total + group.length, 0);
  const revealed = new Float32Array(width * height).fill(Number.POSITIVE_INFINITY);
  let start = 0;
  for (const [order, group] of groups.entries()) {
    const last = order === groups.length - 1;
    const span = last ? 0.08 : (group.length / strokeWeight) * 0.82;
    const positions = group.map(along);
    const [first, final] = [Math.min(...positions), Math.max(...positions)];
    for (const [position, point] of positions.map((value, i) => [value, group[i]] as const)) {
      revealed[point.index / 4] = start + ((position - first) / (final - first || 1)) * span;
    }
    start += span;
  }

  const paint = document.createElement("canvas");
  paint.width = width;
  paint.height = height;
  const paintContext = paint.getContext("2d")!;
  const output = paintContext.createImageData(width, height);
  const feather = 0.02;

  const chunks: Blob[] = [];
  const recorder = new MediaRecorder(paint.captureStream(rate), {
    mimeType: "video/webm;codecs=vp9", videoBitsPerSecond: 420000,
  });
  recorder.ondataavailable = (event) => chunks.push(event.data);
  const finished = new Promise<void>((resolve) => { recorder.onstop = () => resolve(); });
  recorder.start();

  const began = performance.now();
  for (;;) {
    const elapsed = (performance.now() - began) / 1000;
    const progress = Math.min(elapsed / options.duration, 1);
    for (let pixel = 0; pixel < width * height; pixel++) {
      const index = pixel * 4;
      const visible = Math.max(0, Math.min(1, (progress - revealed[pixel]) / feather));
      output.data[index] = pixels.data[index];
      output.data[index + 1] = pixels.data[index + 1];
      output.data[index + 2] = pixels.data[index + 2];
      output.data[index + 3] = pixels.data[index + 3] * visible;
    }
    paintContext.fillStyle = "#020002";
    paintContext.fillRect(0, 0, width, height);
    const layer = await createImageBitmap(output);
    paintContext.drawImage(layer, 0, 0);
    layer.close();
    if (progress === 1) break;
    await new Promise(requestAnimationFrame);
  }
  await new Promise((resolve) => setTimeout(resolve, 200));
  recorder.stop();
  await finished;

  const blob = new Blob(chunks, { type: "video/webm" });
  const buffer = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  for (const byte of buffer) binary += String.fromCharCode(byte);
  return { encoded: btoa(binary), baseline: (baseline * 180) / Math.PI, lines: groups.length };
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("about:blank");

for (const { artwork, output } of taglines) {
  const artworkPath = path.join(heroDirectory, artwork);
  const source = `data:image/webp;base64,${(await readFile(artworkPath)).toString("base64")}`;
  const result = await page.evaluate(recordTagline, { source, ...frame, duration });
  const outputPath = path.join(heroDirectory, output);
  await writeFile(outputPath, Buffer.from(result.encoded, "base64"));
  const { size } = await stat(outputPath);
  console.log(`${output}\t${frame.width} × ${frame.height}\t${size.toLocaleString()} bytes\t` +
    `baseline ${result.baseline.toFixed(1)}°, ${result.lines} reveal groups`);
}

await browser.close();
