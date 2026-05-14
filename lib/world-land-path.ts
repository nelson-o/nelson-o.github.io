import { readFileSync } from "node:fs";
import { join } from "node:path";

export function getWorldLandPath(root = process.cwd()) {
  return readFileSync(join(root, "public", "data", "world-land-path.txt"), "utf-8");
}
