import { test, expect } from "@playwright/test";
import { EN } from "./fixtures";

test.describe("Article page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/systems/platform-surfaces");
  });

  test("renders article h1 with content @smoke", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("renders body content", async ({ page }) => {
    await expect(page.locator("article")).toContainText("platform");
  });

  test("site title link navigates to /en/profile", async ({ page }) => {
    await page.getByRole("link", { name: EN.siteTitle }).click();
    await expect(page).toHaveURL(/\/en\/profile\/?/);
  });
});

test("agentic delivery loop article renders mermaid content @smoke", async ({ page }) => {
  await page.goto("/en/ideas/250610-agentic-delivery-loop");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A delivery loop for agentic engineering",
  );
  await expect(page.locator("article")).toContainText("spec-first delivery loop");
  await expect(page.locator("[data-mermaid-chart='true']")).toBeVisible();
});

test("agentic delivery loop article renders zh-tw version", async ({ page }) => {
  await page.goto("/zh-tw/ideas/250610-agentic-delivery-loop");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("代理工程的交付迴圈");
  await expect(page.locator("article")).toContainText("規格優先");
  await expect(page.locator("[data-mermaid-chart='true']")).toBeVisible();
});

const diagramTitles = {
  en: "Agentic engineering delivery loop",
  "zh-tw": "代理工程的交付迴圈",
  "zh-cn": "代理工程的交付循环",
  ja: "エージェントエンジニアリングのデリバリーループ",
};

for (const [locale, title] of Object.entries(diagramTitles)) {
  test(`${locale} diagram has native accessible text after theme changes`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto(`/${locale}/ideas/250610-agentic-delivery-loop/`);
    const diagram = page.locator("[data-mermaid-chart] svg");
    // Read the authored description, but independently pin the localized title.
    const source = await import("node:fs/promises").then((fs) =>
      fs.readFile(`content/${locale}/ideas/250610-agentic-delivery-loop.mdx`, "utf8"),
    );
    const description = source.match(/accDescr: (.+)/)?.[1];
    expect(description).toBeTruthy();
    let previousId: string | null = null;
    for (const theme of ["light", "dark", "light"] as const) {
      await page.emulateMedia({ colorScheme: theme });
      await expect(page.locator("html")).toHaveClass(new RegExp(`theme-${theme}`));
      await expect(diagram).toBeVisible();
      if (previousId) await expect(diagram).not.toHaveAttribute("id", previousId);
      await expect(diagram).toHaveAccessibleName(title);
      await expect(diagram).toHaveAccessibleDescription(description!);
      await expect(diagram.locator(":scope > title")).toHaveText(title);
      await expect(diagram.locator(":scope > desc")).toHaveText(description!);
      const references = await diagram.evaluate((svg) =>
        ["aria-labelledby", "aria-describedby"].map((attribute) => {
          const ids = svg.getAttribute(attribute)?.trim().split(/\s+/) ?? [];
          return ids.length > 0 && ids.every((id) => {
            const matches = document.querySelectorAll(`[id="${CSS.escape(id)}"]`);
            return matches.length === 1 && matches[0].parentElement === svg;
          });
        }),
      );
      expect(references).toEqual([true, true]);
      await expect(page.locator("[data-mermaid-chart] [aria-label]")).toHaveCount(0);
      await expect(page.locator("[data-mermaid-chart] pre")).toHaveCount(0);
      previousId = await diagram.getAttribute("id");
    }
  });

  test(`${locale} diagram retains its source without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`/${locale}/ideas/250610-agentic-delivery-loop/`);
    await expect(page.locator("[data-mermaid-chart] pre code")).toContainText("flowchart TD");
    await expect(page.locator("[data-mermaid-chart] svg")).toHaveCount(0);
    await context.close();
  });
}
