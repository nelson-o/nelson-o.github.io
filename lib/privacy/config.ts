export type PrivacyConfig = {
  cookiebotId: string;
  measurementId: string;
  contact: string;
  reviewed: boolean;
};

export const privacyConfig: PrivacyConfig = {
  cookiebotId: process.env.NEXT_PUBLIC_COOKIEBOT_ID ?? "",
  measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
  contact: process.env.NEXT_PUBLIC_PRIVACY_CONTACT ?? "",
  reviewed: process.env.NEXT_PUBLIC_PRIVACY_REVIEWED === "true",
};

export const productionHostname = "nelson-o.github.io";
export const consentVersion = "2026-09-28";
export const consentMaxAge = 180 * 24 * 60 * 60 * 1000;

export function consentConfigured(config: PrivacyConfig) {
  return config.reviewed && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.contact)
    && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(config.cookiebotId);
}

export function analyticsConfigured(config: PrivacyConfig) {
  return consentConfigured(config) && /^G-[A-Z0-9]+$/.test(config.measurementId);
}
