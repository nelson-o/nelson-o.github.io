import { consentConfigured, privacyConfig, productionHostname } from "./config";

export type CookiebotApi = {
  consent: { preferences: boolean; statistics: boolean; marketing: boolean };
  hasResponse: boolean;
  renew: () => void;
  withdraw: () => void;
  submitCustomConsent: (preferences: boolean, statistics: boolean, marketing: boolean) => void;
};

declare global {
  interface Window {
    Cookiebot?: CookiebotApi;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const consentEvents = ["CookiebotOnConsentReady", "CookiebotOnAccept", "CookiebotOnDecline", "CookiebotOnLoad"];
export const consentChange = "site-privacy-change";
let ready = false;

export function setConsentReady(value: boolean) {
  ready = value;
  window.dispatchEvent(new Event(consentChange));
}

export function consentAvailable() {
  return ready && consentConfigured(privacyConfig) && location.hostname === productionHostname
    && !!window.Cookiebot;
}

export function hasConsent(category: "statistics" | "preferences") {
  return consentAvailable() && window.Cookiebot?.hasResponse === true
    && window.Cookiebot.consent[category] === true;
}

export function subscribeConsent(callback: () => void) {
  window.addEventListener(consentChange, callback);
  return () => window.removeEventListener(consentChange, callback);
}

export function requestComments() {
  if (!consentAvailable()) return false;
  window.Cookiebot!.submitCustomConsent(true, hasConsent("statistics"), false);
  return true;
}

export function renewConsent() {
  if (consentAvailable()) window.Cookiebot!.renew();
}
