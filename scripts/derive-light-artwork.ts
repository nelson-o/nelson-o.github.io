import { stat } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

// Light decorative artwork is derived from its dark counterpart so both themes
// keep identical contours. The transform mirrors the CSS treatment the profile
// already applies to handwritten artwork: invert the image, rotate the hue back
// into the blue accent range, then lift the result onto a near-white ground.
const derivations = [
  { source: "projects/waves.dark.webp", output: "projects/waves.light.webp" },
  { source: "projects/signals.dark.webp", output: "projects/signals.light.webp" },
] as const;

const hue = 190;
const saturation = 1.1;
const lift = { multiply: 0.95, offset: 14 } as const;
const artworkDirectory = path.join(process.cwd(), "public", "profile", "2026");

async function deriveLightArtwork() {
  for (const { source, output } of derivations) {
    const sourcePath = path.join(artworkDirectory, source);
    const outputPath = path.join(artworkDirectory, output);

    try {
      await sharp(sourcePath)
        .negate({ alpha: false })
        .modulate({ hue, saturation })
        .linear(lift.multiply, lift.offset)
        .webp({ effort: 6, quality: 85 })
        .toFile(outputPath);
    } catch (err) {
      console.error(`Failed to derive ${output} from ${source}: ${err}`);
      process.exit(1);
    }

    const { width, height } = await sharp(outputPath).metadata();
    const { size } = await stat(outputPath);
    console.log(`${output}\t${width} × ${height}\t${size.toLocaleString()} bytes`);
  }
}

await deriveLightArtwork();
