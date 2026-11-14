import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getPosts } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { Container, PageHeader, PostList } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return pageMeta({ locale, path: "/blog", title: t.blog.title, description: t.blog.description });
}

export default async function BlogPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const posts = await getPosts(locale);

  return (
    <Container>
      <PageHeader title={t.blog.title} description={t.blog.description} />
      {posts.length ? <PostList posts={posts} locale={locale} /> : <p className="text-zinc-500">{t.blog.empty}</p>}
    </Container>
  );
}
