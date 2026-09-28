import { consentEvents, hasConsent, setConsentReady } from "./consent";
import { consentConfigured, consentMaxAge, consentVersion, productionHostname, type PrivacyConfig } from "./config";
import { createAnalytics } from "./analytics";

const receiptKey = "nelson-consent-version";
type Receipt = { version: string; at: number; statistics: boolean; preferences: boolean };

export function validReceipt(value: unknown, now = Date.now()): value is Receipt {
  if (!value || typeof value !== "object") return false;
  const receipt = value as Receipt;
  return receipt.version === consentVersion && typeof receipt.at === "number"
    && receipt.at <= now && now - receipt.at < consentMaxAge
    && typeof receipt.statistics === "boolean" && typeof receipt.preferences === "boolean";
}

export function startPrivacy(config: PrivacyConfig, paths: readonly string[], culture: string) {
  const analytics = createAnalytics(config, paths);
  if (!consentConfigured(config) || location.hostname !== productionHostname) {
    analytics.setEnabled(false);
    return { pageView: () => {}, stop: () => {} };
  }
  let initialized = false;
  let wasAnalytics = false;
  let expiryTimer: ReturnType<typeof setTimeout> | undefined;

  function sync() {
    const cmp = window.Cookiebot;
    if (!cmp) return;
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(receiptKey) ?? "null");
      const valid = validReceipt(stored);
      if ((!initialized && cmp.hasResponse && !valid) || (initialized && stored && !valid)) {
        initialized = true;
        localStorage.removeItem(receiptKey);
        setConsentReady(false);
        analytics.setEnabled(false);
        cmp.withdraw();
        cmp.renew();
        if (wasAnalytics) location.reload();
        return;
      }
      initialized = true;
      clearTimeout(expiryTimer);
      if (cmp.hasResponse) {
        const { statistics, preferences } = cmp.consent;
        const unchanged = valid && stored.statistics === statistics && stored.preferences === preferences;
        const receipt: Receipt = { version: consentVersion, at: unchanged ? stored.at : Date.now(), statistics, preferences };
        localStorage.setItem(receiptKey, JSON.stringify(receipt));
        expiryTimer = setTimeout(sync, Math.min(consentMaxAge - (Date.now() - receipt.at), 2_147_483_647));
      }
      setConsentReady(true);
      const enabled = hasConsent("statistics");
      analytics.setEnabled(enabled);
      if (wasAnalytics && !enabled) location.reload();
      wasAnalytics = enabled;
    } catch {
      // Cannot remember/validate a choice: fail closed, including comments.
      setConsentReady(false);
      analytics.setEnabled(false);
      if (wasAnalytics) location.reload();
    }
  }

  function crossTab(event: StorageEvent) {
    if (event.key !== receiptKey && event.key !== null) return;
    setConsentReady(false);
    analytics.setEnabled(false);
    location.reload(); // Re-read the CMP cookie rather than trusting this tab's stale SDK.
  }

  consentEvents.forEach((event) => window.addEventListener(event, sync));
  window.addEventListener("storage", crossTab);
  window.addEventListener("pageshow", sync);
  document.addEventListener("click", analytics.click);
  const script = document.createElement("script");
  script.id = "Cookiebot";
  script.src = "https://consent.cookiebot.com/uc.js";
  script.dataset.cbid = config.cookiebotId;
  script.dataset.culture = culture;
  script.dataset.blockingmode = "none";
  script.dataset.consentmode = "disabled"; // Our adapter owns Consent Mode; advertising stays denied.
  script.dataset.level = "strict";
  script.dataset.type = "leveloptin";
  script.onerror = () => { setConsentReady(false); analytics.setEnabled(false); };
  document.head.append(script);

  return {
    pageView: analytics.pageView,
    stop() {
      clearTimeout(expiryTimer);
      consentEvents.forEach((event) => window.removeEventListener(event, sync));
      window.removeEventListener("storage", crossTab);
      window.removeEventListener("pageshow", sync);
      document.removeEventListener("click", analytics.click);
      setConsentReady(false);
      analytics.setEnabled(false);
      script.remove();
    },
  };
}
