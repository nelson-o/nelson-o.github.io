"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getHrefWithLocale, sections, type Dictionary, type Locale } from "@/lib/i18n";

export function SiteSectionLinks({ locale, labels }: { locale: Locale; labels: Dictionary["navigation"] }) {
  const pathname = usePathname()?.replace(/\/$/, "");

  return sections.map((section) => {
    const href = getHrefWithLocale(locale, `/${section}`);
    const current = pathname === href ? "page" : pathname?.startsWith(`${href}/`) ? "location" : undefined;

    return (
      <Link key={section} href={href} aria-current={current}>
        {labels[section]}
      </Link>
    );
  });
}
