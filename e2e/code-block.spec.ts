import { expect, test } from "@playwright/test";
import { getCodeBlockCopy } from "../lib/i18n-code-block";

for (const locale of ["en", "zh-tw", "zh-cn", "ja"] as const) {
  const copy = getCodeBlockCopy(locale);
  const route = `/${locale}/ideas/agent-loops/`;

  test(`${locale}: keyboard copy preserves text, repeats and recovers from denial`, async ({ page }) => {
    await page.addInitScript(() => {
      const state = { values: [] as string[], reject: false };
      Object.assign(window, { clipboardTest: state });
      Object.defineProperty(navigator, "clipboard", { configurable: true, value: {
        writeText: async (text: string) => {
          if (state.reject) throw new Error("Denied by deterministic fixture");
          state.values.push(text);
        },
      } });
    });
    await page.goto(route);
    const blocks = page.locator("[data-code-block]");
    expect(await blocks.count()).toBeGreaterThan(1);
    let copies = 0;
    for (const block of await blocks.all()) {
      const button = block.getByRole("button", { name: copy.copy });
      const text = await block.locator("code").textContent();
      await button.focus();
      await page.keyboard.press("Enter");
      await expect(block.getByRole("status")).toHaveText(copy.success);
      await expect(button).toBeFocused();
      copies += 1;
      expect(await page.evaluate(() => (window as unknown as { clipboardTest: { values: string[] } }).clipboardTest.values.at(-1))).toBe(text);
      await page.keyboard.press("Space");
      copies += 1;
      await expect.poll(() => page.evaluate(() => (window as unknown as { clipboardTest: { values: string[] } }).clipboardTest.values.length)).toBe(copies);
    }
    const first = blocks.first();
    await page.evaluate(() => { (window as unknown as { clipboardTest: { reject: boolean } }).clipboardTest.reject = true; });
    await first.getByRole("button").click();
    await expect(first.getByRole("status")).toHaveText(copy.failure);
    await expect(first.getByRole("button")).toBeFocused();
    await page.evaluate(() => { (window as unknown as { clipboardTest: { reject: boolean } }).clipboardTest.reject = false; });
    await first.getByRole("button").click();
    await expect(first.getByRole("status")).toHaveText(copy.success);
    await expect(page.locator("[data-mermaid-chart] [data-code-block]")).toHaveCount(0);
  });

  test(`${locale}: missing clipboard and out-of-order requests never report stale success`, async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined }));
    await page.goto(route);
    const block = page.locator("[data-code-block]").first();
    const button = block.getByRole("button");
    await button.click();
    await expect(block.getByRole("status")).toHaveText(copy.failure);
    await page.evaluate(() => {
      const pending: { resolve: () => void; reject: () => void }[] = [];
      Object.assign(window, { pendingCopies: pending });
      Object.defineProperty(navigator, "clipboard", { configurable: true, value: {
        writeText: () => new Promise<void>((resolve, reject) => pending.push({ resolve, reject: () => reject(new Error("denied")) })),
      } });
    });
    await button.click();
    await expect(block.getByRole("status")).toBeEmpty();
    await button.click();
    await page.evaluate(() => (window as unknown as { pendingCopies: { reject: () => void }[] }).pendingCopies[1].reject());
    await expect(block.getByRole("status")).toHaveText(copy.failure);
    await page.evaluate(() => (window as unknown as { pendingCopies: { resolve: () => void }[] }).pendingCopies[0].resolve());
    await expect(block.getByRole("status")).toHaveText(copy.failure);
    await expect(button).toBeFocused();
    await button.click();
    await page.evaluate(() => (window as unknown as { pendingCopies: { resolve: () => void }[] }).pendingCopies[2].resolve());
    await expect(block.getByRole("status")).toHaveText(copy.success);
    await button.click();
    // Unmount the article with an unresolved request, then settle it.
    await page.locator('a[href="/' + locale + '/ideas/"]').first().click();
    await expect(page.locator("[data-code-block]")).toHaveCount(0);
    await page.evaluate(() => (window as unknown as { pendingCopies: { resolve: () => void }[] }).pendingCopies[3].resolve());
    await expect(page.getByText(copy.success, { exact: true })).toHaveCount(0);
  });

  test(`${locale}: no-JavaScript text stays selectable, scrollable and print-safe`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(baseURL + route);
    const blocks = page.locator("[data-code-block]");
    await expect(blocks.first()).toBeVisible();
    await expect(blocks.getByRole("button")).toHaveCount(0);
    await expect(blocks.first()).toContainText(copy.plain);
    const code = blocks.locator("pre").first();
    await expect(code).toHaveCSS("overflow-x", "auto");
    expect(await code.textContent()).not.toBe("");
    await code.evaluate((el) => { el.textContent = "long_".repeat(200); });
    expect(await code.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
    await page.emulateMedia({ media: "print" });
    await expect(code).toHaveCSS("white-space", "pre-wrap");
    expect(await code.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
    await context.close();
  });
}
