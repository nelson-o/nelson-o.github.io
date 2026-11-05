import type { Page } from "@playwright/test";

export const production = "https://nelson-o.github.io";
export const testId = "G-TEST123";
const pendingRoutes = new WeakMap<Page, Set<Promise<void>>>();

export async function settlePrivacyRoutes(page: Page) {
  const pending = pendingRoutes.get(page);
  while (pending?.size) await Promise.all([...pending]);
}
export const cmpScript = `
  window.Cookiebot = {
    hasResponse: false, consent: { preferences: false, statistics: false, marketing: false },
    renew() { document.documentElement.dataset.consentRenewed = 'true'; },
    withdraw() { this.hasResponse = false; this.consent = { preferences: false, statistics: false, marketing: false }; window.dispatchEvent(new Event('CookiebotOnDecline')); },
    submitCustomConsent(preferences, statistics, marketing) {
      this.hasResponse = true; this.consent = { preferences, statistics, marketing };
      sessionStorage.setItem('test-cmp', JSON.stringify(this.consent));
      window.dispatchEvent(new Event('CookiebotOnAccept'));
    }
  };
  const saved = sessionStorage.getItem('test-cmp');
  if (saved) { window.Cookiebot.hasResponse = true; window.Cookiebot.consent = JSON.parse(saved); }
  window.dispatchEvent(new Event('CookiebotOnConsentReady'));
`;

export async function privacyFixture(page: Page, baseURL: string, options: { failed?: boolean; blockedComments?: boolean; consentGate?: Promise<void> } = {}) {
  const requests: string[] = [];
  const pending = new Set<Promise<void>>();
  pendingRoutes.set(page, pending);
  page.on("request", (request) => requests.push(request.url()));
  // Keep a deny-all fallback even while page routes drain during teardown.
  await page.context().route("**/*", (route) => route.abort());
  await page.route("**/*", (route) => {
    const task = (async () => {
      const url = new URL(route.request().url());
      if (url.origin === production) {
        const response = await route.fetch({ url: `${baseURL}${url.pathname}${url.search}` });
        await route.fulfill({ status: response.status(), headers: response.headers(), body: await response.body() });
      } else if (url.hostname === "consent.cookiebot.com") {
        await options.consentGate;
        if (options.failed) await route.abort();
        else await route.fulfill({ contentType: "text/javascript", body: cmpScript });
      } else if (url.hostname === "www.googletagmanager.com") {
        await route.fulfill({ contentType: "text/javascript", body: `
          const capture = (entry) => {
            const all = JSON.parse(sessionStorage.getItem('test-ga-commands') || '[]');
            all.push(Array.from(entry)); sessionStorage.setItem('test-ga-commands', JSON.stringify(all));
          };
          window.dataLayer.forEach(capture);
          window.dataLayer.push = function(entry) { capture(entry); return Array.prototype.push.call(this, entry); };
        ` });
      } else if (url.hostname === "giscus.app") {
        if (options.blockedComments) await route.abort();
        else await route.fulfill({ contentType: "text/html", body: "<!doctype html><p>Comments fixture</p>" });
      } else await route.abort();
    })();
    pending.add(task);
    return task.finally(() => pending.delete(task));
  });
  return requests;
}

export async function commands(page: Page) {
  return page.evaluate(() => JSON.parse(sessionStorage.getItem("test-ga-commands") ?? "[]") as unknown[][]);
}
export async function consent(page: Page, statistics: boolean, preferences = false) {
  await page.waitForFunction(() => typeof window.Cookiebot?.submitCustomConsent === "function");
  await page.evaluate(({ statistics, preferences }) => {
    window.Cookiebot!.submitCustomConsent(preferences, statistics, false);
  }, { statistics, preferences });
}
