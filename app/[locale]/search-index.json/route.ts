import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { getLatestEntries } from "@/lib/mdx/content";
import { tags } from "@/lib/taxonomy";
import type { SearchEntry } from "@/lib/site-search";

export const dynamic = "force-static";
export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const entries: SearchEntry[] = getLatestEntries(locale, Infinity).map((entry) => ({
    url: `/${locale}/${entry.section}/${entry.slug}/`,
    title: entry.title,
    summary: entry.summary,
    tags: (entry.tags ?? []).map((id) => tags[id][locale]),
  }));
  return Response.json(entries);
}
