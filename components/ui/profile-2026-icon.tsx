import React from "react";

const paths = {
  platform: "M12 2 3 7v10l9 5 9-5V7L12 2ZM3 7l9 5 9-5M12 12v10M7.5 4.5l9 5",
  chart: "M3 21h18M5 17v-5h3v5M11 17V8h3v9M17 17V3h3v14",
  people: "M16 21v-3a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v3M22 21v-3a4 4 0 0 0-3-3.87M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 2a4 4 0 0 1 0 8",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  arrow: "M4 12h16M14 6l6 6-6 6",
  code: "m8 6-6 6 6 6M16 6l6 6-6 6M14 3l-4 18",
  talk: "M4 3h16v13H4V3ZM8 21l4-5 4 5M8 7h8M8 11h5",
  award: "m12 2 3 4 5 1-1 5 1 5-5 1-3 4-3-4-5-1 1-5-1-5 5-1 3-4ZM9 12l2 2 4-4",
};

export function Profile2026Icon({ name, className }: { name: keyof typeof paths; className?: string }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
