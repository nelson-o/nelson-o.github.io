import React from "react";

export function CogIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M10.25 4.31c.92-.2 1.76-.2 2.68 0l.39 1.95c.48.15.93.36 1.34.62l1.85-.92c.72.58 1.3 1.16 1.88 1.88l-.92 1.85c.26.41.47.86.62 1.34l1.95.39c.2.92.2 1.76 0 2.68l-1.95.39c-.15.48-.36.93-.62 1.34l.92 1.85c-.58.72-1.16 1.3-1.88 1.88l-1.85-.92c-.41.26-.86.47-1.34.62l-.39 1.95c-.92.2-1.76.2-2.68 0l-.39-1.95c-.48-.15-.93-.36-1.34-.62l-1.85.92c-.72-.58-1.3-1.16-1.88-1.88l.92-1.85c-.26-.41-.47-.86-.62-1.34l-1.95-.39c-.2-.92-.2-1.76 0-2.68l1.95-.39c.15-.48.36-.93.62-1.34l-.92-1.85c.58-.72 1.16-1.3 1.88-1.88l1.85.92c.41-.26.86-.47 1.34-.62l.39-1.95Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="2.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ThemeIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <g data-theme-icon="light"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1" /></g>
    <path data-theme-icon="dark" d="M20 15.5A9 9 0 0 1 8.5 4a9 9 0 1 0 11.5 11.5Z" />
  </svg>;
}
