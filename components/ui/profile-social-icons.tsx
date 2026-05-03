import React, { useId } from "react";

function iconStops() {
  return (
    <>
      <stop offset="0%" stopColor="var(--accent)" />
      <stop offset="55%" stopColor="var(--color-text)" stopOpacity="0.9" />
      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.85" />
    </>
  );
}

type IconProps = {
  className?: string;
};

export function GitHubIcon({ className }: IconProps) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <defs>
        <linearGradient id={gradientId} x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          {iconStops()}
        </linearGradient>
      </defs>
      <path
        d="M12 4.5c-4.14 0-7.5 3.36-7.5 7.5 0 3.3 2.14 6.1 5.11 7.08.38.07.52-.16.52-.36v-1.27c-2.08.45-2.52-.88-2.52-.88-.34-.87-.83-1.1-.83-1.1-.68-.47.05-.46.05-.46.75.05 1.14.77 1.14.77.66 1.13 1.74.8 2.16.61.07-.49.26-.82.47-1.01-1.66-.19-3.41-.83-3.41-3.69 0-.81.29-1.47.76-1.99-.08-.19-.33-.96.07-2 0 0 .63-.2 2.05.76a7.1 7.1 0 0 1 3.72 0c1.42-.96 2.05-.76 2.05-.76.4 1.04.15 1.81.07 2 .47.52.76 1.18.76 1.99 0 2.87-1.75 3.5-3.42 3.69.27.23.51.68.51 1.38v2.06c0 .2.14.43.52.36A7.5 7.5 0 0 0 19.5 12c0-4.14-3.36-7.5-7.5-7.5Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
}

export function FootprintIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" />
      <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" />
      <path d="M16 17h4" />
      <path d="M4 13h4" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <defs>
        <linearGradient id={gradientId} x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          {iconStops()}
        </linearGradient>
      </defs>
      <path
        d="M6.5 7.25A1.75 1.75 0 1 1 6.5 4a1.75 1.75 0 0 1 0 3.25ZM5.1 20h2.8V9.09H5.1V20ZM10.27 9.09h2.68v1.49h.04c.37-.7 1.27-1.44 2.61-1.44 2.8 0 3.32 1.84 3.32 4.23V20h-2.8v-4.82c0-1.15-.02-2.63-1.6-2.63-1.61 0-1.86 1.26-1.86 2.55V20h-2.8V9.09Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
}
