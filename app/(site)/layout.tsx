import Link from "next/link";

import { ThemeToggle } from "@/components/ui/theme-toggle";

const navigation = [
  { href: "/systems", label: "Systems" },
  { href: "/work", label: "Work" },
  { href: "/ideas", label: "Ideas" },
  { href: "/lab", label: "Lab" },
];

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div>
          <Link href="/" className="site-title">
            Nelson Lin
          </Link>
          <p className="site-tagline">
            Frontend systems, platform thinking, and the operating decisions behind engineering work.
          </p>
        </div>

        <nav className="site-nav" aria-label="Primary">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </header>

      {children}

      <footer className="site-footer">
        Built with static export for GitHub Pages. Writing-first, infra-light, meant to accumulate.
      </footer>
    </div>
  );
}
