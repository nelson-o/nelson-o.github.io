import { expect, test } from "@playwright/test";
import { profileLocales } from "../lib/profile-locales";
import { THEME_STORAGE_KEY } from "./fixtures";

// Every locale is a longest-string fixture: German and Vietnamese carry the widest labels today.
for (const theme of ["light", "dark"] as const) {
  test(`translated strings fit without overlap or clipping in ${theme} theme`, async ({ page }) => {
    await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: THEME_STORAGE_KEY, value: theme });
    for (const locale of profileLocales) {
      await page.goto(`/${locale}/profile/2026/`);
      for (const width of [1280, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        const layout = await page.evaluate(() => {
          const box = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
          const apart = (a: DOMRect, b: DOMRect) => a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top;
          const lines = (node: Element) => {
            const range = document.createRange();
            range.selectNodeContents(node);
            return new Set([...range.getClientRects()].map((rect) => Math.round(rect.top))).size;
          };
          const headline = document.querySelector("#profile-headline")!;
          const nav = box("header nav");
          return {
            header: apart(box("header > a"), nav),
            headline: headline.scrollWidth <= headline.clientWidth,
            // The history control is painted over its reserved twin, so the heading text must end first.
            history: (() => {
              const range = document.createRange();
              range.selectNodeContents(document.querySelector("#experience-heading")!.firstChild!);
              return range.getBoundingClientRect().right <= box("#experience summary").left;
            })(),
            motto: (() => {
              const words = [...document.querySelectorAll("#experience aside ol li")];
              return words.length > 0 && words.every((item) => lines(item) === 1);
            })(),
            page: document.documentElement.scrollWidth <= innerWidth,
          };
        });
        expect(layout, `${locale} at ${width}px`).toEqual({ header: true, headline: true, history: true, motto: true, page: true });
      }
    }
  });
}
