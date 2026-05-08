import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const sourceDirectory = path.join(process.cwd(), "public", "og");
const outputDirectory = path.join(sourceDirectory, "heroes");
const widths = [640, 960, 1200, 1600] as const;

async function optimizeOgHeroes() {
  await mkdir(outputDirectory, { recursive: true });

  const files = (await readdir(sourceDirectory))
    .filter((file) => file.endsWith(".png"))
    .sort();

  for (const file of files) {
    const sourcePath = path.join(sourceDirectory, file);
    const baseName = path.basename(file, ".png");

    for (const width of widths) {
      const outputPath = path.join(outputDirectory, `${baseName}-${width}.webp`);

      await sharp(sourcePath)
        .resize({ width })
        .webp({ effort: 6, quality: 78 })
        .toFile(outputPath);
    }
  }
}

await optimizeOgHeroes();
