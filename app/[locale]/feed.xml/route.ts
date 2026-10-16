import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { buildFeedXml } from "@/lib/feed";

export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return new Response(buildFeedXml(locale), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
