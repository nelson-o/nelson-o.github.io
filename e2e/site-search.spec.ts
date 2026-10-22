import { expect, test } from "@playwright/test";
import { getSiteSearchCopy } from "../lib/i18n-site-search";

for (const locale of ["en", "zh-tw", "zh-cn", "ja"] as const) for (const width of [320, 390, 768, 1280]) {
  test(`${locale} ${width}: lazy search, keyboard containment and results`, async ({ page }) => {
    const copy = getSiteSearchCopy(locale), scripts = new Set<string>(), indexes: string[] = [];
    page.on("request", (request) => { if (request.url().endsWith(".js")) scripts.add(request.url()); });
    const scriptBodies = () => Promise.all([...scripts].map(async (url) => (await page.request.get(url)).text()));
    page.on("request", (request) => { if (request.url().includes("search-index.json")) indexes.push(request.url()); });
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ["light", "dark"]) {
      await page.goto(`/${locale}/?theme=${theme}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const trigger = page.getByRole("button", { name: copy.title, exact: true });
      if (theme === "light") {
        expect(indexes).toEqual([]);
        expect((await scriptBodies()).join("\n")).not.toContain("Search index unavailable");
      }
      await trigger.focus();
      await page.keyboard.press("/");
      const dialog = page.getByRole("dialog", { name: copy.title });
      const input = dialog.getByRole("searchbox");
      await expect(input).toBeFocused();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await input.fill(locale === "en" ? "agent" : locale === "ja" ? "エージェント" : "工程");
      await expect(dialog.getByRole("listitem").first()).toBeVisible();
      await expect(dialog.getByRole("status")).toContainText(/\d/);
      expect(indexes.every((url) => url.includes(`/${locale}/search-index.json`))).toBe(true);
      expect((await scriptBodies()).join("\n")).toContain("Search index unavailable");
      await input.fill("no-match-zzzzzz");
      await expect(dialog.getByRole("status")).toHaveText(copy.empty);
      await input.fill("");
      await expect(dialog.getByRole("status")).toHaveText(copy.hint);
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
      await page.keyboard.press("Control+k");
      await expect(input).toBeFocused();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await input.fill(locale === "en" ? "agent" : locale === "ja" ? "エージェント" : "工程");
      const result = dialog.getByRole("link").first();
      await expect(result).toBeVisible();
      const url = await result.getAttribute("href");
      await result.click();
      await expect(page).toHaveURL(new RegExp(`${url}$`));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  });
}

test("closing during lazy import or index fetch stays closed, and failed indexes can retry", async ({ page }) => {
  await page.goto("/en/");
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/_next/static/chunks/*.js", async (route) => { await gate; await route.continue(); });
  await page.getByRole("button", { name: "Search posts", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Search posts" })).toBeVisible();
  await page.keyboard.press("Escape");
  release();
  await expect(page.getByRole("dialog", { name: "Search posts" })).not.toBeVisible();
  await page.unroute("**/_next/static/chunks/*.js");
  let fail = true;
  await page.route("**/en/search-index.json", async (route) => { if (fail) await route.fulfill({ status: 503, body: "unavailable" }); else await route.continue(); });
  await page.keyboard.press("Meta+k");
  await expect(page.getByRole("status")).toHaveText("Search could not load.");
  fail = false;
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("status")).toHaveText("Search titles, summaries and topics.");
  const input = page.getByRole("searchbox");
  await input.fill("/");
  await page.keyboard.press("Control+k");
  await expect(input).toHaveValue("/");
  await page.keyboard.press("Escape");
  await page.goto("/zh-tw/");
  await page.getByRole("button", { name: "搜尋文章", exact: true }).click();
  await expect(page.getByRole("searchbox")).toBeFocused();
  await page.keyboard.press("Escape");
  await page.keyboard.press("/");
  await expect(page.getByRole("dialog", { name: "搜尋文章" })).toBeVisible();
  await page.getByRole("searchbox").fill("程式碼");
  await expect(page.getByRole("listitem").first()).toBeVisible();
  expect(await page.getByRole("dialog").getByRole("link").first().getAttribute("href")).toMatch(/^\/zh-tw\//);
});


test("closing a pending index cannot reopen search or retain a stale request", async ({ page }) => {
  await page.goto("/en/");
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/en/search-index.json", async (route) => { await gate; await route.continue().catch(() => {}); });
  await page.getByRole("button", { name: "Search posts", exact: true }).click();
  await expect(page.getByRole("searchbox")).toBeFocused();
  await expect(page.getByRole("status")).toHaveText("Loading search…");
  await page.keyboard.press("Escape");
  release();
  await expect(page.getByRole("dialog", { name: "Search posts" })).not.toBeVisible();
  await page.unroute("**/en/search-index.json");
  await page.getByRole("button", { name: "Search posts", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Search titles, summaries and topics.");
  await page.keyboard.press("Escape");
  await page.evaluate(() => {
    const editor = document.createElement("div"); editor.contentEditable = "true"; document.body.append(editor); editor.focus();
  });
  await page.keyboard.press("/");
  await expect(page.getByRole("dialog", { name: "Search posts" })).not.toBeVisible();
});
