"use client";

import React, { useEffect, useRef, useState, type ReactNode } from "react";
import type { getCodeBlockCopy } from "@/lib/i18n-code-block";
import styles from "./code-block.module.css";

type Props = {
  text: string;
  language?: string;
  copy: ReturnType<typeof getCodeBlockCopy>;
  children: ReactNode;
};

export function CodeBlock({ text, language, copy, children }: Props) {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<{ message: string; request: number } | null>(null);
  const request = useRef(0);

  useEffect(() => {
    setReady(true);
    return () => { request.current += 1; };
  }, []);

  async function copyCode() {
    const current = ++request.current;
    setStatus(null);
    try {
      // Preserve the original MDX code text, including tabs and trailing newlines.
      await navigator.clipboard.writeText(text);
      if (current === request.current) setStatus({ message: copy.success, request: current });
    } catch {
      if (current === request.current) setStatus({ message: copy.failure, request: current });
    }
  }

  return (
    <div className={styles.root} data-code-block="">
      <div className={styles.toolbar}>
        <span className={styles.language}>{!language || ["txt", "text", "plaintext"].includes(language) ? copy.plain : language}</span>
        <button type="button" hidden={!ready} onClick={copyCode}>{copy.copy}</button>
      </div>
      {children}
      <div className={styles.status} role="status" aria-live="polite" aria-atomic="true">
        {status && <span key={status.request}>{status.message}</span>}
      </div>
    </div>
  );
}
