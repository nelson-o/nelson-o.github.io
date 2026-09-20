import { expect, test } from "@playwright/test";
import { profile2026Copy } from "../lib/profile-2026-copy";
import { settingsButton } from "./fixtures";

test("hero artwork follows locale switching on the exported profile", async ({ page }) => {
  await page.goto("/en/profile/2026/");
  for (const [locale, asset] of [["en", "en"], ["zh-tw", "zh"], ["zh-cn", "zh"], ["ja", "jp"]] as const) {
    await settingsButton(page).click();
    await page.locator("#language-select").selectOption(locale);
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(new RegExp(`/${locale}/profile/2026/?$`));
    const hero = page.locator("#about");
    const tagline = hero.getByRole("img", { name: profile2026Copy[locale].tagline, exact: true });
    await expect(tagline).toHaveAttribute("src", `/profile/2026/hero-tag.${asset}.webp`);
    await expect(tagline).toBeVisible();
    await expect(hero.locator("img")).toHaveCount(2);
    await expect.poll(() => hero.locator("img").evaluateAll((images) => images.every((image) =>
      (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0,
    ))).toBe(true);
    await expect(hero.getByRole("link", { name: profile2026Copy[locale].contact })).toHaveAttribute("href", "#contact");
  }
});
