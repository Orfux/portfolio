import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getPosts, getProjects } from "@/lib/content";
import { absUrl } from "@/lib/seo";

// Her sayfanın TR ve EN adresini, birbirlerinin karşılığı olarak listeler.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects("tr"), getPosts("tr")]);

  const pages: { path: string; lastModified?: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/about", priority: 0.9 },
    { path: "/projects", priority: 0.9 },
    { path: "/blog", priority: 0.8 },
    { path: "/sites", priority: 0.5 },
    ...projects.map((p) => ({ path: `/projects/${p.slug}`, lastModified: p.date, priority: 0.8 })),
    ...posts.map((p) => ({ path: `/blog/${p.slug}`, lastModified: p.date, priority: 0.7 })),
  ];

  return pages.flatMap(({ path, lastModified, priority }) =>
    locales.map((locale) => ({
      url: absUrl(`/${locale}${path}`),
      ...(lastModified && { lastModified }),
      priority,
      alternates: {
        languages: { tr: absUrl(`/tr${path}`), en: absUrl(`/en${path}`) },
      },
    })),
  );
}
