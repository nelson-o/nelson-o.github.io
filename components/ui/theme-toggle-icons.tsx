import React from "react";

export function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4.25" fill="currentColor" />
      <g stroke="currentColor" strokeLinecap="round" strokeWidth="1.75">
        <path d="M12 2.5v2.25" />
        <path d="M12 19.25v2.25" />
        <path d="M21.5 12h-2.25" />
        <path d="M4.75 12H2.5" />
        <path d="M18.72 5.28l-1.6 1.6" />
        <path d="M6.88 17.12l-1.6 1.6" />
        <path d="M18.72 18.72l-1.6-1.6" />
        <path d="M6.88 6.88l-1.6-1.6" />
      </g>
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M14.4 3.2c-1.35 0-2.67.33-3.84.95a8.9 8.9 0 1 0 9.3 14.96 6.9 6.9 0 0 1-5.46-6.76c0-2.7 1.58-5.13 4.03-6.22a8.84 8.84 0 0 0-4.07-2.95Z"
        fill="currentColor"
      />
      <path
        d="M18.65 4.35l.42 1.05 1.06.42-1.06.42-.42 1.05-.41-1.05-1.06-.42 1.06-.42.41-1.05Z"
        fill="currentColor"
      />
    </svg>
  );
}
