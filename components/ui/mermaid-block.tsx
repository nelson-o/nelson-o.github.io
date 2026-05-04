"use client";

import React from "react";
import { useEffect, useId, useRef, useState } from "react";

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
    const observer = new MutationObserver(() => {
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

    function getCssVariable(styles: CSSStyleDeclaration, name: string, fallback: string) {
      const value = styles.getPropertyValue(name).trim();

      if (!value) {
        return fallback;
      }

      const variableMatch = value.match(/^var\((--[^),\s]+)/);

      if (variableMatch) {
        return getCssVariable(styles, variableMatch[1], fallback);
      }

      return value;
    }

    async function renderDiagram() {
      try {
        const mermaid = (await import("mermaid")).default;
        const styles = getComputedStyle(rootRef.current ?? document.documentElement);
        const background = getCssVariable(styles, "--color-bg-elevated", "#ffffff");
        const surface = getCssVariable(styles, "--color-surface-strong", background);
        const text = getCssVariable(styles, "--color-text", "#111827");
        const muted = getCssVariable(styles, "--color-text-muted", "#4b5563");
        const border = getCssVariable(styles, "--color-border-strong", "rgba(17, 24, 39, 0.22)");
        const accent = getCssVariable(styles, "--color-accent", "#0891b2");
        const accentSoft = getCssVariable(styles, "--color-accent-soft", "rgba(8, 145, 178, 0.12)");

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
      <div className={styles.viewport}>
        {state.status === "ready" ? (
          <div
            className={styles.diagram}
            aria-label="Agentic engineering delivery loop diagram"
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
