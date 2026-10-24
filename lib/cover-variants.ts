// Shared by the browser-safe image component and the build-time generator.
export const coverWidths = [160, 320, 480, 640, 960, 1200] as const;

export function coverSrcSet(prefix: string) {
  return coverWidths.map((width) => `${prefix}-${width}.webp ${width}w`).join(", ");
}
