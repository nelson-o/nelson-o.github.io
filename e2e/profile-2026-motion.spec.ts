import { expect, test, type Page } from "@playwright/test";

// #87: approved motion. Each behaviour is checked with motion allowed and with
// reduced motion, and none may hide content or shift layout.
const current = (page: Page) => page.locator("header nav a[aria-current]");
const scrollTo = (page: Page, selector: string, offset = 0) =>
  page.evaluate(({ selector, offset }) => {
    const top = document.querySelector(selector)!.getBoundingClientRect().top + scrollY;
    document.documentElement.style.scrollBehavior = "auto";
    scrollTo(0, top - innerHeight * 0.4 + 20 + offset);
  }, { selector, offset });

test("the nav marks the section being read, including nested talks on each layout", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/en/profile/2026/");
  await expect(current(page)).toHaveAttribute("href", "#about");
  await scrollTo(page, "#experience");
  await expect(current(page)).toHaveAttribute("href", "#experience");
  await expect(current(page)).toHaveCount(1);
  // Desktop: the talks aside is a side column, so the centred reading point stays in projects.
  await scrollTo(page, "#talks", 40);
  await expect(current(page)).toHaveAttribute("href", "#projects");
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await expect(current(page)).toHaveAttribute("href", "#contact");

  // Mobile: talks is stacked full width below the grid and becomes current.
  await page.setViewportSize({ width: 390, height: 844 });
  await scrollTo(page, "#talks", 40);
  await expect(current(page)).toHaveAttribute("href", "#talks");
});

test("cards give the same feedback on hover and keyboard focus", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/en/profile/2026/");
  const card = page.locator("#projects article").first();
  const lift = () => card.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m42);
  await card.scrollIntoViewIfNeeded();
  await expect.poll(lift).toBe(0);
  await card.hover();
  await expect.poll(lift).toBe(-2);
  await page.mouse.move(0, 0);
  await expect.poll(lift).toBe(0);
  await card.locator("summary").focus();
  await expect.poll(lift).toBe(-2);
});

test("sections are fully shown once scrolled in, and nothing shifts layout", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/en/profile/2026/");
  await page.evaluate(() => {
    (window as unknown as { shift: number }).shift = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
        if (!entry.hadRecentInput) (window as unknown as { shift: number }).shift += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  const supported = await page.evaluate(() => CSS.supports("animation-timeline: view()"));
  for (const selector of ["#experience", "#projects", "#contact"]) {
    const section = page.locator(selector);
    await section.scrollIntoViewIfNeeded();
    await page.evaluate((s) => document.querySelector(s)!.scrollIntoView({ block: "center", behavior: "instant" }), selector);
    expect(await section.evaluate((node) => getComputedStyle(node).animationName)).toMatch(supported ? /reveal/ : /^none$/);
    await expect.poll(() => section.evaluate((node) => Number(getComputedStyle(node).opacity))).toBe(1);
  }
  await page.locator("#projects article").first().hover();
  await page.locator("#experience details > summary").click();
  await page.waitForTimeout(400);
  // layout-shift entries exist only in Chromium.
  if (browserName === "chromium") expect(await page.evaluate(() => (window as unknown as { shift: number }).shift)).toBeLessThan(0.01);
});

test("reduced motion turns every approved effect off", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en/profile/2026/");
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  for (const selector of ["#experience", "#projects", "#contact"]) {
    expect(await page.locator(selector).evaluate((node) => getComputedStyle(node).animationName)).toBe("none");
  }
  const card = page.locator("#projects article").first();
  expect(await card.evaluate((node) => getComputedStyle(node).transitionDuration)).toBe("0s");
  const history = page.locator("#experience details");
  await history.locator("summary").click();
  await expect(history.locator("li").first()).toBeVisible();
});
