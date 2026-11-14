import fs from "node:fs/promises";
import path from "node:path";
import type { Locale } from "@/i18n/config";

/*
 * İçerikler src/content altında MDX dosyaları olarak durur:
 *   src/content/projects/<dil>/<slug>.mdx
 *   src/content/posts/<dil>/<slug>.mdx
 * Her dosya en üstte `export const metadata = {...}` ile bilgilerini verir.
 * Yeni proje/yazı eklemek için yeni bir .mdx dosyası oluşturman yeterli.
 */

import type { Category } from "./categories";
export { categories, type Category } from "./categories";

export type ProjectMeta = {
  title: string;
  summary: string;
  /** "2025" veya "2025-03" */
  date: string;
  category: Category;
  role?: string;
  tags: string[];
  /** Kartta gösterilen kısa sonuç, ör. "Duruş süresi %40 azaldı" */
  highlight?: string;
  featured?: boolean;
  confidential?: boolean;
  link?: string;
};

export type PostMeta = {
  title: string;
  summary: string;
  /** "2025-10-02" */
  date: string;
};

export type Project = ProjectMeta & { slug: string };
export type Post = PostMeta & { slug: string };

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

async function listSlugs(kind: "projects" | "posts", locale: Locale) {
  "use cache";
  try {
    const files = await fs.readdir(path.join(CONTENT_DIR, kind, locale));
    return files
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

const byDateDesc = (a: { date: string }, b: { date: string }) =>
  b.date.localeCompare(a.date);

export async function getProjects(locale: Locale): Promise<Project[]> {
  "use cache";
  const slugs = await listSlugs("projects", locale);
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const mod = await import(`@/content/projects/${locale}/${slug}.mdx`);
      return { ...(mod.metadata as ProjectMeta), slug };
    }),
  );
  return items.sort(byDateDesc);
}

export async function getPosts(locale: Locale): Promise<Post[]> {
  "use cache";
  const slugs = await listSlugs("posts", locale);
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const mod = await import(`@/content/posts/${locale}/${slug}.mdx`);
      return { ...(mod.metadata as PostMeta), slug };
    }),
  );
  return items.sort(byDateDesc);
}

/** Proje sayfası için MDX bileşenini ve bilgilerini yükler. Yoksa null. */
export async function loadProject(locale: Locale, slug: string) {
  if (!(await listSlugs("projects", locale)).includes(slug)) return null;
  const mod = await import(`@/content/projects/${locale}/${slug}.mdx`);
  return {
    Content: mod.default as React.ComponentType,
    meta: { ...(mod.metadata as ProjectMeta), slug } as Project,
  };
}

export async function loadPost(locale: Locale, slug: string) {
  if (!(await listSlugs("posts", locale)).includes(slug)) return null;
  const mod = await import(`@/content/posts/${locale}/${slug}.mdx`);
  return {
    Content: mod.default as React.ComponentType,
    meta: { ...(mod.metadata as PostMeta), slug } as Post,
  };
}

export async function loadAbout(locale: Locale) {
  const mod = await import(`@/content/about/${locale}.mdx`);
  return mod.default as React.ComponentType;
}
