import { expect, test, type Page } from "@playwright/test";

// #87: approved motion. Each behaviour is checked with motion allowed and with
// reduced motion, and none may hide content or shift layout.
const current = (page: Page) => page.locator("header nav a[aria-current]");
const scrollToSection = (page: Page, selector: string, offset = 0) =>
  page.evaluate(({ selector, offset }) => {
    const top = document.querySelector(selector)!.getBoundingClientRect().top + scrollY;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, top - innerHeight * 0.4 + 20 + offset);
  }, { selector, offset });

test("the nav marks the section being read, including nested talks on each layout", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/en/profile/2026/");
  await expect(current(page)).toHaveAttribute("href", "#about");
  await scrollToSection(page, "#experience");
  await expect(current(page)).toHaveAttribute("href", "#experience");
  await expect(current(page)).toHaveCount(1);
  // Desktop: the talks aside is a side column, so the centred reading point stays in projects.
  await scrollToSection(page, "#talks", 40);
  await expect(current(page)).toHaveAttribute("href", "#projects");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(current(page)).toHaveAttribute("href", "#contact");

  // Mobile: talks is stacked full width below the grid and becomes current.
  await page.setViewportSize({ width: 390, height: 844 });
  await scrollToSection(page, "#talks", 40);
  await expect(current(page)).toHaveAttribute("href", "#talks");
});

test("nav jumps glide and update the URL, while the skip link stays instant", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/en/profile/2026/");
  await page.getByRole("navigation").getByRole("link", { name: "Experience", exact: true }).click();
  // Mid-glide the target is not yet at its resting place; it arrives, and the hash is recorded.
  const early = await page.evaluate(() => document.querySelector("#experience")!.getBoundingClientRect().top);
  expect(early).toBeGreaterThan(100);
  // It settles at its 24px scroll margin, give or take the reveal's 8px rise, which
  // Chromium measures while the section is still mid-reveal as the glide starts.
  await expect.poll(() => page.evaluate(() => Math.abs(document.querySelector("#experience")!.getBoundingClientRect().top - 24) <= 8)).toBe(true);
  await expect(page).toHaveURL(/#experience$/);
  // The skip link is not a nav link: it moves focus and jumps instantly.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.keyboard.press("Shift+Tab");
  await page.getByRole("link", { name: "Skip to content" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
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
  // Nav jumps land instantly under reduced motion.
  await page.getByRole("navigation").getByRole("link", { name: "Experience", exact: true }).click();
  // scroll-margin-top is 24px, so an instant jump leaves the section 24px from the top at once.
  const landed = await page.evaluate(() => Math.abs(document.querySelector("#experience")!.getBoundingClientRect().top - 24));
  expect(landed).toBeLessThan(2);
  for (const selector of ["#experience", "#projects", "#contact"]) {
    expect(await page.locator(selector).evaluate((node) => getComputedStyle(node).animationName)).toBe("none");
  }
  const card = page.locator("#projects article").first();
  expect(await card.evaluate((node) => getComputedStyle(node).transitionDuration)).toBe("0s");
  const history = page.locator("#experience details");
  await history.locator("summary").click();
  await expect(history.locator("li").first()).toBeVisible();
});
