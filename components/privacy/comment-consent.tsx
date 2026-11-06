"use client";

import React, { useState, useSyncExternalStore, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { consentStatus, hasConsent, requestComments, serverConsentStatus, subscribeConsent } from "@/lib/privacy/consent";
import { commentsUnavailableCopy, privacyCopy } from "@/lib/privacy/copy";
import styles from "./privacy.module.css";

export function CommentConsent({ locale, children }: { locale: Locale; children?: ReactNode }) {
  const copy = privacyCopy[locale];
  const allowed = useSyncExternalStore(subscribeConsent, () => hasConsent("preferences"), () => false);
  const status = useSyncExternalStore(subscribeConsent, consentStatus, serverConsentStatus);
  const [requested, setRequested] = useState(false);
  const discussion = <a href="https://github.com/nelson-o/nelson-o.github.io/discussions" rel="noreferrer">{copy.discussion}</a>;
  if (allowed && requested) return <>{children}<p className={styles.discussion}>{discussion}</p></>;
  return (
    <section className={styles.comments} data-comment-consent>
      {status === "unavailable" ? <p>{commentsUnavailableCopy[locale]}</p> : <>
        <p>{copy.comments}</p>
        <button type="button" disabled={status !== "ready"} onClick={() => setRequested(requestComments())}>{copy.load}</button>
      </>}
      {discussion}
    </section>
  );
}
