"use client";

import React from "react";
import { useEffect, useId, useState } from "react";

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
  const diagramId = `mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [state, setState] = useState<RenderState>({
    status: "pending",
    svg: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      try {
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: {
            background: "transparent",
            fontFamily: "var(--font-sans)",
            primaryColor: "#1e3a8a",
            primaryBorderColor: "#3b82f6",
            primaryTextColor: "#ffffff",
            lineColor: "#94a3b8",
            textColor: "#e5e7eb",
          },
        });

        const { svg } = await mermaid.render(diagramId, chart);

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
  }, [chart, diagramId]);

  return (
    <figure className={styles.root} data-mermaid-chart="true">
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
