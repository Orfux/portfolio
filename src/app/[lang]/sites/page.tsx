import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { otherSites } from "@/lib/site";
import { Container, PageHeader, Tag } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.sites.title, description: t.sites.description };
}

export default async function SitesPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  return (
    <Container>
      <PageHeader title={t.sites.title} description={t.sites.description} />
      <ul className="grid gap-4 sm:grid-cols-2">
        {otherSites.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col rounded-2xl border border-zinc-200 p-5 transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
            >
              <span className="flex items-center justify-between">
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{s.name}</span>
                <span className="text-zinc-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </span>
              <span className="mt-1 font-mono text-xs text-zinc-400">{new URL(s.url).host}</span>
              <span className="mt-3 flex-1 text-sm text-zinc-500 dark:text-zinc-400">{s.description[locale]}</span>
              <span className="mt-4 flex flex-wrap gap-1.5">
                {s.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Container>
  );
}
