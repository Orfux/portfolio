import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Category, Post, Project } from "@/lib/content";
import type { OtherSite } from "@/lib/site";
import { formatDate, formatShortDate } from "@/lib/format";
import { Icon } from "./icons";

export function Container({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-3xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="pt-16 pb-10 lg:pt-24">
      <h1 className="text-4xl font-light tracking-tight text-zinc-950 dark:text-white">{title}</h1>
      {description && <p className="mt-3 max-w-xl text-zinc-500 dark:text-zinc-400">{description}</p>}
    </header>
  );
}

export function SectionHeading({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-5 flex items-baseline justify-between">
      <h2 className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">{title}</h2>
      {href && (
        <Link href={href} className="text-sm text-zinc-500 transition hover:text-zinc-950 dark:hover:text-white">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

const categoryStyles: Record<Category, string> = {
  web: "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
  automation: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
  energy: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  ai: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
};

export function Tag({ children, category }: { children: React.ReactNode; category?: Category }) {
  const style = category
    ? categoryStyles[category]
    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400";
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>{children}</span>;
}

/** Referanstaki gibi kesik çizgili, kategoriye göre çizim. */
function LineArt({ category }: { category: Category }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeDasharray: "4 5",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 200 160" className="h-full w-auto text-zinc-400 dark:text-zinc-600" aria-hidden>
      {category === "automation" && (
        <g {...common}>
          {/* PLC rafı: güç kaynağı + CPU + G/Ç modülleri */}
          <rect x="30" y="30" width="140" height="100" rx="8" />
          <path d="M30 50h140M30 110h140" />
          <path d="M62 50v60M94 50v60M126 50v60" />
          <circle cx="46" cy="66" r="4" />
          <circle cx="46" cy="80" r="4" />
          <path d="M104 64h12M104 74h12M104 84h12M136 64h12M136 74h12M136 84h12" />
          <path d="M78 130v14h44v-14" />
        </g>
      )}
      {category === "web" && (
        <g {...common}>
          <rect x="25" y="30" width="150" height="100" rx="8" />
          <path d="M25 50h150" />
          <circle cx="38" cy="40" r="2.5" />
          <circle cx="48" cy="40" r="2.5" />
          <circle cx="58" cy="40" r="2.5" />
          <rect x="40" y="64" width="54" height="50" rx="4" />
          <path d="M108 68h52M108 82h40M108 96h48M108 110h30" />
        </g>
      )}
      {category === "energy" && (
        <g {...common}>
          {/* Uydu gövdesi + güneş panelleri */}
          <rect x="80" y="55" width="40" height="50" rx="6" />
          <path d="M80 80H62M120 80h18" />
          <rect x="18" y="62" width="44" height="36" rx="3" />
          <rect x="138" y="62" width="44" height="36" rx="3" />
          <path d="M33 62v36M47 62v36M153 62v36M167 62v36" />
          <path d="M100 55V38" />
          <circle cx="100" cy="32" r="6" />
          <path d="M92 105v14h16v-14" />
        </g>
      )}
      {category === "ai" && (
        <g {...common}>
          {/* Yonga + bağlantılar */}
          <rect x="60" y="40" width="80" height="80" rx="10" />
          <rect x="80" y="60" width="40" height="40" rx="6" />
          <path d="M75 40V22M100 40V22M125 40V22M75 120v18M100 120v18M125 120v18" />
          <path d="M60 60H40M60 80H40M60 100H40M140 60h20M140 80h20M140 100h20" />
        </g>
      )}
    </svg>
  );
}

export function FeaturedProject({
  project,
  locale,
  categoryLabel,
}: {
  project: Project;
  locale: Locale;
  categoryLabel: string;
}) {
  return (
    <Link
      href={`/${locale}/projects/${project.slug}`}
      className="group block overflow-hidden rounded-2xl border border-zinc-200 transition hover:border-zinc-300 dark:border-zinc-800/80 dark:hover:border-zinc-700"
    >
      <div className="grid h-64 place-items-center p-6 transition duration-500 group-hover:scale-[1.03]">
        <LineArt category={project.category} />
      </div>
      <div className="border-t border-zinc-200 p-6 dark:border-zinc-800/80">
        <div className="flex flex-wrap gap-2">
          <Tag category={project.category}>{categoryLabel}</Tag>
          {project.tags.slice(0, 2).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <h3 className="mt-4 text-xl font-medium tracking-tight text-zinc-950 dark:text-white">{project.title}</h3>
        {project.highlight && (
          <p className="mt-1 text-2xl font-light tracking-tight text-zinc-500 dark:text-zinc-400">
            {project.highlight}
          </p>
        )}
      </div>
    </Link>
  );
}

export function ProjectRow({
  project,
  locale,
  categoryLabel,
}: {
  project: Project;
  locale: Locale;
  categoryLabel: string;
}) {
  return (
    <Link
      href={`/${locale}/projects/${project.slug}`}
      className="group -mx-3 flex flex-col gap-1 rounded-lg px-3 py-3 transition hover:bg-zinc-100 sm:flex-row sm:items-baseline sm:gap-4 dark:hover:bg-zinc-900"
    >
      <span className="w-28 shrink-0">
        <Tag category={project.category}>{categoryLabel}</Tag>
      </span>
      <span className="flex-1">
        <span className="font-medium text-zinc-950 dark:text-white">{project.title}</span>
        <span className="block text-sm text-zinc-500 dark:text-zinc-400">{project.summary}</span>
      </span>
      <span className="shrink-0 font-mono text-xs text-zinc-500 tabular-nums">{formatDate(project.date, locale)}</span>
    </Link>
  );
}

export function PostList({ posts, locale }: { posts: Post[]; locale: Locale }) {
  return (
    <ul className="space-y-1">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/${locale}/blog/${post.slug}`}
            className="group -mx-3 flex items-baseline justify-between gap-6 rounded-lg px-3 py-4 transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <span className="font-medium text-zinc-800 group-hover:text-zinc-950 dark:text-zinc-200 dark:group-hover:text-white">
              {post.title}
            </span>
            <time dateTime={post.date} className="shrink-0 font-mono text-xs text-zinc-500 tabular-nums">
              {formatShortDate(post.date, locale)}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Ekran görüntülü site kartı (Diğer Sitelerim). */
export function SiteCard({ site, locale, visitLabel }: { site: OtherSite; locale: Locale; visitLabel: string }) {
  return (
    <a
      href={site.url}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 transition hover:border-zinc-300 dark:border-zinc-800/80 dark:hover:border-zinc-700"
    >
      {site.image && (
        <div className="relative aspect-[16/10] overflow-hidden border-b border-zinc-200 bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900">
          <Image
            src={site.image}
            alt={site.name}
            fill
            sizes="(min-width: 1024px) 480px, 100vw"
            className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <span className="flex items-center justify-between gap-3">
          <span className="font-medium text-zinc-950 dark:text-white">{site.name}</span>
          <Icon name="arrowUpRight" className="size-4 text-zinc-400 transition group-hover:text-zinc-950 dark:group-hover:text-white" />
        </span>
        <span className="mt-1 font-mono text-xs text-zinc-500">{new URL(site.url).host}</span>
        <span className="mt-3 flex-1 text-sm text-zinc-600 dark:text-zinc-400">{site.description[locale]}</span>
        <span className="mt-4 flex flex-wrap items-center gap-1.5">
          {site.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          <span className="sr-only">{visitLabel}</span>
        </span>
      </div>
    </a>
  );
}
