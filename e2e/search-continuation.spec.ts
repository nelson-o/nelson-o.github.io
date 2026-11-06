import { expect, test } from "@playwright/test";
import { getSiteSearchCopy } from "../lib/i18n-site-search";
import { searchEntries } from "../lib/site-search";

for (const locale of ["en", "zh-tw", "zh-cn", "ja"] as const) for (const count of [0, 1, 20, 21, 45]) {
  test(`${locale} ${count}: every match is reachable in ranked order`, async ({ page }) => {
    const copy = getSiteSearchCopy(locale);
    const entries = Array.from({ length: count }, (_, index) => ({
      url: `/${locale}/ideas/fixture-${index}/`, title: `${index % 2 ? "Match " : ""}Fixture ${index}`,
      summary: "Match continuation fixture", tags: [],
    }));
    const ranked = searchEntries(entries, "Match");
    await page.setViewportSize({ width: 320, height: 700 });
    await page.route(`**/${locale}/search-index.json`, (route) => route.fulfill({ json: entries }));
    await page.goto(`/${locale}/`);
    const trigger = page.getByRole("button", { name: copy.title, exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog"), input = dialog.getByRole("searchbox");
    await input.fill("Match");
    const links = dialog.getByRole("link"), more = dialog.getByRole("button", { name: copy.more, exact: true });
    let shown = Math.min(count, 20);
    await expect(links).toHaveCount(shown);
    await expect(dialog.getByRole("status")).toHaveText(count ? copy.results(shown, count) : copy.empty);
    while (shown < count) {
      // Traverse from the input/new batch start through every visible result to continuation.
      for (let step = 0; step < Math.min(20, shown) + (shown === 20 ? 1 : 0); step++) await page.keyboard.press("Tab");
      await expect(more).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(links.nth(shown)).toBeFocused();
      shown = Math.min(shown + 20, count);
      await expect(links).toHaveCount(shown);
      await expect(dialog.getByRole("status")).toHaveText(copy.results(shown, count));
    }
    await expect(more).toHaveCount(0);
    expect(await links.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")))).toEqual(ranked.map((entry) => entry.url));
    expect(await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
    for (const query of ["no-match-xyz", "   ", "Match", "Match "]) {
      await input.fill(query);
      const total = searchEntries(entries, query).length;
      await expect(links).toHaveCount(Math.min(total, 20));
      await expect(input).toBeFocused();
      await expect(dialog.getByRole("status")).toHaveText(!query.trim() ? copy.hint : total ? copy.results(Math.min(total, 20), total) : copy.empty);
    }
    await dialog.getByRole("button", { name: copy.close, exact: true }).click();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(input).toHaveValue("");
    await input.fill("Match");
    await expect(links).toHaveCount(Math.min(count, 20));
  });
}
