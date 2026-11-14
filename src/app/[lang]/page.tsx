import Image from "next/image";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getPosts, getProjects } from "@/lib/content";
import { otherSites, site } from "@/lib/site";
import { FeaturedProject, PostList, ProjectRow, SectionHeading, SiteCard } from "@/components/ui";

/** "**kalın**" işaretli metni vurgulu parçalara böler. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 ? (
          <strong key={i} className="font-normal text-zinc-950 dark:text-white">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const [projects, posts] = await Promise.all([getProjects(locale), getPosts(locale)]);

  const featured = projects.find((p) => p.featured) ?? projects[0];
  const selected = projects.filter((p) => p !== featured).slice(0, 4);
  const base = `/${locale}`;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
      {/* Giriş */}
      <section className="grid items-center gap-12 py-16 lg:min-h-[78vh] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 lg:py-24">
        <h1 className="order-2 max-w-2xl text-[2rem] leading-[1.18] font-light tracking-tight text-zinc-500 sm:text-4xl lg:order-1 xl:text-[2.75rem] dark:text-zinc-400">
          <RichText text={t.home.hero.replace("{name}", site.name)} />
        </h1>
        <div className="relative order-1 size-40 overflow-hidden rounded-full bg-zinc-100 sm:size-56 lg:order-2 lg:size-72 dark:bg-zinc-900">
          {site.photo ? (
            <Image
              src={site.photo}
              alt={t.home.photoAlt.replace("{name}", site.name)}
              fill
              priority
              sizes="(min-width: 1024px) 288px, 224px"
              className="object-cover"
            />
          ) : (
            <span
              aria-hidden
              className="grid size-full place-items-center text-6xl font-light text-zinc-400 lg:text-8xl dark:text-zinc-600"
            >
              {site.name.charAt(0)}
            </span>
          )}
        </div>
      </section>

      {/* Öne çıkan proje + son yazılar */}
      <section className="grid gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
        {featured && (
          <div>
            <SectionHeading title={t.home.featured} />
            <FeaturedProject project={featured} locale={locale} categoryLabel={t.categories[featured.category]} />
          </div>
        )}
        <div>
          <SectionHeading title={t.home.latestPosts} href={`${base}/blog`} linkLabel={t.home.allPosts} />
          <PostList posts={posts.slice(0, 5)} locale={locale} />
        </div>
      </section>

      {selected.length > 0 && (
        <section className="mt-20">
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

      <section className="mt-20">
        <SectionHeading title={t.home.sites} href={`${base}/sites`} linkLabel={t.home.allSites} />
        <ul className="grid gap-4 sm:grid-cols-2">
          {otherSites.slice(0, 4).map((s) => (
            <li key={s.url}>
              <SiteCard site={s} locale={locale} visitLabel={t.sites.visit} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
