import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { locales } from "@/i18n/config";
import { getPosts, loadPost } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { Container } from "@/components/ui";

export async function generateStaticParams() {
  const all = await Promise.all(locales.map((l) => getPosts(l)));
  const slugs = new Set(all.flat().map((p) => p.slug));
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(await getLocale(), slug);
  if (!post) return {};
  return { title: post.meta.title, description: post.meta.summary };
}

// Build'de listelenmeyen bir adres açılırsa Suspense yedeği anında gösterilir,
// sayfa arka planda hazırlanıp önbelleğe alınır.
export default function PostPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  return (
    <Suspense fallback={<Container className="py-24" />}>
      <Post params={params} />
    </Suspense>
  );
}

async function Post({ params }: Pick<PageProps<"/[lang]/blog/[slug]">, "params">) {
  const { slug } = await params;
  const locale = await getLocale();
  const post = await loadPost(locale, slug);
  if (!post) notFound();

  const t = await getDictionary(locale);
  const { meta, Content } = post;

  return (
    <Container>
      <article className="pt-12">
        <Link href={`/${locale}/blog`} className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-zinc-100">
          ← {t.blog.back}
        </Link>
        <header className="mt-8 mb-10">
          <time dateTime={meta.date} className="font-mono text-xs text-zinc-400">
            {formatDate(meta.date, locale)}
          </time>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
            {meta.title}
          </h1>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">{meta.summary}</p>
        </header>
        <div className="prose prose-zinc dark:prose-invert prose-a:underline-offset-4 prose-a:decoration-zinc-400 max-w-none">
          <Content />
        </div>
      </article>
    </Container>
  );
}
