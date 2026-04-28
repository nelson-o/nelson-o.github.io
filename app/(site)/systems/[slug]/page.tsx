import { notFound } from "next/navigation";

import { ArticlePage } from "@/components/layout/article-page";
import { getEntryBySlug, getStaticSlugsForSection } from "@/lib/mdx/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getStaticSlugsForSection("systems");
}

export default async function SystemsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntryBySlug("systems", slug);

  if (!entry) {
    notFound();
  }

  return <ArticlePage entry={entry} />;
}
