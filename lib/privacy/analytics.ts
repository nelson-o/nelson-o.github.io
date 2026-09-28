import { analyticsConfigured, type PrivacyConfig } from "./config";

export function publicLocation(href: string, allowedPaths: readonly string[]) {
  try {
    const url = new URL(href);
    return allowedPaths.includes(url.pathname) ? `${url.origin}${url.pathname}` : undefined;
  } catch { return undefined; }
}

export function outboundHost(href: string, origin: string) {
  try {
    const url = new URL(href, origin);
    return /^https?:$/.test(url.protocol) && url.origin !== origin ? url.hostname : undefined;
  } catch { return undefined; }
}

export function clearAnalyticsCookies() {
  const names = document.cookie.split(";").map((cookie) => cookie.trim().split("=")[0])
    .filter((name) => /^_ga(?:_|$)/.test(name));
  const parts = location.hostname.split(".");
  const domains = ["", ...parts.map((_, index) => `; Domain=.${parts.slice(index).join(".")}`)];
  const paths = ["/", ...location.pathname.split("/").filter(Boolean).map((_, index, all) => `/${all.slice(0, index + 1).join("/")}`)];
  for (const name of names) for (const domain of domains) for (const path of paths) {
    document.cookie = `${name}=; Max-Age=0; Path=${path}${domain}; SameSite=Lax; Secure`;
  }
}

export function createAnalytics(config: PrivacyConfig, paths: readonly string[]) {
  let active = false;
  let configured = false;
  let previousPath = "";
  const disabledKey = `ga-disable-${config.measurementId}`;
  const flags = window as unknown as Record<string, unknown>;
  const tag = (...args: unknown[]) => window.gtag?.(...args);

  function pageView() {
    const page = publicLocation(location.href, paths);
    if (!active || !page || page === previousPath) return;
    previousPath = page;
    // Update config too: automatic GA session/engagement events must use sanitized URLs.
    tag("config", config.measurementId, { page_location: page, page_referrer: "", send_page_view: false });
    tag("event", "page_view", { page_location: page, page_referrer: "", page_title: document.title });
  }

  function setEnabled(enabled: boolean) {
    if (!enabled) {
      flags[disabledKey] = true;
      active = false;
      previousPath = "";
      clearAnalyticsCookies();
      return;
    }
    if (!analyticsConfigured(config)) return;
    active = true;
    flags[disabledKey] = false;
    if (!configured) {
      configured = true;
      window.dataLayer ??= [];
      // gtag requires an Arguments object, not a nested array.
      // eslint-disable-next-line prefer-rest-params -- Google tag queues Arguments objects.
      window.gtag = function () { window.dataLayer!.push(arguments); };
      tag("consent", "default", {
        analytics_storage: "granted", ad_storage: "denied",
        ad_user_data: "denied", ad_personalization: "denied",
      });
      tag("js", new Date());
      tag("config", config.measurementId, {
        send_page_view: false, page_location: publicLocation(location.href, paths) ?? location.origin,
        page_referrer: "", allow_google_signals: false, allow_ad_personalization_signals: false,
        cookie_domain: "none", cookie_expires: 180 * 24 * 60 * 60, cookie_update: false,
      });
      const script = document.createElement("script");
      script.id = "site-google-analytics";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`;
      document.head.append(script);
    }
    pageView();
  }

  function click(event: MouseEvent) {
    const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
    const host = anchor instanceof HTMLAnchorElement ? outboundHost(anchor.href, location.origin) : undefined;
    const page = publicLocation(location.href, paths);
    if (active && host && page) tag("event", "outbound_click", { destination_host: host, page_location: page });
  }

  return { setEnabled, pageView, click };
}
