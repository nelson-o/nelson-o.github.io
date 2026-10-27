"use client";

import React from "react";
import { useEffect, useId, useRef, useState } from "react";

import { getMermaidPalette } from "@/lib/mermaid-palette";
import styles from "@/components/ui/mermaid-block.module.css";

type MermaidBlockProps = {
  chart: string;
};

type RenderState =
  | { status: "pending"; svg: null; error: null }
  | { status: "ready"; svg: string; error: null }
  | { status: "error"; svg: null; error: string };

export function MermaidBlock({ chart }: MermaidBlockProps) {
  const reactId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const diagramId = `mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [themeVersion, setThemeVersion] = useState(0);
  const [state, setState] = useState<RenderState>({
    status: "pending",
    svg: null,
    error: null,
  });

  useEffect(() => {
    const root = document.documentElement;
    const readPalette = () => JSON.stringify(getMermaidPalette(getComputedStyle(rootRef.current ?? root)));
    let palette = readPalette();
    const observer = new MutationObserver(() => {
      const nextPalette = readPalette();
      if (nextPalette === palette) return;
      palette = nextPalette;
      setThemeVersion((version) => version + 1);
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class", "data-theme-preference", "style"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      try {
        const mermaid = (await import("mermaid")).default;
        // Mermaid fixes label boxes during layout. Load the local icon font
        // before measuring, rather than letting inserted icons trigger it late.
        await document.fonts.ready;
        if (chart.includes("fa:fa-")) {
          await document.fonts.load('900 16px "Font Awesome 6 Free"').catch(() => undefined);
        }
        if (cancelled) return;
        const styles = getComputedStyle(rootRef.current ?? document.documentElement);
        const { background, surface, text, muted, border, accent, accentSoft } = getMermaidPalette(styles);

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: {
            background,
            mainBkg: surface,
            secondBkg: background,
            tertiaryColor: accentSoft,
            fontFamily: "var(--font-sans)",
            primaryColor: accentSoft,
            primaryBorderColor: accent,
            primaryTextColor: text,
            secondaryColor: background,
            secondaryBorderColor: border,
            secondaryTextColor: text,
            tertiaryBorderColor: border,
            tertiaryTextColor: text,
            lineColor: muted,
            textColor: text,
            edgeLabelBackground: background,
            nodeBorder: accent,
            clusterBkg: accentSoft,
            clusterBorder: border,
            noteBkgColor: accentSoft,
            noteTextColor: text,
            noteBorderColor: border,
            actorBkg: accentSoft,
            actorBorder: accent,
            actorTextColor: text,
            signalColor: muted,
            signalTextColor: text,
          },
        });

        const { svg } = await mermaid.render(`${diagramId}-${themeVersion}`, chart);

        if (!cancelled) {
          setState({ status: "ready", svg, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: "error",
            svg: null,
            error: error instanceof Error ? error.message : "Unable to render diagram.",
          });
        }
      }
    }

    void renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [chart, diagramId, themeVersion]);

  return (
    <figure ref={rootRef} className={styles.root} data-mermaid-chart="true">
      <div className={styles.viewport} tabIndex={0}>
        {state.status === "ready" ? (
          <div
            className={styles.diagram}
            dangerouslySetInnerHTML={{ __html: state.svg }}
          />
        ) : (
          <>
            {state.status === "error" ? <p className={styles.error}>{state.error}</p> : null}
            <pre className={styles.fallback}>
              <code className="language-mermaid">{chart}</code>
            </pre>
          </>
        )}
      </div>
    </figure>
  );
}
