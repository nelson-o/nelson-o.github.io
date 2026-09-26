// Which 2026 section the reader is on, for the header nav's aria-current (#87).
// Sections can nest (#talks sits inside #projects), so the innermost section
// containing the reading point wins. The point is centred horizontally, so a
// side column (the talks aside on desktop) only wins when it spans the centre.
export type SectionBox = { id: string; top: number; bottom: number; left: number; right: number };

export const readingLine = 0.4;

export function currentSection(boxes: SectionBox[], viewport: { width: number; height: number }, atPageEnd: boolean) {
  if (boxes.length === 0) return null;
  // The last section cannot always scroll up to the reading line; at the end of the page it is current.
  if (atPageEnd) return boxes[boxes.length - 1].id;
  const x = viewport.width / 2, y = viewport.height * readingLine;
  const containing = boxes.filter((box) => box.top <= y && y < box.bottom && box.left <= x && x < box.right);
  if (containing.length) {
    return containing.reduce((inner, box) => (box.bottom - box.top < inner.bottom - inner.top ? box : inner)).id;
  }
  // Between sections: the last one whose top has passed the line, or none above the first.
  const passed = boxes.filter((box) => box.top <= y);
  return passed.length ? passed[passed.length - 1].id : null;
}
