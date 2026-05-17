import { access, mkdir, readdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const sourceDirectory = path.join(process.cwd(), "public", "og");
const outputDirectory = path.join(sourceDirectory, "heroes");
const widths = [640, 960, 1200, 1600] as const;

async function optimizeOgHeroes() {
  try {
    await access(sourceDirectory);
  } catch {
    console.error(`Source directory not found: ${sourceDirectory}`);
    process.exit(1);
  }

  await mkdir(outputDirectory, { recursive: true });

  const files = (await readdir(sourceDirectory))
    .filter((file) => file.endsWith(".png"))
    .sort();

  if (files.length === 0) {
    console.warn(`No PNG files found in ${sourceDirectory}`);
    return;
  }

  for (const file of files) {
    const sourcePath = path.join(sourceDirectory, file);
    const baseName = path.basename(file, ".png");

    for (const width of widths) {
      const outputPath = path.join(outputDirectory, `${baseName}-${width}.webp`);

      try {
        await sharp(sourcePath)
          .resize({ width })
          .webp({ effort: 6, quality: 78 })
          .toFile(outputPath);
      } catch (err) {
        console.error(`Failed to process ${file} at ${width}px: ${err}`);
        process.exit(1);
      }
    }
  }

  console.log(`Optimized ${files.length} image(s) → ${outputDirectory}`);
}

await optimizeOgHeroes();
