"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { consentAvailable, hasConsent, requestComments, subscribeConsent } from "@/lib/privacy/consent";
import { privacyCopy } from "@/lib/privacy/copy";
import styles from "./privacy.module.css";

export function CommentConsent({ locale, children }: { locale: Locale; children: ReactNode }) {
  const copy = privacyCopy[locale];
  const allowed = useSyncExternalStore(subscribeConsent, () => hasConsent("preferences"), () => false);
  const ready = useSyncExternalStore(subscribeConsent, consentAvailable, () => false);
  const [requested, setRequested] = useState(false);
  if (allowed && requested) return <>{children}</>;
  return (
    <section className={styles.comments} data-comment-consent>
      <p>{copy.comments}</p>
      <button type="button" disabled={!ready} onClick={() => setRequested(requestComments())}>{copy.load}</button>
      {!ready && <p>{copy.unavailable}</p>}
      <a href="https://github.com/nelson-o/nelson-o.github.io/discussions" rel="noreferrer">{copy.discussion}</a>
    </section>
  );
}
