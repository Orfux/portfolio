import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { locales } from "@/i18n/config";
import { getProjects, loadProject } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { Container, Tag } from "@/components/ui";

export async function generateStaticParams() {
  const all = await Promise.all(locales.map((l) => getProjects(l)));
  const slugs = new Set(all.flat().map((p) => p.slug));
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await loadProject(await getLocale(), slug);
  if (!project) return {};
  return { title: project.meta.title, description: project.meta.summary };
}

// Build'de listelenmeyen bir adres açılırsa Suspense yedeği anında gösterilir,
// sayfa arka planda hazırlanıp önbelleğe alınır.
export default function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  return (
    <Suspense fallback={<Container className="py-24" />}>
      <Project params={params} />
    </Suspense>
  );
}

async function Project({ params }: Pick<PageProps<"/[lang]/projects/[slug]">, "params">) {
  const { slug } = await params;
  const locale = await getLocale();
  const project = await loadProject(locale, slug);
  if (!project) notFound();

  const t = await getDictionary(locale);
  const { meta, Content } = project;

  const facts = [
    { label: t.projects.year, value: formatDate(meta.date, locale) },
    meta.role && { label: t.projects.role, value: meta.role },
    { label: t.projects.stack, value: meta.tags.join(", ") },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <Container>
      <article className="pt-12">
        <Link href={`/${locale}/projects`} className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-zinc-100">
          ← {t.projects.back}
        </Link>

        <header className="mt-8 mb-10">
          <Tag category={meta.category}>{t.categories[meta.category]}</Tag>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
            {meta.title}
          </h1>
          {meta.highlight && (
            <p className="mt-2 text-2xl font-light tracking-tight text-zinc-500 dark:text-zinc-400">{meta.highlight}</p>
          )}
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">{meta.summary}</p>

          <dl className="mt-8 grid gap-4 border-y border-zinc-200 py-5 text-sm sm:grid-cols-3 dark:border-zinc-800">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="font-mono text-xs tracking-wider text-zinc-400 uppercase">{f.label}</dt>
                <dd className="mt-1 text-zinc-900 dark:text-zinc-100">{f.value}</dd>
              </div>
            ))}
          </dl>

          {meta.link && (
            <a
              href={meta.link}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block rounded-full bg-zinc-900 px-4 py-1.5 text-sm text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {t.projects.visit} ↗
            </a>
          )}
          {meta.confidential && (
            <p className="mt-6 rounded-lg border border-dashed border-zinc-300 px-4 py-3 text-sm text-zinc-500 dark:border-zinc-700">
              🔒 {t.projects.confidential}
            </p>
          )}
        </header>

        <div className="prose prose-zinc dark:prose-invert prose-a:underline-offset-4 prose-a:decoration-zinc-400 max-w-none">
          <Content />
        </div>
      </article>
    </Container>
  );
}
