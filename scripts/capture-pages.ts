import { spawn, type ChildProcess } from "node:child_process";
import { mkdirSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium, type Page } from "@playwright/test";

import { captureFileName, captureUrl, parseCaptureArgs } from "../lib/capture-options";

// Stable full-page captures of the static export: `bun run capture -- --help` or docs/page-captures.md.
const repoDir = fileURLToPath(new URL("..", import.meta.url));
const usage = `Usage: bun run capture [-- options]

  --route <path>   Route to capture; repeat or comma-separate (default /en/profile/)
  --theme <name>   light, dark or both (default both)
  --width <px>     Viewport width; repeat or comma-separate (default 1280,390)
  --scale <n>      Device scale factor (default 2)
  --out <dir>      Where PNGs go (default a new folder under the system temp dir)
  --dir <dir>      Export to serve (default ./out); ignored with --base
  --base <url>     Capture a running site instead, e.g. https://nelson-o.github.io`;

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(usage);
  process.exit(0);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
let options;
try {
  options = parseCaptureArgs(process.argv.slice(2), join(tmpdir(), "nelson-captures", stamp), join(repoDir, "out"));
} catch (error) {
  console.error(`${(error as Error).message}\n\n${usage}`);
  process.exit(1);
}

function freePort() {
  return new Promise<number>((resolvePort, reject) => {
    const probe = createServer().once("error", reject).listen(0, () => {
      const address = probe.address();
      probe.close(() => (address && typeof address === "object" ? resolvePort(address.port) : reject(new Error("No port"))));
    });
  });
}

// Reuses scripts/preview-export.ts so captures see exactly what `bun run preview` serves.
async function startPreview(exportDir: string) {
  const port = await freePort();
  const child = spawn("bun", [join(repoDir, "scripts/preview-export.ts")], {
    env: { ...process.env, PORT: String(port), EXPORT_DIR: resolve(exportDir) },
    stdio: ["ignore", "pipe", "inherit"],
  });
  await new Promise<void>((ready, fail) => {
    child.stdout?.on("data", (chunk: Buffer) => chunk.toString().includes("Previewing") && ready());
    child.once("exit", (code) => fail(new Error(`Preview server exited (${code})`)));
  });
  return { child, baseUrl: `http://localhost:${port}` };
}

// Puts the page in its fully shown state: no scroll-timed or lazy work left pending.
async function settle(page: Page) {
  await page.evaluate(async () => {
    window.scrollTo(0, 0);
    // #133 deferred section artwork normally waits for the section to near the viewport.
    document.querySelectorAll("[data-deferred-art]").forEach((element) => element.setAttribute("data-deferred-art", "ready"));
    document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((image) => (image.loading = "eager"));
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode().catch(() => undefined)));
  });
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
}

let preview: ChildProcess | undefined;
try {
  let baseUrl = options.baseUrl;
  if (!baseUrl) {
    const started = await startPreview(options.exportDir);
    preview = started.child;
    baseUrl = started.baseUrl;
  }
  mkdirSync(options.outDir, { recursive: true });

  const browser = await chromium.launch();
  try {
    for (const theme of options.themes) {
      for (const width of options.widths) {
        // Reduced motion turns off the section reveal and shows the hero tagline fully drawn.
        const context = await browser.newContext({
          viewport: { width, height: 900 },
          deviceScaleFactor: options.scale,
          colorScheme: theme,
          reducedMotion: "reduce",
        });
        const page = await context.newPage();
        for (const route of options.routes) {
          const url = captureUrl(baseUrl, route, theme);
          const response = await page.goto(url, { waitUntil: "networkidle" });
          if (!response || response.status() >= 400) throw new Error(`${url} returned ${response?.status() ?? "no response"}`);
          await settle(page);
          const path = join(options.outDir, captureFileName(route, theme, width));
          await page.screenshot({ path, fullPage: true, animations: "disabled", caret: "hide" });
          console.log(path);
        }
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
} catch (error) {
  console.error((error as Error).message);
  process.exitCode = 1;
} finally {
  preview?.kill();
}
