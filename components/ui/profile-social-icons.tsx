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
  // Foot shape defined once; positioned via <g transform> for each foot.
  // Both feet have big toe facing inward (toward each other), like a walking pair.
  const foot = (
    <>
      <path d="M11 21c-2.8 0-4.5-2.2-4.5-5.2 0-2.2.8-4.8 2.1-6.3.7-.8 1.5-1.2 2.4-1.2s1.7.4 2.4 1.2c1.3 1.5 2.1 4.1 2.1 6.3 0 3-1.7 5.2-4.5 5.2z" />
      <circle cx="8.8" cy="8.2" r="1.3" />
      <circle cx="11.2" cy="6.8" r="1.2" />
      <circle cx="13.6" cy="6.9" r="1.1" />
      <circle cx="15.7" cy="8" r="1" />
      <circle cx="16.8" cy="9.7" r="0.9" />
    </>
  );
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className}>
      {/* Left foot — lower-left, mirrored so big toe faces right (inward) */}
      <g transform="translate(11.5, 9.5) scale(-0.45, 0.45)">{foot}</g>
      {/* Right foot — upper-right, big toe faces left (inward) */}
      <g transform="translate(10, 1) scale(0.45)">{foot}</g>
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
