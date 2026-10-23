import { expect, test, type Locator } from "@playwright/test";

async function expectLabelsFit(figure: Locator) {
  const labels = await figure.locator("foreignObject").evaluateAll((nodes) => nodes
    .filter((node) => node.textContent?.trim())
    .map((node) => {
      const box = node.getBoundingClientRect();
      const content = node.firstElementChild!.getBoundingClientRect();
      return { text: node.textContent, overflow: content.right - box.right, vertical: content.bottom - box.bottom };
    }));
  expect(labels.length).toBeGreaterThan(0);
  for (const label of labels) {
    expect(label.overflow, label.text ?? "label").toBeLessThanOrEqual(0.5);
    expect(label.vertical, label.text ?? "label").toBeLessThanOrEqual(0.5);
  }
}

const examples = {
  en: ["Agent loop runtime", "Validation passed?"],
  "zh-tw": ["Agent 循環執行時", "驗證通過了嗎？"],
  "zh-cn": ["Agent 循环运行时", "验证通过了吗？"],
  ja: ["エージェントループ実行基盤", "検証は通ったか？"],
};
for (const [locale, labels] of Object.entries(examples)) for (const theme of ["light", "dark"]) {
  test(`${locale} ${theme}: cold icon labels fit after a delayed font, on screen and paper`, async ({ page }) => {
    let release!: () => void;
    let requested = false;
    const font = new Promise<void>((resolve) => { release = resolve; });
    await page.route("**/fa-solid-900.woff2", async (route) => {
      requested = true;
      await font;
      await route.continue();
    });
    try {
      await page.goto(`/${locale}/ideas/agent-loops/?theme=${theme}`, { waitUntil: "domcontentloaded" });
      const figure = page.locator("[data-mermaid-chart]").first();
      await expect.poll(() => requested).toBe(true);
      await expect(figure.locator("pre")).toBeVisible();
      await expect(figure.locator("svg")).toHaveCount(0);
      await figure.locator(":scope > div").focus();
      release();
      await expect(figure.locator("svg")).toBeVisible();
      await expect(figure.locator(":scope > div")).toBeFocused();
      await page.evaluate(() => document.fonts.ready);
      for (const width of [390, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        await expectLabelsFit(figure);
      }
      await page.emulateMedia({ media: "print" });
      await expectLabelsFit(figure);
      for (const label of labels) await expect(figure.locator(".nodeLabel").filter({ hasText: label })).toHaveText(label);
      await page.emulateMedia({ media: "screen" });
      await page.goto(`/${locale}/ideas/250610-agentic-delivery-loop/?theme=${theme}`);
      const localized = page.locator("[data-mermaid-chart]");
      await expect(localized.locator("svg")).toBeVisible();
      await expectLabelsFit(localized);
      await page.emulateMedia({ media: "print" });
      await expectLabelsFit(localized);
    } finally {
      release();
    }
  });
}

test("an unavailable icon font retains the diagram with stable fallback label bounds", async ({ page }) => {
  await page.route("**/fa-solid-900.woff2", (route) => route.abort());
  await page.goto("/en/ideas/agent-loops/?theme=dark");
  const figure = page.locator("[data-mermaid-chart]").first();
  await expect(figure.locator("svg")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expectLabelsFit(figure);
  await expect(figure.locator("svg")).toContainText("Validation passed?");
});
