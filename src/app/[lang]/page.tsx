import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getPosts, getProjects } from "@/lib/content";
import { otherSites, site } from "@/lib/site";
import { Greeting } from "@/components/greeting";
import { Container, FeaturedProject, PostList, ProjectRow, SectionHeading } from "@/components/ui";

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const [projects, posts] = await Promise.all([getProjects(locale), getPosts(locale)]);

  const featured = projects.find((p) => p.featured) ?? projects[0];
  const selected = projects.filter((p) => p !== featured).slice(0, 4);
  const base = `/${locale}`;

  return (
    <Container>
      {/* Giriş */}
      <section className="pt-16 pb-14 sm:pt-24">
        <div
          aria-hidden
          className="mb-8 grid size-16 place-items-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-xl font-semibold text-white shadow-sm"
        >
          {site.name.charAt(0)}
        </div>
        <p className="font-mono text-sm text-zinc-400 dark:text-zinc-500">
          <Greeting labels={t.greeting} />
        </p>
        <h1 className="mt-2 max-w-2xl text-2xl leading-snug font-medium tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
          {site.name} <span className="text-zinc-500 dark:text-zinc-400">{t.home.intro}</span>
        </h1>
        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <Link
            href={`${base}/projects`}
            className="rounded-full bg-zinc-900 px-4 py-1.5 text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {t.nav.projects}
          </Link>
          <Link
            href={`${base}/about`}
            className="rounded-full border border-zinc-200 px-4 py-1.5 transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            {t.nav.about}
          </Link>
        </div>
      </section>

      {featured && (
        <section className="mb-16">
          <SectionHeading title={t.home.featured} />
          <FeaturedProject project={featured} locale={locale} categoryLabel={t.categories[featured.category]} />
        </section>
      )}

      {selected.length > 0 && (
        <section className="mb-16">
          <SectionHeading title={t.home.selected} href={`${base}/projects`} linkLabel={t.home.allProjects} />
          <ul>
            {selected.map((p) => (
              <li key={p.slug}>
                <ProjectRow project={p} locale={locale} categoryLabel={t.categories[p.category]} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {posts.length > 0 && (
        <section className="mb-16">
          <SectionHeading title={t.home.latestPosts} href={`${base}/blog`} linkLabel={t.home.allPosts} />
          <PostList posts={posts.slice(0, 5)} locale={locale} />
        </section>
      )}

      <section>
        <SectionHeading title={t.home.sites} href={`${base}/sites`} linkLabel={t.home.allSites} />
        <ul className="grid gap-3 sm:grid-cols-3">
          {otherSites.slice(0, 3).map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="block h-full rounded-xl border border-zinc-200 p-4 transition hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{s.name} ↗</span>
                <span className="mt-1 block font-mono text-xs text-zinc-400">{new URL(s.url).host}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
